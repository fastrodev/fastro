// deno-lint-ignore-file no-explicit-any
import { CSS, render } from "https://deno.land/x/gfm@0.2.5/mod.ts";
import "https://esm.sh/v133/prismjs@1.29.0/components/prism-jsx";
import "https://esm.sh/v133/prismjs@1.29.0/components/prism-typescript";
import "https://esm.sh/v133/prismjs@1.29.0/components/prism-tsx";
import "https://esm.sh/v133/prismjs@1.29.0/components/prism-bash";
import "https://esm.sh/v133/prismjs@1.29.0/components/prism-powershell";
import "https://esm.sh/v133/prismjs@1.29.0/components/prism-json";
import "https://esm.sh/v133/prismjs@1.29.0/components/prism-diff";

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
import { version } from "../app/version.ts";
import React, { createElement } from "react";

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
  content: JSX.Element;
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
      theme: true,
      themeColor: "auto",
      props: {
        title: "Title",
      },
      customRoot: (el: React.ReactNode) => {
        return (
          <div
            id="root"
            className="d-flex w-100 h-100 pt-3 ps-3 pe-3 mx-auto flex-column markdown-body"
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
              <title>{md.meta?.title}</title>
              <meta charSet="utf-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <meta
                name="description"
                content={md.meta?.description}
              />
              <meta
                name="author"
                content={data.author}
              />
              <meta
                property="og:image"
                content={md.meta?.image}
              />
              <meta
                property="og:title"
                content={md.meta?.title}
              />
              <meta
                name="twitter:image:src"
                content={md.meta?.image}
              />
              <meta
                name="og-description"
                content={md.meta?.description}
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
              <style>
                {CSS + `#root {background-color:red}`}
              </style>
            </head>
            <body className="d-flex h-100 text-bg-dark">
              {children}
              <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js" />
              <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js" />
            </body>
          </html>
        );
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
  #nest: Record<string, any>;
  #path: string;
  #header: FunctionComponent;
  #footer: FunctionComponent;
  #folder: string | undefined;

  constructor(
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

      // const git = await this.#getVersion();
      const p = prefix ? prefix : filePath;
      const content = this.#contentContainer(
        markdownHtml,
        m.attrs,
        version,
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

  #contentContainer = (
    child: any,
    meta: Meta,
    props: string,
    path?: string,
  ) => {
    const Header = this.#header;
    const Footer = this.#footer;

    return (
      <div className="d-flex flex-column h-100">
        <Header path={path} />
        <main className="markdown flex-grow-1" style={{ marginBottom: 20 }}>
          <div className="text-center">
            <h1 className="display-5 fw-bold" style={{ marginBottom: 0 }}>
              {meta.title}
            </h1>
            <p className="text-white-50 h5 fw-light">{meta.description}</p>
          </div>
          <hr />
          {child}
        </main>
        <Footer version={props} />
      </div>
    );
  };

  #markdownToHtml(content: string) {
    const jsxElement = createElement("div", {
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
