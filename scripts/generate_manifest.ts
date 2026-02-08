// Auto-generate modules manifest so Deno Deploy Classic includes modules
// Usage: deno run -A scripts/generate_manifest.ts

import { join } from "@std/path";

const cwd = Deno.cwd();
const modulesDir = join(cwd, "modules");
const outPaths = [
  join(cwd, "manifest.ts"),
];

function toIdentifier(name: string) {
  // Replace invalid identifier chars with underscore
  let id = name.replace(/[^a-zA-Z0-9_$]/g, "_");
  if (/^[0-9]/.test(id)) id = `m_${id}`;
  return id;
}

async function main() {
  try {
    const names: string[] = [];
    for await (const entry of Deno.readDir(modulesDir)) {
      if (
        entry.isDirectory && !entry.name.startsWith("test_") &&
        entry.name !== "manifest.ts"
      ) {
        names.push(entry.name);
      }
    }

    names.sort((a, b) => {
      if (a === "index") return -1;
      if (b === "index") return 1;
      return a.localeCompare(b);
    });

    // No header comments to keep manifest minimal and easier to test.
    const header = "";

    // Emit paths relative to the repository root. Modules live under ./modules.
    const body = names.map((n) =>
      `export * as ${toIdentifier(n)} from "./modules/${n}/mod.ts";`
    ).join("\n") + "\n";

    for (const out of outPaths) {
      const dir = out.substring(0, out.lastIndexOf("/"));
      try {
        if (dir) {
          await Deno.mkdir(dir, { recursive: true });
        }
      } catch {
        // ignore
      }
      const tmp = out + ".tmp";
      await Deno.writeTextFile(tmp, header + body);
      await Deno.rename(tmp, out);
      console.log(`Wrote manifest: ${out}`);
    }

    console.log("Manifest generation complete.");
  } catch (err) {
    console.error("Failed to generate manifest:", err);
    Deno.exit(1);
  }
}

if (import.meta.main) await main();
