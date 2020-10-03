import type { Request } from "../../mod.ts";
export const handler = (request: Request) => {
  request.clearCookie("greeting");
  request.send("greeting cookie cleared");
};
