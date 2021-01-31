import type { Request } from "../mod.ts";
export default (request: Request) => {
  request.proxy(
    "https://raw.githubusercontent.com/fastrodev/fastro/master/readme.md",
  );
};
