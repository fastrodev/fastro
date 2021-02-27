import { Request } from "../../mod.ts";
export default function (request: Request) {
  const cookie = request.getCookie("greeting");
  if (cookie) request.send(cookie);
}
