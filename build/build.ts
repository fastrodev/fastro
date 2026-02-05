import { build, createClient, deleteClient, getModulesWithApp } from "./mod.ts";

export async function performBuild() {
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
