import { denoPlugins, esbuild } from "./deps.ts";

export async function build(folder: string, elementName: string) {
  try {
    await esbuild.initialize({});
    const cwd = Deno.cwd();
    const hydrateTarget =
      `${cwd}/${folder}/${elementName.toLowerCase()}.hydrate.tsx`;
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
      jsxImportSource: "preact",
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
  } catch (error) {
    console.error(error);
  }
}
