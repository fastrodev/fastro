import { Args } from "../core/types.ts";
import { createError } from "../core/utils.ts";
import { config } from "../template/config.ts";

const message = `
USAGE:
  fastro register --email your@mail.com`;

export async function handleRegister(email: string, args: Args) {
  if (args.help) return console.log(message);
  if (!email) {
    throw createError(
      "HANDLE_REGISTER_ERROR",
      new Error("email required" + message),
    );
  }

  const encoder = new TextEncoder();
  const configFile = encoder.encode(config(email));
  await Deno.writeFile("config.yml", configFile);
}
