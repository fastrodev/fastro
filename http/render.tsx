// deno-lint-ignore-file
import rehypeParse from "https://esm.sh/rehype-parse@8.0.4";
import rehypeSlug from "https://esm.sh/rehype-slug@5.1.0";
import rehypeStringify from "https://esm.sh/rehype-stringify@9.0.3";
import { unified } from "https://esm.sh/unified@10.1.2";
import { Esbuild } from "../build/esbuild.ts";
import { React, ReactDOMServer } from "./deps.ts";
import {
  BUILD_ID,
  Component,
  Fastro,
  FunctionComponent,
  RenderOptions,
} from "./server.ts";

function isJSX(res: JSX.Element) {
  return res && res.props != undefined && res.type != undefined;
}

export class Render {
  #options: RenderOptions;
  #element: Component;
  #nest: Record<string, any>;
  #development: boolean;
  #server: Fastro;
  #staticPath: string;
  #reqUrl?: string;

  constructor(
    element: Component,
    options: RenderOptions,
    nest: Record<string, any>,
    server: Fastro,
    request?: Request,
  ) {
    this.#options = this.#initOptions(options);
    this.#element = element;
    this.#nest = nest;
    this.#development = server.getDevelopmentStatus();
    this.#server = server;
    this.#staticPath = `${this.#server.getStaticPath()}/js`;
    this.#reqUrl = request?.url;
  }

  #initOptions = (opt: RenderOptions) => {
    opt.status = opt.status ?? 200;
    opt.pageFolder = opt.pageFolder ?? "pages";
    opt.cache = opt.cache ?? true;
    opt.development = opt.development ?? true;
    opt.html = opt.html ?? {};
    opt.html.head = opt.html.head ?? {
      meta: [],
      script: [],
      link: [],
    };

    const meta = [{ charset: "utf-8" }, {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    }];
    if (opt.html.head.descriptions) {
      meta.push({
        name: "description",
        content: opt.html.head.descriptions,
      });
    }
    opt.html.head.meta = opt.html.head.meta ?? meta;
    opt.html.head.script = opt.html.head.script ?? [];

    opt.html.body = opt.html.body ?? {
      script: [],
      root: {},
    };

