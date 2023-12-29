import { PageProps } from "../src/server/types.ts";

export function layout(
  { data, children }: PageProps<string>,
) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {data}
        </title>
      </head>
      <body id="root">
        {children}
      </body>
    </html>
  );
}
