import { Context, HttpRequest } from "@app/mod.ts";

export default async function github(_req: HttpRequest, ctx: Context) {
    if (
        ctx.url.pathname.endsWith(".ts") ||
        ctx.url.pathname.endsWith(".tsx")
    ) {
        const version = ctx.url.pathname.startsWith("/v")
            ? ""
            : ctx.url.pathname.startsWith("/canary")
            ? "/canary"
            : "/main";

        const path =
            `https://raw.githubusercontent.com/fastrodev/fastro${version}${ctx.url.pathname}`;
        const res = await fetch(path);
        const content = await res.text();
        return new Response(content);
    }
    return ctx.next();
}
