// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import { FASTRO_VERSION } from "../core/types.ts";
import { watch } from "./watch.ts";
import {
  create,
  getArguments,
  handleDeploy,
  handleHelp,
  handleRegister,
  init,
  serve,
} from "./handler.ts";

const args = getArguments(Deno.args);
const { command: [cmd], port, production, email, version } = args;

if (!production && cmd === "serve" && !args.help) await watch();

export function start() {
  try {
    if (cmd === "init") return init(args);
    if (cmd === "create") return create(args);
    if (cmd === "serve") return serve(port, args);
    if (cmd === "deploy") return handleDeploy(args);
    if (cmd === "register") return handleRegister(email, args);
    if (version) return console.info(`fastro ${FASTRO_VERSION}`);
    handleHelp();
  } catch (error) {
    console.error(`${error.name}:`, error.message);
  }
}
