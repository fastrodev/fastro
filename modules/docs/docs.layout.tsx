// deno-lint-ignore-file no-explicit-any
import type { ComponentChildren } from "preact";

export default function (
  props: {
    CSS: string;
    markdown: string;
    attrs: Record<string, unknown>;
    children: ComponentChildren;
    data?: any;
  },
) {
  const title = props.attrs.title as string;
  const description = props.attrs.description as string;
  const image = props.attrs.image as string;
  // const data = props.data;

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta property="og:image" content={image} />
        <title>{`${title} | Fastro`}</title>
        <link
          href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.min.css"
          rel="stylesheet"
        />
        <style>
          {props.CSS}
        </style>
        <link href="/styles.css" rel="stylesheet" />
        <link href="/markdown.css" rel="stylesheet" />
      </head>
      <body
        id="root"
        class="bg-white dark:bg-gray-950 text-slate-900 dark:text-white"
      >
        {props.children}
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-core.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js" />
      </body>
    </html>
  );
}
