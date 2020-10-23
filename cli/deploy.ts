import { Args } from "../core/types.ts";

function deployHelp() {
  console.log("deploy help");
}

export function handleDeploy(args: Args) {
  if (args.help) return deployHelp();
  console.log("deploy", args);
}
