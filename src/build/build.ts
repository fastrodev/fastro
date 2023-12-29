import { denoPlugins, esbuild } from "./deps.ts";

export async function build(elementName: string) {
  try {
    await esbuild.initialize({});
    const cwd = Deno.cwd();
    const hydrateTarget =
      `${cwd}/.fastro/${elementName.toLowerCase()}.hydrate.tsx`;
    const configPath = `${cwd}/deno.json`;
    const esbuildRes = await esbuild.build({
      plugins: [
        ...denoPlugins({
          configPath,
        }),
      ],
      write: true,
      entryPoints: [hydrateTarget],
      outfile: `static/js/${elementName.toLowerCase()}.js`,
      platform: "browser",
      target: ["chrome99", "firefox99", "safari15"],
      format: "esm",
      jsx: "automatic",
      jsxImportSource: "preact",
      jsxFactory: "h",
      jsxFragment: "Fragment",
      absWorkingDir: cwd,
      bundle: true,
      metafile: true,
      treeShaking: true,
      minify: true,
      minifySyntax: true,
      minifyWhitespace: true,
    });
    return esbuildRes;
  } catch (error) {
    console.error(error);
  }
}
