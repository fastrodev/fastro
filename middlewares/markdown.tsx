// deno-lint-ignore-file no-explicit-any
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
import {
  extract,
  prism,
  ReactMarkdown,
  remark,
  remarkGfm,
  remarkToc,
  SyntaxHighlighter,
} from "./deps.ts";

function getYearMonthDay(dateStr?: string) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

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

  constructor(
    options?: {
      header?: FunctionComponent;
      footer?: FunctionComponent;
      folder?: string;
      options?: RenderOptions;
    },
  ) {
    const opts = options ?? {};
    this.#header = opts?.header ?? DefaultHeader;
    this.#footer = opts?.footer ?? DefaultFooter;
    this.#folder = opts?.folder ?? "posts";
    this.#options = opts?.options;
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
              name: "author",
              content: "Fastro Software",
            },
            {
              property: "article:published_time",
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
        },
        body: {
          class: "d-flex h-100 text-bg-dark",
          root: {
            class: "cover-container d-flex w-100 p-3 mx-auto flex-column",
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

  #readFile = async (path: string) => {
    const pathname = `/*`;
    const nestID = `markdown${pathname}${path}`;
    if (this.#nest[nestID]) return this.#nest[nestID];

    const pattern = new URLPattern({ pathname });
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
      const content = this.#contentContainer(
        markdownHtml,
        m.attrs,
        git["name"],
        filePath,
      );
      return this.#post[path] = {
        meta: m.attrs,
        content,
      };
    } catch (err) {
      // console.log(err);
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
    path?: string,
  ) => {
    const date = meta.date ? new Date(meta.date as string) : undefined;
    const formattedDate = date
      ? date.toLocaleString("en-US", {
        dateStyle: "medium",
      })
      : undefined;

    const Header = this.#header;
    const Footer = this.#footer;

    return (
      <>
        <Header path={path} />
        <hr />
        <main className="markdown" style={{ marginBottom: 20 }}>
          <div className="text-center">
            <h1 className="display-5 fw-bold">{meta.title}</h1>
            <p className="text-white-50 h5">{meta.description}</p>
          </div>
          <hr />
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
                  style={prism["dracula"]}
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
