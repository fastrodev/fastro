import type { Request } from "../../mod.ts";
export default (request: Request) => {
  request.setCookie({
    name: "greeting",
    value: "Hi",
  });
  request.send("cookie");
};
