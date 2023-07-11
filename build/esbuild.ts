import { denoPlugins, esbuild, esbuildWasmURL } from "./deps.ts";

async function initEsbuild() {
  // deno-lint-ignore no-deprecated-deno-api
  if (Deno.run === undefined) {
    await esbuild.initialize({
      wasmURL: esbuildWasmURL,
      worker: false,
    });
    console.log("===ESBUILD WASM===");
  } else {
    await esbuild.initialize({});
  }
}

export class Esbuild {
  #elementName: string;
  // #staticFolder: string;

  constructor(name: string) {
    this.#elementName = name;
    // this.#staticFolder = folder;
  }

  build = async () => {
    await initEsbuild();

    const cwd = Deno.cwd();
    const hydrateTarget =
      `${cwd}/hydrate/${this.#elementName.toLowerCase()}.hydrate.tsx`;
    // const bundlePath =
    //   `${cwd}/${this.#staticFolder}/js/${this.#elementName.toLowerCase()}.js`;

    const absWorkingDir = Deno.cwd();
    const esbuildRes = await esbuild.build({
      plugins: [...denoPlugins()],
      entryPoints: [hydrateTarget],
      format: "esm",
      jsxImportSource: "react",
      absWorkingDir,
      // outfile: bundlePath,
      bundle: true,
      treeShaking: true,
      write: false,
      minify: true,
      minifySyntax: true,
      minifyWhitespace: true,
    });

    if (esbuildRes.errors.length > 0) {
      throw esbuildRes.errors;
    }

    esbuild.stop();
    return esbuildRes;
  };
}

// const b = new Esbuild("h");

// b.build();
