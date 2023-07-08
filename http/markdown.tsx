// deno-lint-ignore-file no-explicit-any
import matter from "https://esm.sh/gray-matter@4.0.3";
import ReactMarkdown from "https://esm.sh/react-markdown@8.0.7";
import { Prism as SyntaxHighlighter } from "https://esm.sh/react-syntax-highlighter@15.5.0";
import * as prism from "https://esm.sh/react-syntax-highlighter@15.5.0/dist/esm/styles/prism";
import remarkGfm from "https://esm.sh/remark-gfm@3.0.1";

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

  #readFile = (path: string) => {
    const pathname = `/*`;
    const nestID = pathname + path;
    if (this.#nest[nestID]) return this.#nest[nestID];

    const pattern = new URLPattern({ pathname });
    const match = pattern.exec(path);
    if (!match) return this.#nest[nestID] = null;

    const file = match?.pathname.groups["0"];

    try {
      const txt = Deno.readTextFileSync(`./posts/${file}.md`);
      const m = matter(txt);
      const markdown = this.#markdownToHtml(m.content);
      const content = this.#contentContainer(markdown, m.data);
      return this.#post[path] = {
        meta: m.data,
        content,
      };
    } catch (error) {
      return this.#nest[nestID] = null;
    }
  };

  #contentContainer = (child: JSX.Element, meta: Meta) => {
    const date = new Date(meta.date as string);
    const formattedDate = date.toLocaleString("en-US", {
      dateStyle: "medium",
    });
    return (
      <div className="container container-sm">
        <div className="text-center">
          <h1>{meta.title}</h1>
          <h5 className="text-white-50">{meta.description}</h5>
          <hr />
          <p className="text-white-50">{meta.author} · {formattedDate}</p>
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
      </div>
    );
  };

  #markdownToHtml(content: string) {
    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
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
              : (
                <code {...props} className={className}>
                  {children}
                </code>
              );
          },
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    );
  }

  getPost = () => {
    if (this.#nest[this.#path]) return this.#nest[this.#path];
    return this.#nest[this.#path] = this.#readFile(this.#path);
  };
}
