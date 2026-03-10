import { generateManifest } from "./src/generator.ts";

if (import.meta.main) {
  await generateManifest();
}
