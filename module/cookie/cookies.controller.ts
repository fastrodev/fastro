import type { Request } from "../../mod.ts";
export default (request: Request) => {
  request.send(request.getCookies());
};
