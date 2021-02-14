import type { Request } from "../../mod.ts";
export default (request: Request) => {
  request.clearCookie("greeting");
  request.send("greeting cookie cleared");
};
