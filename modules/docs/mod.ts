import { Fastro } from "@app/mod.ts";
import tocLayout from "@app/modules/toc/toc.layout.tsx";
import tocApp from "@app/modules/toc/toc.page.tsx";
import { docToc } from "@app/modules/docs/docs.layout.tsx";

export default function (s: Fastro) {
    s.page("/docs", {
        component: tocApp,
        layout: tocLayout,
        folder: "modules/toc",
        handler: (_req, ctx) => {
            return ctx.render({
                title: "Docs",
                description: "Docs",
                destination: "/docs",
                posts: docToc,
            });
        },
    });

    return s;
}
