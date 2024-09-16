import { LayoutProps } from "@app/core/server/types.ts";

export default function layout(
  { data, children }: LayoutProps<
    { title: string; data: string; user?: string }
  >,
) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {data.title}
        </title>
        <link href="/styles.css" rel="stylesheet" />
      </head>
      <body id="root">
        {children}
      </body>
    </html>
  );
}
