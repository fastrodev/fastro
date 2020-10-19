import { Args } from "../core/types.ts";

export function handleDeploy(args: Args) {
  if (args.help) return console.log("deploy help");
  console.log("deploy", args);
}
