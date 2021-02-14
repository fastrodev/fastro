import type { Request } from "../../../mod.ts";
export const options = {
  prefix: "api",
};
export default (request: Request) => {
  request.send("prefix");
};
