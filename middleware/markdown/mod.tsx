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
    const md = await Deno.readTextFile(folder + "/" + file + ".md");
    return md;
  } catch (error) {
    return null;
  }
}

const record: Record<string, string> = {};
async function getMarkdownBody(
  layout: FunctionComponent,
  folder: string,
  file: string,
) {
  const id = folder + file;
  if (record[id]) {
    return record[id];
  }

  const md = await readMarkdownFile(folder, file);
  if (!md) return null;

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

export default function (layout = defaultLayout, folder = "post") {
  return async function middleware(_req: HttpRequest, ctx: Context) {
    const body = await getMarkdownBody(layout, folder, ctx.url.pathname);
    if (!body) return ctx.next();
    return new Response(body, {
      headers: { "content-type": "text/html" },
    });
  };
}
