// import { InlineNav } from "@app/components/inline-nav.tsx";
import { Footer } from "@app/components/footer.tsx";
import { LayoutProps } from "@app/http/server/types.ts";
import Header from "@app/components/header.tsx";

export default function ({ children, data }: LayoutProps<
    {
        title: string;
        description: string;
        image: string;
        destination: string;
        isLogin: boolean;
        avatar_url: string;
        html_url: string;
    }
>) {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="description" content={data.description} />
                <meta
                    property="og:image"
                    content={"https://fastro.deno.dev/fastro.png"}
                />
                <title>{`${data.title} | Fastro`}</title>
                <link href="/styles.css" rel="stylesheet" />
            </head>
            <body class="bg-white dark:bg-gray-950 text-slate-900 dark:text-white">
                <Header
                    isLogin={data.isLogin}
                    avatar_url={data.avatar_url}
                    html_url={data.html_url}
                />
                <main
                    class={"container grow max-w-4xl px-6 py-6 mx-auto bg-gray-200  dark:bg-gray-900 rounded-xl"}
                >
                    {children}
                </main>
                <Footer />
                <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js" />
                <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js" />
            </body>
        </html>
    );
}
