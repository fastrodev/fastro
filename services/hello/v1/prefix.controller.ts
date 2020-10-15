import type { Request } from "../../../mod.ts";
export const options = {
  prefix: "api",
};
export const handler = (request: Request) => {
  request.send("prefix");
};
