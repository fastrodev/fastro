import { getSessionId } from "@app/modules/auth/mod.tsx";
import { Context, HttpRequest } from "@app/mod.ts";
// import { kv } from "@app/utils/db.ts";

export async function getSession(req: HttpRequest, ctx: Context) {
    const sessionId = await getSessionId(req);
    if (!sessionId) return undefined;
    const r = await ctx.server.stores.get("core")?.get(sessionId);
    if (!r) return;
    const avatar_url = r.avatar_url;
    const html_url = r.html_url;
    const isLogin = true;
    const username = r.login;
    return { isLogin, avatar_url, html_url, username };
}
