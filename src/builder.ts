import { denoEsbuildPlugin, esbuild, stdPath } from "./deps.ts";
const { denoPlugin } = denoEsbuildPlugin;
const { join } = stdPath;
import { generateManifest } from "./generator.ts";

async function build(modulePath?: string, spa?: boolean) {
  const cwd = Deno.cwd();
  let path = join(cwd, ".build_tmp", `${modulePath}_Client.tsx`);
  if (spa) {
    path = join(cwd, "modules", `${modulePath}`, "spa.tsx");
  }

  try {
    const configPath = join(cwd, "deno.json");

    try {
      await Deno.mkdir(join(cwd, ".build_tmp"), { recursive: true });
    } catch (_) {
      // ignore
    }

    // Esbuild build
    const esbuildRes = await esbuild.build({
      plugins: [denoPlugin({
        configPath,
      })],
      entryPoints: [path],
      outfile: join(cwd, "public", "js", `${modulePath}`, "client.js"),

      // Bundling
      format: "esm",
      bundle: true,
      sourcemap: true,
      // Only minify in production to make dev builds readable (non-minified)
      minify: Deno.env.get("ENV") === "production",

      // Target & Platform
      platform: "browser",
      target: ["chrome100", "firefox100", "safari15", "edge100"],

      // Loader & JSX
      loader: {
        ".js": "jsx",
        ".png": "file",
        ".jpg": "file",
        ".svg": "dataurl",
      },
      jsx: "automatic",
      // Use the automatic JSX runtime (recommended for React 17+).
      // Do not set `jsxFactory` when using the automatic runtime — it can
      // produce incorrect element factories and runtime errors in production.
      jsxFragment: "React.Fragment",
    });
    return esbuildRes;
  } catch (error) {
    console.error(error);
  }
}

async function createClient(modulePath: string) {
  const cwd = Deno.cwd();
  const content = `import { hydrateRoot } from "npm:react-dom@^19.2.4/client";
import { App } from "../modules/${modulePath}/App.tsx";
const el = document.getElementById("initial");
const props = el
  ? JSON.parse(el.textContent || "")
  : {};
if (el && el.parentNode) el.parentNode.removeChild(el);
hydrateRoot(document.getElementById("root")!, <App {...(props as Record<string, unknown>)} />);
`;

  const filePath = join(cwd, ".build_tmp", `${modulePath}_Client.tsx`);
  try {
    await Deno.mkdir(join(cwd, ".build_tmp"), { recursive: true });
  } catch (_) {
    // ignore
  }
  await Deno.writeTextFile(filePath, content);
}

async function deleteClient(modulePath: string) {
  const cwd = Deno.cwd();
  const filePath = join(cwd, ".build_tmp", `${modulePath}_Client.tsx`);
  try {
    await Deno.remove(filePath);
  } catch (_error) {
    // ignore
  }
}

async function getModulesWithApp(): Promise<string[]> {
  const cwd = Deno.cwd();
  const modules: string[] = [];
  try {
    for await (const entry of Deno.readDir(join(cwd, "modules"))) {
      if (entry.isDirectory) {
        const dirPath = join(cwd, "modules", entry.name);
        let hasSpa = false;
        let hasApp = false;
        for await (const file of Deno.readDir(dirPath)) {
          if (file.isFile) {
            if (file.name === "spa.tsx") {
              hasSpa = true;
            } else if (file.name === "App.tsx") {
              hasApp = true;
            }
          }
        }
        if (hasSpa || hasApp) {
          modules.push(entry.name);
        }
      }
    }
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) {
      throw e;
    }
  }
  return modules;
}

async function run() {
  const cwd = Deno.cwd();
  try {
    await generateManifest();
  } catch (e) {
    console.warn("generateManifest failed:", e);
  }
  const modules = await getModulesWithApp();
  for (const mod of modules) {
    const hasApp = await Deno.stat(join(cwd, "modules", mod, "App.tsx")).then(
      () => true,
    )
      .catch(() => false);
    if (hasApp) {
      await createClient(mod);
      await build(mod);
      await deleteClient(mod);
    }
  }
}

export { build, createClient, deleteClient, getModulesWithApp, run };
