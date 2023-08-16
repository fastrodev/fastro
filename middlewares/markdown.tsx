import { CSS, render } from "https://deno.land/x/gfm@0.2.5/mod.ts";
import { h } from "https://esm.sh/preact@10.16.0";

import "https://esm.sh/prismjs@1.29.0/components/prism-jsx?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-typescript?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-tsx?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-bash?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-powershell?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-json?no-check&pin=v57";
import "https://esm.sh/prismjs@1.29.0/components/prism-diff?no-check&pin=v57";

import { getPublishDate } from "../app/function.ts";
import DefaultFooter from "../components/footer.tsx";
import DefaultHeader from "../components/header.tsx";
import { Render } from "../http/render.tsx";
import {
  Context,
  FunctionComponent,
  HttpRequest,
  Next,
  RenderOptions,
} from "../http/server.ts";

import { extract, remark, remarkToc } from "./deps.ts";

type Meta = {
  title?: string;
  author?: string;
  date?: string;
  description?: string;
  image?: string;
  prev?: string;
  next?: string;
};

type Post = {
  meta?: Meta;
  content: preact.JSX.Element;
};

export default class Instance {
  #header: FunctionComponent;
  #footer: FunctionComponent;
  #options: RenderOptions | undefined;
  #folder: string | undefined;
  #prefix: string | undefined;

  constructor(
    options?: {
      header?: FunctionComponent;
      footer?: FunctionComponent;
      folder?: string;
      prefix?: string;
      options?: RenderOptions;
    },
  ) {
    const opts = options ?? {};
    this.#header = opts?.header ?? DefaultHeader;
    this.#footer = opts?.footer ?? DefaultFooter;
    this.#folder = opts?.folder ?? "posts";
    this.#prefix = opts?.prefix ?? "";
    this.#options = opts?.options;
  }

  #getDefaultOptions = (md: Post) => {
    return {
      cache: true,
      html: {
        lang: "en",
        head: {
          title: `${md.meta?.title} | Fastro Framework`,
          descriptions: md.meta?.description,
          meta: [
            { charset: "utf-8" },
            {
              name: "viewport",
              content: "width=device-width, initial-scale=1.0",
            },
            {
              name: "description",
              content: md.meta?.description,
            },
            {
              name: "author",
              content: "Fastro Software",
            },
            {
              name: "publish_date",
              property: "og:publish_date",
              content: getPublishDate(),
            },
            {
              property: "og:image",
              content: md.meta?.image,
            },
            {
              name: "twitter:image:src",
              content: md.meta?.image,
            },
            {
              name: "twitter:description",
              content: md.meta?.description,
            },
            {
              name: "og-description",
              content: md.meta?.description,
            },
            {
              property: "og:title",
              content: md.meta?.title,
            },
          ],
          link: [
            {
              href:
                "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
              rel: "stylesheet",
              integrity:
                "sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD",
              crossorigin: "anonymous",
            },
            {
              href:
                "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css",
              rel: "stylesheet",
            },
            {
              href: "/static/post.css",
              rel: "stylesheet",
            },
            {
              href: "/static/cover.css",
              rel: "stylesheet",
            },
          ],
          headStyle: CSS + "#root {background-color:red}",
        },
        body: {
          script: [
            {
              src:
                "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js",
            },
            {
              src:
                "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js",
            },
          ],
          class: "d-flex h-100 text-bg-dark",
          root: {
            class:
              "cover-container d-flex w-100 h-100 p-3 mx-auto flex-column markdown-body",
          },
        },
      },
    } as RenderOptions;
  };

  middleware = async (req: HttpRequest, ctx: Context, _next: Next) => {
    const md = await new Markdown(
      ctx.server.getNest(),
      req,
      this.#header,
      this.#footer,
      this.#folder,
    ).getPost(this.#prefix) as Post;

    if (md) {
      const opt = this.#options ?? this.#getDefaultOptions(md);
      const r = new Render(
        md.content,
        opt,
        ctx.server.getNest(),
        ctx.server,
        req,
      );
      return r.render();
    }
  };
}

class Markdown {
  #post: Record<string, Post>;
  // deno-lint-ignore no-explicit-any
  #nest: Record<string, any>;
  #path: string;
  #header: FunctionComponent;
  #footer: FunctionComponent;
  #folder: string | undefined;

  constructor(
    // deno-lint-ignore no-explicit-any
    nest: Record<string, any>,
    req: Request,
    header: FunctionComponent,
    footer: FunctionComponent,
    folder?: string,
  ) {
    this.#post = {};
    this.#nest = nest;
    this.#path = req.url;
    this.#header = header;
    this.#footer = footer;
    this.#folder = folder ?? "posts";
  }

  #readFile = async (path: string, prefix?: string) => {
    const rootPathname = prefix ? `/${prefix}/*` : `/*`;
    const nestID = `markdown${rootPathname}${path}`;
    if (this.#nest[nestID]) return this.#nest[nestID];

    const pattern = new URLPattern({ pathname: rootPathname });
    const match = pattern.exec(path);
    if (!match) return this.#nest[nestID] = null;

    const filePath = match?.pathname.groups["0"];

    try {
      const md = `./${this.#folder}/${filePath}.md`;
      const txt = await Deno.readTextFile(md);
      const m = extract(txt);

      const file = await remark()
        .use(remarkToc)
        .processSync(m.body);

      const markdownHtml = this.#markdownToHtml(String(file));

      const git = await this.#getVersion();
      // const path = prefix ? prefix : filePath
      const p = prefix ? prefix : filePath;
      const content = this.#contentContainer(
        markdownHtml,
        m.attrs,
        git["name"],
        p,
      );
      return this.#post[path] = {
        meta: m.attrs,
        content,
      };
    } catch {
      return this.#nest[nestID] = null;
    }
  };

  #getVersion = async () => {
    try {
      const data = await fetch(
        "https://api.github.com/repos/fastrodev/fastro/releases/latest",
      );
      const git = JSON.parse(await data.text());
      return git;
    } catch (error) {
      // deno-lint-ignore no-explicit-any
      const git: any = {};
      git["name"] = "local";
      return git;
    }
  };

  #contentContainer = (
    // deno-lint-ignore no-explicit-any
    child: any,
    meta: Meta,
    props: string,
    path?: string,
  ) => {
    const Header = this.#header;
    const Footer = this.#footer;
    console.log("path", path);

    return (
      <div className="d-flex flex-column h-100">
        <Header path={path} />
        <main className="markdown flex-grow-1" style={{ marginBottom: 20 }}>
          <div className="text-start">
            <h1 className="display-5 fw-bold">{meta.title}</h1>
            <p className="text-white-50 h5">{meta.description}</p>
          </div>
          <hr />
          {child}
        </main>
        <Footer version={props} />
      </div>
    );
  };

  #markdownToHtml(content: string) {
    const jsxElement = h("div", {
      dangerouslySetInnerHTML: {
        // TODO Sanitize
        __html: render(content, {
          allowIframes: true,
          allowMath: true,
        }),
      },
    });
    return jsxElement;
  }

  getPost = async (prefix?: string) => {
    const nestID = `markdown${this.#path}`;
    if (this.#nest[nestID]) return this.#nest[nestID];
    const res = await this.#readFile(this.#path, prefix);
    return this.#nest[nestID] = res;
  };
}
