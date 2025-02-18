import { LayoutProps } from "@app/core/server/types.ts";

export default function layout(
  { data, children }: LayoutProps<
    { title: string; description: string; image: string }
  >,
) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <title>
          {data.title} | Fastro Solutions
        </title>
        <meta property="og:site_name" content="Fastro" />
        <meta name="description" content={data.description} />
        <meta property="og:image" content={data.image} />
        <link href="/styles.css" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body id="root">
        {children}
      </body>
    </html>
  );
}
