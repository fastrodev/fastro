import type { Request } from "../../../mod.ts";

export const methods = ["GET"];

export const handler = (request: Request) => {
  request.send("hello v1");
};
