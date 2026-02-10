import { build, createClient, deleteClient, getModulesWithApp } from "./mod.ts";
import { generateManifest } from "../scripts/generate_manifest.ts";

const recentlyBuilt = new Map<string, number>();
const BUILD_COOLDOWN_MS = 200;

export async function rebuild(modulesToRebuild?: string[]) {
  if (modulesToRebuild && modulesToRebuild.length > 0) {
    console.log("Rebuilding specified modules...", modulesToRebuild);
    const validModules: string[] = [];
    for (const mod of modulesToRebuild) {
      let hasApp = false;
      try {
        const stat = await Deno.stat(`./modules/${mod}/App.tsx`);
        if (stat && stat.isFile) hasApp = true;
      } catch (_) {
        // ignore
      }

      if (!hasApp) {
        try {
          const stat = await Deno.stat(`./modules/${mod}/spa.tsx`);
          if (stat && stat.isFile) hasApp = true;
        } catch (_) {
          // ignore
        }
      }

      if (hasApp) {
        const last = recentlyBuilt.get(mod) || 0;
        if (Date.now() - last < BUILD_COOLDOWN_MS) {
          console.log(`Skipping '${mod}': built recently.`);
        } else {
          validModules.push(mod);
        }
      } else {
        console.log(`Skipping '${mod}': no App.tsx or spa.tsx found.`);
      }
    }

    if (validModules.length === 0) {
      console.log("No valid modules to rebuild.");
      return;
    }

    for (const mod of validModules) {
      await createClient(mod);
      await build(mod);
      await deleteClient(mod);
      recentlyBuilt.set(mod, Date.now());
      console.log(`Rebuild for module '${mod}' completed.`);
    }
    // Signal that build is finished
    try {
      await Deno.writeTextFile(".build_done", Date.now().toString());
    } catch (_) {
      // ignore
    }
    return;
  }

  console.log("Rebuilding all modules...");
  const modules = await getModulesWithApp();
  for (const mod of modules) {
    const last = recentlyBuilt.get(mod) || 0;
    if (Date.now() - last < BUILD_COOLDOWN_MS) {
      console.log(`Skipping '${mod}': built recently.`);
      continue;
    }
    await createClient(mod);
    await build(mod);
    await deleteClient(mod);
    recentlyBuilt.set(mod, Date.now());
    console.log(`Rebuild for module '${mod}' completed.`);
  }
  // Signal that build is finished
  try {
    await Deno.writeTextFile(".build_done", Date.now().toString());
  } catch (_) {
    // ignore
  }
}

export async function startWatcher() {
  const paths = [
    "./modules",
    "./components",
    "./app",
    "./core",
    "./middlewares",
    "./public",
  ];

  const existingPaths = [];
  for (const path of paths) {
    try {
      await Deno.stat(path);
      existingPaths.push(path);
    } catch (_) {
      // ignore
    }
  }

  const watcher = Deno.watchFs(existingPaths);
  let rebuildTimeout: number | undefined;
  let isRebuilding = false;

  // i think we need to detect all changes now, not just first one
  const pendingAffectedModules = new Set<string>();
  let pendingComponentsChanged = false;
  let pendingModulesChanged = false;

  for await (const event of watcher) {
    if (
      event.kind === "modify" || event.kind === "create" ||
      event.kind === "remove"
    ) {
      if (isRebuilding) {
        continue;
      }

      if (rebuildTimeout) {
        clearTimeout(rebuildTimeout);
      }

      let hasRelevantChange = false;

      for (const p of event.paths) {
        if (
          p.includes("Client.tsx") || p.includes(".build_tmp") ||
          p.includes(".build_done")
        ) continue;

        const m = p.match(/(?:[/\\]|^)modules(?:[/\\])([^/\\]+)/);
        if (m && m[1]) {
          const modName = m[1];
          pendingAffectedModules.add(modName);
          // 'index' module aggregates other modules (profile, product, etc), so it needs rebuild too
          if (modName !== "index") {
            pendingAffectedModules.add("index");
          }
          // If the changed module folder doesn't contain an App.tsx or spa.tsx
          // it's likely a shared/components module — treat as component change
          // so we trigger a full rebuild instead of attempting to rebuild the
          // module itself (which would be skipped later).
          try {
            const statApp = await Deno.stat(`./modules/${modName}/App.tsx`)
              .catch(() => null);
            const statSpa = await Deno.stat(`./modules/${modName}/spa.tsx`)
              .catch(() => null);
            if (!(statApp && statApp.isFile) && !(statSpa && statSpa.isFile)) {
              pendingComponentsChanged = true;
            }
          } catch (_) {
            // ignore
          }
          hasRelevantChange = true;
        }
        // mark any modules/ root change so manifest can be regenerated
        if (p.match(/(?:[/\\]|^)modules(?:[/\\])/)) {
          pendingModulesChanged = true;
          hasRelevantChange = true;
        }
        if (
          p.match(/(?:[/\\]|^)components(?:[/\\])/) ||
          p.match(/(?:[/\\]|^)app(?:[/\\])/) ||
          p.match(/(?:[/\\]|^)core(?:[/\\])/) ||
          p.match(/(?:[/\\]|^)middlewares(?:[/\\])/) ||
          p.match(/(?:[/\\]|^)public(?:[/\\])/)
        ) {
          // Treat changes under `public` as component-level changes so that
          // edits which affect built client artifacts still trigger a full
          // rebuild when appropriate.
          pendingComponentsChanged = true;
          hasRelevantChange = true;
        }
      }

      if (!hasRelevantChange) continue;

      rebuildTimeout = setTimeout(async () => {
        isRebuilding = true;
        try {
          // Regenerate manifest when there are any changes under modules
          try {
            if (pendingModulesChanged || pendingAffectedModules.size > 0) {
              await generateManifest();
            }
          } catch (e) {
            console.warn("generateManifest failed:", e);
          }

          if (pendingComponentsChanged || pendingAffectedModules.size === 0) {
            await rebuild();
          } else {
            await rebuild(Array.from(pendingAffectedModules));
          }
        } finally {
          isRebuilding = false;
          rebuildTimeout = undefined;
          pendingAffectedModules.clear();
          pendingComponentsChanged = false;
          pendingModulesChanged = false;
        }
      }, 100);
    }
  }
}

if (import.meta.main) {
  // Ensure manifest exists before initial rebuild
  try {
    await generateManifest();
  } catch (e) {
    console.warn("generateManifest (initial) failed:", e);
  }
  await rebuild();
  await startWatcher();
}
