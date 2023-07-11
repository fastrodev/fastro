export {
  fromFileUrl,
  toFileUrl,
} from "https://deno.land/std@0.193.0/path/mod.ts";
export { esbuild, esbuildWasm as esbuildTypes, esbuildWasmURL };

// @deno-types="https://deno.land/x/esbuild@v0.18.11/mod.d.ts"
import * as esbuildNative from "https://deno.land/x/esbuild@v0.18.11/mod.js";
import * as esbuildWasm from "https://deno.land/x/esbuild@v0.18.11/wasm.js";
// @ts-ignore trust me
// deno-lint-ignore no-deprecated-deno-api
const esbuild: typeof esbuildWasm = Deno.run === undefined
  ? esbuildWasm
  : esbuildNative;
const esbuildWasmURL = new URL("./esbuild_v0.18.11.wasm", import.meta.url).href;

export { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts";
