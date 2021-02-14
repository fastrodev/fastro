// Copyright 2020 - 2021 the Fastro author. All rights reserved. MIT license.

import { parse } from "../deps.ts";

export function getArguments(cmdArgs: string[]) {
  const args = parse(cmdArgs);
  return {
    command: args._,
    port: args.port,
    production: args.production,
    email: args.email,
    help: args.help,
    version: args.version,
    app: args.app,
    name: args.name,
  };
}

export { handleHelp } from "./help.ts";
export { serve } from "./entrypoint.ts";
export { init } from "./init.ts";
export { create } from "./create.ts";
export { handleDeploy } from "./deploy.ts";
export { handleRegister } from "./register.ts";
export { handleAddApp } from "./git.ts";
