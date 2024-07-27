import { Context, HttpRequest } from "@app/mod.ts";

export default function adminHandler(_req: HttpRequest, ctx: Context) {
    return ctx.render({ title: "hello" });
}
