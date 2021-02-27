import { Request } from "../mod.ts";
export default function (request: Request) {
  request.proxy(
    "https://raw.githubusercontent.com/fastrodev/fastro/master/readme.md",
  );
}
