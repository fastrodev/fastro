import { CSS, render } from "https://deno.land/x/gfm@0.3.0/mod.ts";
import { extract } from "https://deno.land/std@0.208.0/front_matter/any.ts";
import remarkToc from "https://esm.sh/v135/remark-toc@8.0.1";
import { remark } from "https://esm.sh/v135/remark@14.0.3";
import {
  Context,
  FunctionComponent,
  HttpRequest,
} from "../../src/server/types.ts";
import { renderToString } from "preact-render-to-string";

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

async function readMarkdownFile(folder: string, file: string) {
  try {
    const path = folder + "/" + file + ".md";
    const md = await Deno.readTextFile(path);
    return md;
  } catch {
    return null;
  }
}

// deno-lint-ignore no-explicit-any
const record: Record<string, any> = {};
async function getMarkdownBody(
  req: Request,
  layout: FunctionComponent,
  folder: string,
  file: string,
  prefix: string,
) {
  const id = folder + file;
  if (record[id]) {
    return record[id];
  }

  const filePath = prefix ? file.replace(`/${prefix}/`, "") : file;
  const pathname = prefix ? `/${prefix}/${filePath}` : `/${file}`;

  const pattern = new URLPattern({ pathname });
  const passed = pattern.test(req.url);
  if (!passed) return record[id] = null;

  const md = await readMarkdownFile(folder, filePath);
  if (!md) return record[id] = null;

  const m = extract(md);
  const f = await remark()
    .use(remarkToc)
    .processSync(m.body);

  const markdown = render(String(f));
  const html = layout({
    CSS,
    markdown: stringToJSXElement(markdown),
    attrs: m.attrs,
  });

  return record[id] = "<!DOCTYPE html>" + renderToString(html);
}

const defaultLayout = (props: {
  CSS: string;
  markdown: string;
  attrs: Record<string, unknown>;
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
