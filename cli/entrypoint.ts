// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import { Fastro } from "../mod.ts";

let server: Fastro | undefined;

// deno-lint-ignore no-explicit-any
export async function serve(port?: number, args?: any) {
  if (Deno.env.get("DENO_ENV") !== "development") {
    Deno.env.set("DENO_ENV", "production");
  }
  try {
    console.log(`DENO_ENV=${Deno.env.get("DENO_ENV")}`);
    if (server) server.close();
    server = new Fastro();
    server.listen({ port });
  } catch (error) {
    console.error(error);
  }
}
