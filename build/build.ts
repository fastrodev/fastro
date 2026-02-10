import { build, createClient, deleteClient, getModulesWithApp } from "./mod.ts";
import { generateManifest } from "../scripts/generate_manifest.ts";

export async function performBuild() {
  // Ensure manifest is generated before building client bundles
  try {
    await generateManifest();
  } catch (e) {
    console.warn("generateManifest failed:", e);
  }
  const modules = await getModulesWithApp();
  for (const mod of modules) {
    const hasApp = await Deno.stat(`./modules/${mod}/App.tsx`).then(() => true)
      .catch(() => false);
    if (hasApp) {
      await createClient(mod);
      await build(mod);
      await deleteClient(mod);
    }
  }
}

if (import.meta.main) {
  await performBuild();
}
