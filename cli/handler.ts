// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import { parse } from "../deps.ts";

export function getArguments(cmdArgs: string[]) {
  const args = parse(cmdArgs);
  return {
    command: args._,
    port: args.port,
    production: args.production,
  };
}

export { serve } from "./entrypoint.ts";
export { init } from "./init.ts";
