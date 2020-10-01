import type { Request } from "../../mod.ts";

export const handler = (request: Request) => {
  request.setCookie({
    name: "greeting",
    value: "Hi",
  });
  request.send("cookie");
};
