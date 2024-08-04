import { CSS, extract, remark, render } from "./deps.ts";
import { renderToString } from "../../http/server/deps.ts";
import { Context, FunctionComponent, HttpRequest } from "../../mod.ts";

import "https://esm.sh/v135/prismjs@1.29.0/components/prism-css";
import "https://esm.sh/v135/prismjs@1.29.0/components/prism-jsx";
import "https://esm.sh/v135/prismjs@1.29.0/components/prism-typescript";
import "https://esm.sh/v135/prismjs@1.29.0/components/prism-tsx";
import "https://esm.sh/v135/prismjs@1.29.0/components/prism-bash";
import "https://esm.sh/v135/prismjs@1.29.0/components/prism-powershell";
import "https://esm.sh/v135/prismjs@1.29.0/components/prism-json";
import "https://esm.sh/v135/prismjs@1.29.0/components/prism-diff";

function stringToJSXElement(content: string) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

function readMarkdownFile(folder: string, file: string) {
  try {
    const path = folder + "/" + file + ".md";
    const md = Deno.readTextFileSync(path);
    return md;
  } catch {
    return null;
  }
}

const record: Record<string, unknown> = {};
export async function getMarkdownBody(
  req: Request,
  layout: FunctionComponent,
  folder: string,
  file: string,
  prefix: string,
  data?: unknown,
) {
  // deno-lint-ignore no-explicit-any
  async function g(): Promise<(any)[] | null> {
    const id = folder + file;
    if (record[id]) {
      // deno-lint-ignore no-explicit-any
      return record[id] as any[];
    }
    const filePath = prefix ? file.replace(`/${prefix}/`, "") : file;
    const pathname = prefix ? `/${prefix}/${filePath}` : file;

    const pattern = new URLPattern({ pathname });
    const passed = pattern.test(req.url);
    if (!passed) return null;

    const md = readMarkdownFile(folder, filePath);
    if (!md) return null;

    const m = extract(md);
    const f = await remark().process(m.body);
    const rendered = render(String(f));
    return record[id] = [rendered, m.attrs];
  }

  const resp = await g();
  if (!resp) return null;
  const [r, attrs] = resp;
  const markdown = stringToJSXElement(r);

  const html = layout({
    CSS,
    markdown,
    attrs,
    data,
  });

  return "<!DOCTYPE html>" + renderToString(html);
}

export const defaultLayout = (props: {
  CSS: string;
  markdown: string;
  attrs: Record<string, unknown>;
  data?: unknown;
}) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          {props.CSS}
        </style>
        <link
          href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <main
          data-color-mode="light"
          data-light-theme="light"
          data-dark-theme="dark"
          class="markdown-body"
        >
          {props.markdown}
        </main>
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js" />
      </body>
    </html>
  );
};

/**
 * @param layout
 * @param folder default : "post"
 * @param prefix default : "blog"
 * @returns
 */
export default function (
  layout = defaultLayout,
  folder = "post",
  prefix = "blog",
) {
  return async function middleware(req: HttpRequest, ctx: Context) {
    const body = await getMarkdownBody(
      req,
      layout,
      folder,
      ctx.url.pathname,
      prefix,
    );
    if (!body) return ctx.next();
    return new Response(body, {
      headers: { "content-type": "text/html" },
    });
  };
}
