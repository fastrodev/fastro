import { InlineNav } from "$fastro/components/inline-nav.tsx";
import { Footer } from "$fastro/components/footer.tsx";
import { LayoutProps } from "$fastro/http/server/types.ts";

export default function ({ children, data }: LayoutProps<
    { title: string; description: string; image: string; destination: string }
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
            <body class="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">
                <main class={"container grow max-w-4xl px-6 py-6 mx-auto"}>
                    <div class={`flex flex-col gap-y-3 mb-3`}>
                        <div>
                            <InlineNav
                                title="Fastro"
                                description={data.title}
                                destination={data.destination}
                            />
                        </div>
                        <h1 class="text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white">
                            {data.description}
                        </h1>
                    </div>

                    {children}
                </main>
                <Footer />
                <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js" />
                <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js" />
            </body>
        </html>
    );
}
