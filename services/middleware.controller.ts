import type { Request } from "../mod.ts";
export const handler = (request: Request) => {
  request.send(request.hello);
};
