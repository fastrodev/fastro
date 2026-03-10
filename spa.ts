import { build } from "./src/builder.ts";

if (import.meta.main) {
  await build("spa", true);
  console.log(`Build for SPA module 'spa' completed.`);
}
