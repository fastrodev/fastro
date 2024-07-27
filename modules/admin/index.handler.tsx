import { Context, HttpRequest } from "@app/mod.ts";

export function indexHandler(_req: HttpRequest, ctx: Context) {
    return ctx.render({ title: "hello" });
}
