import type { Request } from "../../../mod.ts";
export const params = true;
export const methods = ["GET"];
export const handler = (request: Request) => {
  const params = request.getParams();
  request.send(params);
};
