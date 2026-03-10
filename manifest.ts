import { generateManifest } from "./src/manifest.ts";

if (import.meta.main) await generateManifest();
