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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {`Fastro - Full Stack Web Framework for Deno, TypeScript, Preact JS, and Tailwind CSS`}
        </title>
        <meta property="og:site_name" content="Fastro" />
        <meta name="description" content={data.description} />
        <meta property="og:image" content={data.image} />
        <link href="/styles.css" rel="stylesheet" />
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
