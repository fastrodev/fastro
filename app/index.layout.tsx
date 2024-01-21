import { LayoutProps } from "../http/server/types.ts";

export function index(
  { data, children }: LayoutProps<
    { title: string; description: string; image: string }
  >,
) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`Fastro - ${data.title}`}</title>
        <meta name="description" content={data.description} />
        <meta property="og:image" content={data.image} />
        <link href="/styles.css" rel="stylesheet" />
      </head>
      <body id="root">
        {children}
      </body>
    </html>
  );
}
