import type { Callback, Request } from "../mod.ts";
export const methods = ["GET", "POST"];
export const handler = (request: Request, next: Callback) => {
  if (request.url === "/middleware") request.hello = "middleware";
  next();
};
