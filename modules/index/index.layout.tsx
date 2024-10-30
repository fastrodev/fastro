import { LayoutProps } from "../../core/server/types.ts";

export default function index(
  { data, children }: LayoutProps<
    { title: string; description: string; image: string }
  >,
) {
  return (
    <html lang={`en`}>
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
          {data.title} | Fastro
        </title>
        <meta property="og:site_name" content="Fastro" />
        <meta name="description" content={data.description} />
        <meta property="og:image" content={data.image} />
        <link href="/styles.css" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body
        id="root"
        class={`h-screen bg-gray-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
