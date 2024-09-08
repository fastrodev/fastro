import { Fastro } from "@app/mod.ts";
import tocLayout from "@app/modules/toc/toc.layout.tsx";
import tocApp from "@app/modules/toc/toc.page.tsx";
import { docToc } from "@app/modules/docs/docs.layout.tsx";
import { getSessionId } from "@app/modules/auth/mod.tsx";

export default function (s: Fastro) {
    s.page("/docs", {
        component: tocApp,
        layout: tocLayout,
        folder: "modules/toc",
        handler: async (req, ctx) => {
            const sessionId = await getSessionId(req);
            const hasSessionIdCookie = sessionId !== undefined;
            const isLogin = hasSessionIdCookie;
            let avatar_url = "";
            let html_url = "";
            if (sessionId) {
                const r = ctx.server.serverOptions[sessionId];
                if (r) {
                    avatar_url = r.avatar_url;
                    html_url = r.html_url;
                }
            }

            return ctx.render({
                isLogin,
                avatar_url,
                html_url,
                title: "Docs",
                description: "Docs",
                destination: "/docs",
                posts: docToc,
            });
        },
    });

    return s;
}
