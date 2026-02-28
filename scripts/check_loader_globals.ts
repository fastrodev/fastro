import server, { _getMiddlewareCount, _getRoutePaths } from "../core/server.ts";
import { type App, autoRegisterModules } from "../core/loader.ts";
import * as manifestObj from "../manifest.ts";

async function main() {
  console.log("Starting check: running autoRegisterModules...");
  await autoRegisterModules(server as unknown as App, {
    manifest: manifestObj as unknown as Record<string, unknown>,
  });
  console.log("✅ autoRegisterModules finished");
  console.log("Global middleware count:", _getMiddlewareCount());
  console.log("Registered routes:", _getRoutePaths().length, _getRoutePaths());
}

main().catch((e) => {
  console.error(e);
  Deno.exit(1);
});
