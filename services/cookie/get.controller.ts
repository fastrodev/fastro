import type { Request } from "../../mod.ts";
export default (request: Request) => {
  const cookie = request.getCookie("greeting");
  if (cookie) request.send(cookie);
};
