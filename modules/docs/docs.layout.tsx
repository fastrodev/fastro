import { Footer } from "@app/components/footer.tsx";
import Header from "@app/components/header.tsx";
import posts from "@app/modules/docs/docs.json" with { type: "json" };

export default function (
  props: {
    CSS: string;
    markdown: string;
    attrs: Record<string, unknown>;
    // deno-lint-ignore no-explicit-any
    data?: any;
  },
) {
  const title = props.attrs.title as string;
  const description = props.attrs.description as string;
  const image = props.attrs.image as string;
  const previous = props.attrs.previous as string;
  const next = props.attrs.next as string;
  const data = props.data;

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
      <body class="bg-white dark:bg-gray-950 text-slate-900 dark:text-white">
        <Header
          isLogin={data.isLogin}
          avatar_url={data.avatar_url}
          html_url={data.html_url}
        />
        <main class="grow md:grid md:grid-cols-12 md:p-0 dark:bg-gray-900">
          {/* navigation */}
          <div
            class={`hidden dark:bg-gray-950 md:flex md:flex-col md:grow md:gap-y-3 md:col-span-2 md:items-end md:text-right md:pr-6 md:pt-6 md:pb-6`}
          >
            {posts.map((v) => {
              return (
                <a class={` text-gray-800 dark:text-white `} href={v.url}>
                  {v.title}
                </a>
              );
            })}
          </div>
          {/* content */}
          <div
            class={`md:col-span-8 md:pt-6 flex flex-col gap-y-3 md:gap-y-6 p-6`}
          >
            <div class={`flex flex-col gap-y-3`}>
              <h1 class="text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white">
                {title}
              </h1>
            </div>
            <hr class="h-px bg-gray-200 border-0 dark:bg-gray-800" />
            <div
              data-color-mode="auto"
              data-light-theme="light"
              data-dark-theme="dark"
              class={`markdown-body`}
            >
              {props.markdown}
            </div>

            <div class={`grow`}></div>

            <div
              class={`flex justify-between`}
            >
              {previous && (
                <a class={`dark:text-gray-100 text-gray-800`} href={previous}>
                  Previous
                </a>
              )}
              {next && (
                <a class={`dark:text-gray-100 text-gray-800`} href={next}>
                  Next
                </a>
              )}
            </div>
          </div>
          {/* TOC of doc */}
          <div class={`dark:bg-gray-950 col-span-2`}></div>
        </main>
        <Footer />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-core.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js" />
      </body>
    </html>
  );
}
