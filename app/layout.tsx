// deno-lint-ignore-file no-explicit-any
import { RenderOptions } from "../http/server.ts";

const createHTML = (
  props: unknown,
): RenderOptions => {
  return {
    props,
    customRoot: (el: React.ReactNode) => {
      return (
        <div
          id="root"
          className="d-flex w-100 pt-3 ps-3 pe-3 mx-auto flex-column"
          style={{ maxWidth: "42em" }}
          data-color-mode="auto"
          data-light-theme="light"
          data-dark-theme="dark"
        >
          {el}
        </div>
      );
    },
    layout: (
      { children, data }: { children: React.ReactNode; data: any },
    ) => {
      return (
        <html className="h-100" lang="EN">
          <head>
            <title>{data.title}</title>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta
              name="description"
              content={data.description}
            />
            <link
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
              rel="stylesheet"
              integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
              crossOrigin="anonymous"
            />

            <link
              href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css"
              rel="stylesheet"
            />
            <link
              href="/static/post.css"
              rel="stylesheet"
            />
            <link
              href="/static/cover.css"
              rel="stylesheet"
            />
          </head>
          <body className="d-flex h-100 text-bg-dark">
            {children}
            <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js" />
            <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js" />
          </body>
        </html>
      );
    },
  };
};

export { createHTML };
