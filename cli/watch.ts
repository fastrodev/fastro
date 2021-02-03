// deno-lint-ignore-file no-explicit-any
import { start } from "./controller.ts";
import { getArguments, serve } from "./handler.ts";

const args = getArguments(Deno.args);
const { port } = args;

export async function watch() {
  Deno.env.set("DENO_ENV", "development");
  start();
  const watcher = Deno.watchFs(Deno.cwd());
  const promises: any[] = [];
  for await (const event of watcher) {
    if (event.kind === "modify") {
      const promise = new Promise((resolve) => {
        serve(port, args);
        resolve("File changes detected!");
      });
      promises.push(promise);
    }
    Promise.race(promises)
      .then((value) => {
        console.log(value);
      }, (error) => {
        console.error(error.message);
      });
  }
}
