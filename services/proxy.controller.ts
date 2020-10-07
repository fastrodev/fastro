import type { Request } from "../mod.ts";
export const handler = (request: Request) => {
  request.proxy(
    "https://raw.githubusercontent.com/fastrodev/fastro/master/readme.md",
  );
};
