// deno-lint-ignore-file no-explicit-any
import { getSessionId } from "@app/modules/auth/mod.tsx";
import { Context, HttpRequest } from "@app/mod.ts";

export async function getSession(req: HttpRequest, ctx: Context) {
    const sessionId = await getSessionId(req);
    if (!sessionId) return undefined;

    const r = ctx.server.store.get(sessionId) as any;
    const avatar_url = r ? r.avatar_url : null;
    const html_url = r ? r.html_url : null;
    const isLogin = r ? true : false;

    return { isLogin, avatar_url, html_url };
}
