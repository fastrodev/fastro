import type { Request } from "../../mod.ts";

export const handler = async (request: Request) => {
  const cookie = request.getCookie("greeting");
  if (cookie) request.send(cookie);
};
