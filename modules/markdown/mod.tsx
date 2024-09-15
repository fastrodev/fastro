import { Context, HttpRequest } from "@app/mod.ts";
import {
    defaultLayout,
    getMarkdownBody,
} from "@app/middleware/markdown/mod.tsx";
import { getSession } from "@app/utils/session.ts";

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
        const ses = await getSession(req, ctx);
        const body = await getMarkdownBody(
            req,
            layout,
            folder,
            ctx.url.pathname,
            prefix,
            {
                avatar_url: ses?.avatar_url,
                html_url: ses?.html_url,
                isLogin: ses?.isLogin,
            },
        );
        if (!body) return ctx.next();
        return new Response(body, {
            headers: { "content-type": "text/html" },
        });
    };
}
