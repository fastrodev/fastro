import * as esbuild from "esbuild";
import { denoPlugin } from "./plugin.ts";

async function build(modulePath?: string, spa?: boolean) {
  let path = `./.build_tmp/${modulePath}_Client.tsx`;
  if (spa) {
    path = `./modules/${modulePath}/spa.tsx`;
  }

  try {
    const cwd = Deno.cwd();
    const configPath = `${cwd}/deno.json`;

    // Ensure .build_tmp exists
    try {
      await Deno.mkdir("./.build_tmp", { recursive: true });
    } catch (_) {
      // ignore
    }

    // Esbuild build
    const esbuildRes = await esbuild.build({
      plugins: [denoPlugin({
        configPath,
      })],
      entryPoints: [path],
      outfile: `./public/js/${modulePath}/client.js`,

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
  const content = `import { hydrateRoot } from "react-dom/client";
import { App } from "../modules/${modulePath}/App.tsx";
const el = document.getElementById("initial");
const props = el
  ? JSON.parse(el.textContent || "")
  : {};
if (el && el.parentNode) el.parentNode.removeChild(el);
hydrateRoot(document.getElementById("root")!, <App {...(props as Record<string, unknown>)} />);
`;

  const filePath = `./.build_tmp/${modulePath}_Client.tsx`;
  try {
    await Deno.mkdir("./.build_tmp", { recursive: true });
  } catch (_) {
    // ignore
  }
  await Deno.writeTextFile(filePath, content);
}

async function deleteClient(modulePath: string) {
  const filePath = `./.build_tmp/${modulePath}_Client.tsx`;
  try {
    await Deno.remove(filePath);
  } catch (_error) {
    // ignore
  }
}

async function getModulesWithApp(): Promise<string[]> {
  const modules: string[] = [];
  for await (const entry of Deno.readDir("./modules")) {
    if (entry.isDirectory) {
      const dirPath = `./modules/${entry.name}`;
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
  return modules;
}

export { build, createClient, deleteClient, getModulesWithApp };