    const options = { ...opt };
    return this.#options = options;
  };

  #initHtml = (element: Component, props?: any) => {
    let el:
      | React.DetailedReactHTMLElement<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >
      | JSX.Element;

    if (isJSX(element as JSX.Element)) {
      el = element as JSX.Element;
    } else {
      el = React.createElement(
        element as FunctionComponent,
        this.#options.props,
      );
    }

    return (
      <html
        lang={this.#options.html?.lang}
        className={this.#options.html?.class}
      >
        <head>
          <title>{this.#options.html?.head?.title}</title>
          {this.#options.html?.head?.meta
            ? this.#options.html?.head?.meta.map((m) => (
              <meta
                property={m.property}
                name={m.name}
                content={m.content}
                itemProp={m.itemprop}
                charSet={m.charset}
              />
            ))
            : ""}
          {this.#options.html?.head?.link
            ? this.#options.html?.head?.link.map((l) => (
              <link
                href={l.href}
                integrity={l.integrity}
                rel={l.rel}
                media={l.media}
                crossOrigin={l.crossorigin}
              >
              </link>
            ))
            : ""}
          {this.#options.html?.head?.script
            ? this.#options.html?.head?.script.map((s) => (
              <script
                src={s.src}
                type={s.type}
                crossOrigin={s.crossorigin}
                nonce={s.nonce}
                integrity={s.integrity}
              />
            ))
            : ""}
        </head>
        <body
          className={this.#options.html?.body?.class}
          style={this.#options.html?.body?.style}
        >
          <div
            id="root"
            className={this.#options.html?.body?.root.class}
            style={this.#options.html?.body?.root.style}
          >
            {el}
          </div>
          <script type="env"></script>
          {props ? <script></script> : ""}
          {this.#options.html?.body?.script
            ? this.#options.html?.body?.script.map((s) => (
              <script
                src={s.src}
                type={s.type}
                crossOrigin={s.crossorigin}
                nonce={s.nonce}
              />
            ))
            : ""}
        </body>
      </html>
    );
  };

  #refreshJs = (refreshUrl: string, buildId: string) => {
    return `const es = new EventSource('${refreshUrl}');
es.onmessage = function(e) {
  if (e.data !== "${buildId}") {
    location.reload();
  };
};`;
  };

  #createBundle = async (elementName: string) => {
    try {
      if (this.#nest[this.#getRenderId(elementName)]) return;
      const es = new Esbuild(elementName);
      const bundle = await es.build();
      const componentPath = `/static/js/${elementName.toLocaleLowerCase()}.js`;
      for (const file of bundle.outputFiles) {
        const str = new TextDecoder().decode(file.contents);
        this.#server.push("GET", componentPath, () =>
          new Response(str, {
            headers: {
              "Content-Type": "application/javascript",
            },
          }));
      }
      this.#nest[this.#getRenderId(elementName)] = true;
    } catch {
      return;
    }
  };

  #getRenderId = (el: string) => {
    return `render${el}`;
  };

  #processHtml = async (html: string) => {
    const processor = unified()
      .use(rehypeParse)
      .use(rehypeSlug)
      .use(rehypeStringify);

    let outputHTML = await processor.process(html);
    return outputHTML;
  };

  #renderToString = async (component: Component, cached?: boolean) => {
    let compID = "";
    this.#handleDevelopment();
    if (isJSX(component as JSX.Element)) {
      compID = `default${this.#reqUrl}`;
      if (cached && this.#nest[compID]) return this.#nest[compID];
      const html = ReactDOMServer.renderToString(this.#initHtml(component));
      const h = await this.#processHtml(html);
      return this.#nest[compID] = `<!DOCTYPE html>${h}`;
    }

    const c = component as FunctionComponent;
    compID = `${c.name}${this.#reqUrl}`;
    if (cached && this.#nest[compID]) return this.#nest[compID];

    await this.#handleComponent(c);
    const layout = this.#initHtml(this.#element, this.#options.props);
    let html = ReactDOMServer.renderToString(layout);
    return this.#nest[compID] = `<!DOCTYPE html>${this.#setInitialProps(html)}`;
  };

  #handleComponent = async (c: FunctionComponent) => {
    await this.#createBundle(c.name);
    if (!this.#options.html?.body) return;
    this.#options.html?.body.script?.push({
      src: `${this.#staticPath}/${c.name.toLocaleLowerCase()}.js`,
    });
  };

  #setInitialProps = (layout: string) => {
    // inject props
    let l = layout.replace(
      `<script></script>`,
      `<script>window.__INITIAL_DATA__ = ${
        JSON.stringify(this.#options.props)
      }</script>`,
    );

    // inject env
    const env = Deno.run === undefined
      ? ""
      : `<script>window.__ENV__ = "DEVELOPMENT"</script>`;
    l = l.replace(`<script type="env"></script>`, env);

    return l;
  };

  #handleDevelopment = () => {
    if (!this.#development) return;
    const refreshPath = `${this.#staticPath}/refresh.js`;
    this.#server.push(
      "GET",
      refreshPath,
      () =>
        new Response(this.#refreshJs("/refresh", BUILD_ID), {
          headers: {
            "Content-Type": "application/javascript",
          },
        }),
    );

    if (this.#options.html?.head?.script) {
      this.#options.html?.head.script?.push({
        src: refreshPath,
      });
    }
  };

  render = async () => {
    const html = await this.#renderToString(
      this.#element,
      this.#options.cache,
    );
    return new Response(html, {
      status: this.#options.status,
      headers: {
        "content-type": "text/html",
      },
    });
  };
}
