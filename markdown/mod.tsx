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

  #readFile = async (path: string) => {
    const pathname = `/*`;
    const nestID = pathname + path;
    if (this.#nest[nestID]) return this.#nest[nestID];

    const pattern = new URLPattern({ pathname });
    const match = pattern.exec(path);
    if (!match) return this.#nest[nestID] = null;

    const file = match?.pathname.groups["0"];

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
        <header className="mb-auto text-center">
          <h3 className="float-md-start mb-0">Fastro</h3>
          <nav className="nav nav-masthead justify-content-center float-md-end">
            <a
              className="nav-link fw-bold py-1 px-0"
              aria-current="page"
              href="/"
            >
              Home
            </a>
            <a className="nav-link fw-bold py-1 px-0" href="/benchmarks">
              Benchmarks
            </a>
            <a
              className="nav-link fw-bold py-1 px-0"
              href="https://github.com/fastrodev/fastro/tree/main/examples"
            >
              Examples
            </a>
            <a
              className="nav-link fw-bold py-1 px-0"
              href="https://deno.land/x/fastro/mod.ts"
            >
              Docs
            </a>
            <a
              className="nav-link py-1 px-0"
              href="https://github.com/fastrodev/fastro"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-github text-white"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </nav>
        </header>
        <main>
          <hr />
          <div className="text-center">
            <h1>{meta.title}</h1>
            <h5 className="text-white-50">{meta.description}</h5>
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
        </main>
        <footer className="text-center text-white-50">
          <hr className="mt-5"></hr>
          <p>
            Made with{" "}
            <a
              href="https://deno.land/x/fastro"
              className="text-decoration-none text-white "
            >
              Fastro {props}
            </a>
          </p>
        </footer>
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
    if (this.#nest[this.#path]) return this.#nest[this.#path];
    const res = await this.#readFile(this.#path);
    return this.#nest[this.#path] = res;
  };
}
