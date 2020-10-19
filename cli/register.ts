import { Args } from "../core/types.ts";
import { createError } from "../core/utils.ts";

const message = `
USAGE:
  fastro register --email your@mail.com`;

export function handleRegister(email: string, args: Args) {
  if (args.help) return console.log(message);
  if (!email) {
    throw createError(
      "HANDLE_REGISTER_ERROR",
      new Error("email required" + message),
    );
  }
  console.log("register", email);
}
