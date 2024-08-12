import { LayoutProps } from "@app/mod.ts";

export default function adminLayout(
    { data, children }: LayoutProps<
        { title: string; description: string; image: string }
    >,
) {
    return (
        <html lang={`en`}>
            <head>
                <meta name="robots" content="noindex, nofollow" />
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>{data.title} | Fastro</title>
                <link href="/styles.css" rel="stylesheet" />
            </head>
            <body id="root" class="antialiased bg-gray-950">
                {children}
            </body>
        </html>
    );
}
