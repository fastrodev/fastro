import { Request } from "../../mod.ts";
export default function (request: Request) {
  request.setCookie({
    name: "greeting",
    value: "Hi",
  });
  request.send("cookie");
}
