// deno-lint-ignore-file no-explicit-any
import matter from "https://esm.sh/gray-matter@4.0.3";
import ReactMarkdown from "https://esm.sh/react-markdown@8.0.7";
import { Prism as SyntaxHighlighter } from "https://esm.sh/react-syntax-highlighter@15.5.0";
import * as prism from "https://esm.sh/react-syntax-highlighter@15.5.0/dist/esm/styles/prism";
import remarkGfm from "https://esm.sh/remark-gfm@3.0.1";
import Footer from "../components/footer.tsx";
import Header from "../components/header.tsx";

type Meta = {
  title?: string;
  author?: string;
  date?: string;
  description?: string;
  image?: string;
  prev?: string;
  next?: string;
};

export type Post = {
  meta?: Meta;
  content: JSX.Element;
};

export class Markdown {
  #post: Record<string, Post>;
  #nest: Record<string, any>;
  #path: string;

  constructor(nest: Record<string, any>, req: Request) {
    this.#post = {};
    this.#nest = nest;
    this.#path = req.url;
  }

  #readFile = async (path: string) => {
    const pathname = `/*`;
    // console.log("pathname", pathname);
    const nestID = `markdown${pathname}${path}`;
    if (this.#nest[nestID]) return this.#nest[nestID];

    const pattern = new URLPattern({ pathname });
    const match = pattern.exec(path);
    if (!match) return this.#nest[nestID] = null;

    const file = match?.pathname.groups["0"];
    // console.log('file?.endsWith(".css")', file?.endsWith(".css"));
    // if (!file?.endsWith(".css")) return this.#nest[nestID] = null;

    try {
      const txt = await Deno.readTextFile(`./posts/${file}.md`);
      const m = matter(txt);
      const markdown = this.#markdownToHtml(m.content);
      const git = await this.#getVersion();
      const content = this.#contentContainer(markdown, m.data, git["name"]);
      return this.#post[path] = {
        meta: m.data,
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
