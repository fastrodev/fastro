import { CSS } from "./deps.ts";
import { renderToString } from "../../core/server/deps.ts";
import { Context, HttpRequest } from "../../mod.ts";
// import { tocToJSX } from "./toc.tsx";
import { getMarkdownBody } from "./markdown-utils.tsx";
import { defaultMarkdownWrapper } from "./default-wrapper.tsx";
import { defaultLayout } from "./default-layout.tsx";

import "npm:prismjs@^1.30.0/components/prism-css.min.js";
import "npm:prismjs@^1.30.0/components/prism-jsx.min.js";
import "npm:prismjs@^1.30.0/components/prism-typescript.min.js";
import "npm:prismjs@^1.30.0/components/prism-tsx.min.js";
import "npm:prismjs@^1.30.0/components/prism-bash.min.js";
import "npm:prismjs@^1.30.0/components/prism-powershell.min.js";
import "npm:prismjs@^1.30.0/components/prism-json.min.js";
import "npm:prismjs@^1.30.0/components/prism-diff.min.js";
import "npm:prismjs@^1.30.0/components/prism-go.min.js";

/**
 * @param layout default : defaultLayout
 * @param folder default : "post"
 * @param prefix default : "blog"
 * @param markdownWrapper default wrapper component for markdown content
 * @returns
 */
export default function (
  layout = defaultLayout,
  folder = "post",
  prefix = "blog",
  markdownWrapper = defaultMarkdownWrapper,
) {
  return async function middleware(req: HttpRequest, ctx: Context) {
    const body = await getMarkdownBody(
      folder,
      ctx.url.pathname,
      prefix,
      req,
    );
    if (!body) return ctx.next();
    const [markdown, attrs, toc] = body;

    // const tocJSX = tocToJSX(toc);
    const html = layout({
      CSS,
      attrs,
      children: markdownWrapper(markdown, attrs, toc),
    });

    return new Response("<!DOCTYPE html>" + renderToString(html), {
      headers: { "content-type": "text/html" },
    });
  };
}
