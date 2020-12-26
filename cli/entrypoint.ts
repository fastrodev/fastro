// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import { ServerOptions } from "../core/types.ts";
import { Fastro } from "../mod.ts";

const message = `USAGE:
  fastro serve [OPTIONS]

OPTIONS:
  --production        Disable file watching
  --port [PORT]       Set port of webapp
                      Example: 
                        \`fastro serve --port 8080\`
`;

function serveHelp() {
  return console.log(message);
}

let server: Fastro | undefined;

// deno-lint-ignore no-explicit-any
export function serve(port?: number, args?: any) {
  if (args.help) return serveHelp();
  if (Deno.env.get("DENO_ENV") !== "development") {
    Deno.env.set("DENO_ENV", "production");
  }
  try {
    console.log(`DENO_ENV=${Deno.env.get("DENO_ENV")}`);
    if (server) server.close();
    server = new Fastro({ port });
  } catch (error) {
    console.error(error);
  }
}
