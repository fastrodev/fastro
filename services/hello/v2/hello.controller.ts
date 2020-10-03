import type { Request } from "../../../mod.ts";
export const methods = ["GET", "POST", "PUT", "DELETE"];
export const handler = (request: Request) => {
  request.send("hello v2");
};
