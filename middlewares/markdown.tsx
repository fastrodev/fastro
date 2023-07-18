// deno-lint-ignore-file no-explicit-any
import { extract } from "https://deno.land/std@0.194.0/front_matter/any.ts";
import ReactMarkdown from "https://esm.sh/react-markdown@8.0.7";
import { Prism as SyntaxHighlighter } from "https://esm.sh/react-syntax-highlighter@15.5.0";
import * as prism from "https://esm.sh/react-syntax-highlighter@15.5.0/dist/esm/styles/prism";
import remarkGfm from "https://esm.sh/remark-gfm@3.0.1";
import DefaultFooter from "../components/footer.tsx";
import DefaultHeader from "../components/header.tsx";
import { Render } from "../http/render.tsx";
import { Context, HttpRequest, Next, RenderOptions } from "../http/server.ts";
import { FunctionComponent } from "../mod.ts";

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

  constructor(
    header?: FunctionComponent,
    footer?: FunctionComponent,
    options?: RenderOptions,
  ) {
    this.#header = header ?? DefaultHeader;
    this.#footer = footer ?? DefaultFooter;
    this.#options = options;
  }

  #getDefaultOptions = (md: Post) => {
    return {
      cache: true,
      html: {
        lang: "en",
        head: {
          title: `${md.meta?.title} | Fastro`,
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
          link: [{
            href:
              "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
            rel: "stylesheet",
            integrity:
              "sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD",
            crossorigin: "anonymous",
          }, {
            href: "/static/post.css",
            rel: "stylesheet",
          }, {
            href: "/static/cover.css",
            rel: "stylesheet",
          }],
          script: [{
            src:
              "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js",
            integrity:
              "sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN",
            crossorigin: "anonymous",
          }],
        },
        body: {
          class: "d-flex h-100 text-bg-dark",
          rootClass: "cover-container d-flex w-100 p-3 mx-auto flex-column",
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
    ).getPost() as Post;

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

  constructor(
    nest: Record<string, any>,
    req: Request,
    header: FunctionComponent,
    footer: FunctionComponent,
  ) {
    this.#post = {};
    this.#nest = nest;
    this.#path = req.url;
    this.#header = header;
    this.#footer = footer;
  }

  #readFile = async (path: string) => {
    const pathname = `/*`;
    const nestID = `markdown${pathname}${path}`;
    if (this.#nest[nestID]) return this.#nest[nestID];

    const pattern = new URLPattern({ pathname });
    const match = pattern.exec(path);
    if (!match) return this.#nest[nestID] = null;

    const file = match?.pathname.groups["0"];

    try {
      const txt = await Deno.readTextFile(`./posts/${file}.md`);
      const m = extract(txt);
      const markdown = this.#markdownToHtml(m.body);
      const git = await this.#getVersion();
      const content = this.#contentContainer(markdown, m.attrs, git["name"]);
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
      const git: any = {};
      git["name"] = "local";
      return git;
    }
  };

  #contentContainer = (
    child: JSX.Element,
    meta: Meta,
    props: string,
  ) => {
    const date = new Date(meta.date as string);
    const formattedDate = date.toLocaleString("en-US", {
      dateStyle: "medium",
    });

    const Header = this.#header;
    const Footer = this.#footer;

    return (
      <>
        <Header path="" />
        <hr />
        <main className="markdown" style={{ marginBottom: 50 }}>
          <div className="text-center">
            <h1 className="display-5 fw-bold">{meta.title}</h1>
            <p className="text-white-50 h5">{meta.description}</p>
            <hr />
            <p className="text-white-50 fw-light">
              {meta.author} · {formattedDate}
            </p>
            <hr />
          </div>
          {child}
          {meta.next || meta.prev
            ? (
              <div style={{ marginTop: 30 }}>
                <hr />
                <div className="row">
                  <div className="col-sm text-start">
                    {meta.prev
                      ? (
                        <a href={meta.prev}>
                          Previous
                        </a>
                      )
                      : ""}
                  </div>
                  <div className="col-sm text-end">
                    {meta.next
                      ? (
                        <a href={meta.next}>
                          Next
                        </a>
                      )
                      : ""}
                  </div>
                </div>
                <hr />
              </div>
            )
            : ""}
        </main>
        <hr />
        <Footer version={props} />
      </>
    );
  };

  #markdownToHtml(content: string) {
    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match
              ? (
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, "")}
                  style={prism.dark}
                  language={match[1]}
                  PreTag="div"
                />
              )
              : <code {...props} className={className}>{children}</code>;
          },
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    );
  }

  getPost = async () => {
    const nestID = `markdown${this.#path}`;
    if (this.#nest[nestID]) return this.#nest[nestID];
    const res = await this.#readFile(this.#path);
    return this.#nest[nestID] = res;
  };
}
