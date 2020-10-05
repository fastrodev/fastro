import type { Request } from "../../../mod.ts";
export const prefix = "api";
export const handler = (request: Request) => {
  request.send("prefix");
};
