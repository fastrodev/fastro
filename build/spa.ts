import { build } from "./mod.ts";

export async function buildSpa() {
  await build("spa", true);
  console.log(`Build for SPA module 'spa' completed.`);
}

if (import.meta.main) {
  await buildSpa();
}
