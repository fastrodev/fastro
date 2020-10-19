import { start } from "./controller.ts";
import { getArguments, serve } from "./handler.ts";

const args = getArguments(Deno.args);
const { port } = args;

export async function watch() {
  Deno.env.set("DENO_ENV", "development");
  start();
  const watcher = Deno.watchFs(Deno.cwd());
  for await (const event of watcher) {
    if (event.kind === "access") {
      console.log("File change detected! Restarting!");
      serve(port, args);
    }
  }
}
