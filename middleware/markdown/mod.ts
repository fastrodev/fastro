import { Context, HttpRequest } from "../../src/server/types.ts";

export default function () {
  function markdown(_req: HttpRequest, ctx: Context) {
    return ctx.next();
  }

  return markdown;
}
