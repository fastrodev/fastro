import { Context, HttpRequest } from "@app/mod.ts";
import {
    defaultLayout,
    getMarkdownBody,
} from "@app/middleware/markdown/mod.tsx";
import { getSessionId } from "@app/modules/auth/mod.tsx";
import { kv } from "@app/utils/db.ts";

/**
 * @param layout
 * @param folder
 * @param prefix
 * @returns
 */
export default function (
    layout = defaultLayout,
    folder: string,
    prefix: string,
) {
    return async function middleware(req: HttpRequest, ctx: Context) {
        const sessionId = await getSessionId(req);
        const hasSessionIdCookie = sessionId !== undefined;
        const isLogin = hasSessionIdCookie;
        let avatar_url = "";
        let html_url = "";
        if (sessionId) {
            // deno-lint-ignore no-explicit-any
            const r = await kv.get([sessionId]) as any;
            if (r && r.value) {
                avatar_url = r.value.avatar_url;
                html_url = r.value.html_url;
            }
        }
        const data = {
            avatar_url,
            html_url,
            isLogin,
        };
        const body = await getMarkdownBody(
            req,
            layout,
            folder,
            ctx.url.pathname,
            prefix,
            data,
        );
        if (!body) return ctx.next();
        return new Response(body, {
            headers: { "content-type": "text/html" },
        });
    };
}
