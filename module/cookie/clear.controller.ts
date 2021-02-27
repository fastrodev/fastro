import { Request } from "../../mod.ts";
export default function (request: Request) {
  request.clearCookie("greeting");
  request.send("greeting cookie cleared");
}
