import { InlineNav } from "../../components/inline-nav.tsx";

export default function (
  props: {
    CSS: string;
    markdown: string;
    attrs: Record<string, unknown>;
  },
) {
  const title = props.attrs.title as string;
  const description = props.attrs.description as string;
  const image = props.attrs.image as string;

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta property="og:image" content={image} />
        <title>{`${title} | Fastro`}</title>
        <link
          href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css"
          rel="stylesheet"
        />
        <style>
          {props.CSS}
        </style>
        <link href="/styles.css" rel="stylesheet" />
        <link href="/markdown.css" rel="stylesheet" />
      </head>
      <body class="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">
        <main class={"container max-w-4xl px-6 py-10 mx-auto"}>
          <div>
            <InlineNav title="Fastro" />
            <h1 class="mb-3">{title}</h1>
          </div>
          <hr class="h-px mb-4 bg-gray-200 border-0 dark:bg-gray-800" />
          <div
            data-color-mode="auto"
            data-light-theme="light"
            data-dark-theme="dark"
            class="markdown-body"
          >
            {props.markdown}
          </div>
        </main>
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js" />
      </body>
    </html>
  );
}
