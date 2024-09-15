import { Fastro } from "@app/mod.ts";
import tocLayout from "@app/modules/toc/toc.layout.tsx";
import tocApp from "@app/modules/toc/toc.page.tsx";
import { getSession } from "@app/utils/session.ts";

export default function (s: Fastro) {
    s.page("/blog", {
        component: tocApp,
        layout: tocLayout,
        folder: "modules/toc",
        handler: async (req, ctx) => {
            const ses = await getSession(req, ctx);
            return ctx.render({
                isLogin: ses?.isLogin,
                avatar_url: ses?.avatar_url,
                html_url: ses?.html_url,
                title: "Blog",
                description: "Blog",
                destination: "/blog",
                posts: [
                    {
                        title: "Collaboration and Profit Sharing",
                        url: "/blog/collaboration",
                        date: "06/18/2024",
                    },
                    {
                        title: "Set up Tailwind on Deno",
                        url: "/blog/tailwind",
                        date: "01/26/2024",
                    },
                    {
                        title: "Deno KV OAuth Implementation",
                        url: "/blog/oauth",
                        date: "11/15/2023",
                    },
                    {
                        title: "renderToReadableStream",
                        url: "/blog/render_to_readable_stream",
                        date: "10/26/2023",
                    },
                    {
                        title: "React",
                        url: "/blog/react",
                        date: "10/22/2023",
                    },
                    {
                        title: "Preact",
                        url: "/blog/preact_and_encrypted_props",
                        date: "08/16/2023",
                    },
                    {
                        title: "Hello",
                        url: "/blog/hello",
                        date: "11/15/2023",
                    },
                ],
            });
        },
    });

    return s;
}
