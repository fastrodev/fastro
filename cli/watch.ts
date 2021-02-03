import { start } from "./controller.ts";
import { getArguments, serve } from "./handler.ts";

const args = getArguments(Deno.args);
const { port } = args;

export async function watch() {
  Deno.env.set("DENO_ENV", "development");
  start();
  const watcher = Deno.watchFs(Deno.cwd());
  const promises = []
  for await (const event of watcher) {
    if (event.kind === "modify") {
      const promise = new Promise((resolve, reject) => {
        serve(port, args);
        resolve("File change detected! Restarting!")
      });
      promises.push(promise)
      Promise.race(promises)
        .then(function (value) {
          console.log(value)
        }, function (error) {
          console.log(error.message);
        });
    }
  }
}
