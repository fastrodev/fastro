// deno-lint-ignore-file no-explicit-any
import { CSS, extract, remark, render } from "./deps.ts";
import { renderToString } from "../../core/server/deps.ts";
import { Context, HttpRequest } from "../../mod.ts";
import type { ComponentChildren, JSX } from "preact";
import { default as remarkToc } from "npm:remark-toc@8.0.1";

import "npm:prismjs@^1.30.0/components/prism-css.min.js";
import "npm:prismjs@^1.30.0/components/prism-jsx.min.js";
import "npm:prismjs@^1.30.0/components/prism-typescript.min.js";
import "npm:prismjs@^1.30.0/components/prism-tsx.min.js";
import "npm:prismjs@^1.30.0/components/prism-bash.min.js";
import "npm:prismjs@^1.30.0/components/prism-powershell.min.js";
import "npm:prismjs@^1.30.0/components/prism-json.min.js";
import "npm:prismjs@^1.30.0/components/prism-diff.min.js";
import "npm:prismjs@^1.30.0/components/prism-go.min.js";

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
  folder: string,
  file: string,
  prefix: string,
) {
  async function g(): Promise<(any)[] | null> {
    const id = folder + file;
    if (record[id]) {
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

    let tocData: any = null;

    // Custom plugin to extract TOC
    function extractToc() {
      return (tree: any) => {
        const indicesToRemove: number[] = [];

        // Look for the TOC heading first, then find the list after it
        for (let i = 0; i < tree.children.length; i++) {
          const node = tree.children[i];

          // Check if this is a TOC heading
          if (node.type === "heading") {
            const headingText = node.children?.map((child: any) =>
              child.value || child.children?.map((c: any) =>
                c.value
              ).join("") || ""
            ).join("").toLowerCase();

            if (
              headingText.includes("contents") ||
              headingText.includes("table of contents")
            ) {
              indicesToRemove.push(i); // Remove the heading

              // Look for the next list node and remove it too
              for (let j = i + 1; j < tree.children.length; j++) {
                if (tree.children[j].type === "list") {
                  tocData = tree.children[j];
                  indicesToRemove.push(j); // Remove the list
                  break;
                }
              }
              break;
            }
          }
        }

        // Remove nodes in reverse order to maintain indices
        for (let i = indicesToRemove.length - 1; i >= 0; i--) {
          tree.children.splice(indicesToRemove[i], 1);
        }

        // Fallback: find any list with links (but don't remove if no heading found)
        if (!tocData) {
          const findTocList = (node: any): any => {
            if (node.type === "list") {
              const hasLinks = node.children?.some((item: any) =>
                item.children?.some((child: any) => child.type === "link")
              );
              if (hasLinks) {
                return node;
              }
            }

            if (node.children) {
              for (const child of node.children) {
                const result = findTocList(child);
                if (result) return result;
              }
            }
            return null;
          };

          tocData = findTocList(tree);
        }
      };
    }

    const f = await remark()
      .use(remarkToc, {
        heading: "contents|table[ -]of[ -]contents?",
        maxDepth: 6,
        tight: true,
      })
      .use(extractToc)
      .process(m.body);

    const rendered = render(String(f));

    return record[id] = [rendered, m.attrs, tocData];
  }

  const resp = await g();
  if (!resp) return null;
  const [r, attrs, toc] = resp;
  const markdown = stringToJSXElement(r);
  return [markdown, attrs, toc];
}

export const defaultLayout = (props: {
  CSS: string;
  attrs: Record<string, unknown>;
  children: ComponentChildren;
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
          href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.min.css"
          rel="stylesheet"
        />
      </head>
      <body id="root">
        {props.children}
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-core.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js" />
      </body>
    </html>
  );
};

const defaultMarkdownWrapper = (
  children: ComponentChildren,
  _attrs: Record<string, unknown>,
  toc?: JSX.Element | null,
) => (
  <main
    data-color-mode="auto"
    data-light-theme="light"
    data-dark-theme="dark"
    class="markdown-body"
  >
    {toc && <nav class="table-of-contents">{toc}</nav>}
    {children}
  </main>
);

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
      req,
      folder,
      ctx.url.pathname,
      prefix,
    );
    if (!body) return ctx.next();
    const [markdown, attrs, toc] = body;

    const tocJSX = tocToJSX(toc);
    const html = layout({
      CSS,
      attrs,
      children: markdownWrapper(markdown, attrs, tocJSX),
      data: { toc: tocJSX },
    });

    return new Response("<!DOCTYPE html>" + renderToString(html), {
      headers: { "content-type": "text/html" },
    });
  };
}

function tocToJSX(tocNode: any): JSX.Element | null {
  if (!tocNode) return null;

  const renderListItem = (item: any): JSX.Element => {
    const content: JSX.Element[] = [];

    if (item.children) {
      for (const child of item.children) {
        if (child.type === "paragraph") {
          // Handle paragraph content (usually contains links)
          const paragraphContent = child.children?.map(
            (node: any, index: number) => {
              if (node.type === "link") {
                return (
                  <a
                    key={index}
                    href={node.url}
                    title={node.title || undefined}
                  >
                    {node.children?.map((linkChild: any) => linkChild.value)
                      .join("")}
                  </a>
                );
              } else if (node.type === "text") {
                return node.value;
              }
              return null;
            },
          );
          content.push(<span key="paragraph">{paragraphContent}</span>);
        } else if (child.type === "list") {
          // Handle nested lists
          content.push(renderList(child));
        }
      }
    }

    return <li>{content}</li>;
  };

  const renderList = (listNode: any): JSX.Element => {
    const listItems = listNode.children?.map((item: any, index: number) => (
      <div key={index}>{renderListItem(item)}</div>
    ));

    return listNode.ordered ? <ol>{listItems}</ol> : <ul>{listItems}</ul>;
  };

  return (
    <nav className="table-of-contents">
      {renderList(tocNode)}
    </nav>
  );
}
