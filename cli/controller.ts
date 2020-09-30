// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import { getArguments, serve } from "./handler.ts";

const args = getArguments(Deno.args);
const { command: [cmd], port, production } = args;

if (!production) await init();

async function init() {
  Deno.env.set("FASTRO_ENV", "development");
  start();
  const watcher = Deno.watchFs(Deno.cwd());
  for await (const event of watcher) {
    if (event.kind === "access") {
      serve(port, args);
    }
  }
}

export function start() {
  if (cmd === "serve") serve(port, args);
}
