import { Fastro } from "@app/mod.ts";
import tocLayout from "@app/modules/toc/toc.layout.tsx";
import tocApp from "@app/modules/toc/toc.page.tsx";
import { getSession } from "@app/utils/session.ts";
import posts from "@app/modules/docs/docs.json" with { type: "json" };

export default function (s: Fastro) {
    s.page("/docs", {
        component: tocApp,
        layout: tocLayout,
        folder: "modules/toc",
        handler: async (req, ctx) => {
            const ses = await getSession(req, ctx);
            return ctx.render({
                isLogin: ses?.isLogin,
                avatar_url: ses?.avatar_url,
                html_url: ses?.html_url,
                title: "Docs",
                description: "Docs",
                destination: "/docs",
                posts,
            });
        },
    });

    return s;
}
