import { BUILD_ID, hydrateFolder } from "../http/server.ts";
import { denoPlugins, esbuild, esbuildWasmURL } from "./deps.ts";

export class Esbuild {
  #elementName: string;

  constructor(name: string) {
    this.#elementName = name;
  }

  #initEsbuild = async () => {
    // deno-lint-ignore no-deprecated-deno-api
    if (Deno.run === undefined) {
      await esbuild.initialize({
        wasmURL: esbuildWasmURL,
        worker: false,
      });
    } else {
      await esbuild.initialize({});
    }
  };

  build = async () => {
    try {
      await this.#initEsbuild();
      const cwd = Deno.cwd();
      const hydrateTarget =
        `${cwd}/${hydrateFolder}/${this.#elementName.toLowerCase()}.hydrate.tsx`;
      const esbuildRes = await esbuild.build({
        plugins: [...denoPlugins()],
        write: true,
        entryPoints: [hydrateTarget],
        outfile: `static/js/${this.#elementName.toLowerCase()}.js`,
        platform: "browser",
        target: ["chrome99", "firefox99", "safari15"],
        format: "esm",
        jsxImportSource: "react",
        jsxFactory: "h",
        jsxFragment: "Fragment",
        absWorkingDir: cwd,
        bundle: true,
        treeShaking: true,
        minify: true,
        minifySyntax: true,
        minifyWhitespace: true,
      });
      return esbuildRes;
    } finally {
      // esbuild.stop();
    }
  };

  stop = () => {
    esbuild.stop();
  };
}
