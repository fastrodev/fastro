import { CSS, render } from "https://deno.land/x/gfm@0.3.0/mod.ts";
import { extract } from "https://deno.land/std@0.208.0/front_matter/any.ts";
import remarkToc from "https://esm.sh/remark-toc@8.0.1";
import { remark } from "https://esm.sh/remark@14.0.3";
import {
  Context,
  FunctionComponent,
  HttpRequest,
} from "../../src/server/types.ts";
import { renderToString } from "preact-render-to-string";

/**
 *
import DOMPurify from "npm:isomorphic-dompurify";
function escapeHTML(htmlString: string) {
  const sanitizedHTML = DOMPurify.sanitize(htmlString);

  return sanitizedHTML.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(
    />/g,
    "&gt;",
  ).replace(/"/g, "&quot;");
}
*/

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

export default function (layout: FunctionComponent, folder = "post") {
  return async function middleware(_req: HttpRequest, ctx: Context) {
    const body = await getMarkdownBody(layout, folder, ctx.url.pathname);
    if (!body) return ctx.next();
    return new Response(body, {
      headers: { "content-type": "text/html" },
    });
  };
}
