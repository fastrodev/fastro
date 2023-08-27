// @deno-types="https://deno.land/x/esbuild@v0.18.11/mod.d.ts"
import * as esbuild from "https://deno.land/x/esbuild@v0.18.11/mod.js";

const esbuildWasmURL = new URL("./esbuild_v0.18.11.wasm", import.meta.url).href;

export { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts";
export { esbuild, esbuildWasmURL };
