// deno-lint-ignore-file
import {
  base64Encode,
  denoPlugins,
  esbuild,
  React,
  ReactDOMServer,
} from "./deps.ts";
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
  #internalRoute: string;

  constructor(
    element: Component,
    options: RenderOptions,
    nest: Record<string, any>,
    server: Fastro,
  ) {
    this.#options = this.#initOptions(options);
    this.#element = element;
    this.#nest = nest;
    this.#development = server.getDevelopmentStatus();
    this.#server = server;
    this.#internalRoute = `/___${BUILD_ID}`;
  }

  #initOptions = (opt: RenderOptions) => {
    opt.status = opt.status ?? 200;
    opt.pageFolder = opt.pageFolder ?? "pages";
    opt.cache = opt.cache ?? true;
    opt.development = opt.development ?? true;
    opt.html.body = opt.html.body ?? {
      script: [],
    };
    opt.html.head = opt.html.head ?? {
      meta: [],
      script: [],
      link: [],
    };

    const options = { ...opt };
    return this.#options = options;
  };

  #initHtml = (element: Component) => {
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
        lang={this.#options.html.lang}
        className={this.#options.html.class}
      >
        <head>
          <title>{this.#options.html?.head?.title}</title>
          {!this.#options.html?.head?.meta
            ? ""
            : this.#options.html?.head?.meta.map((m) => (
              <meta
                property={m.property}
                name={m.name}
                content={m.content}
                itemProp={m.itemprop}
                charSet={m.charset}
              />
            ))}
          {!this.#options.html?.head?.link
            ? ""
            : this.#options.html?.head?.link.map((l) => (
              <link
                href={l.href}
                integrity={l.integrity}
                rel={l.rel}
                media={l.media}
                crossOrigin={l.crossorigin}
              >
              </link>
            ))}
          {!this.#options.html?.head?.script
            ? ""
            : this.#options.html?.head?.script.map((s) => (
              <script
                src={s.src}
                type={s.type}
                crossOrigin={s.crossorigin}
                nonce={s.nonce}
                integrity={s.integrity}
              />
            ))}
        </head>
        <body className={this.#options.html?.body?.class}>
          <div id="root" className={this.#options.html.body?.rootClass}>
            {el}
          </div>
          {!this.#options.html?.body?.script
            ? ""
            : this.#options.html?.body?.script.map((s) => (
              <script
                src={s.src}
                type={s.type}
                crossOrigin={s.crossorigin}
                nonce={s.nonce}
              />
            ))}
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

  #initPropsJs = () => {
    return `window.__INITIAL_DATA__ = "${
      base64Encode(JSON.stringify(this.#options.props))
    }"`;
  };

  #createHydrate(component: string, props?: any) {
    const properties = props
      ? `const props = JSON.parse(new TextDecoder("utf-8").decode(decode(window.__INITIAL_DATA__))) || {}; 
    hydrateRoot(document.getElementById("root") as HTMLElement, <${component} {...props} />);`
      : `hydrateRoot(document.getElementById("root") as HTMLElement, <${component}/>);`;

    return `// deno-lint-ignore-file
    // DO NOT EDIT. This file is generated automatically. 
    // Required for the development and deployment process.
    declare global { interface Window { __INITIAL_DATA__: any; } } 
    import { decode } from "https://deno.land/std@0.192.0/encoding/base64.ts"; 
    import { hydrateRoot } from "https://esm.sh/react-dom@18.2.0/client"; 
    import React from "https://esm.sh/react@18.2.0"; 
    import ${component} from "../pages/${component}.tsx";
    ${properties}
    `;
  }

  #createBundle = async (elementName: string) => {
    const cwd = Deno.cwd();
    const hydrateTarget =
      `${cwd}/hydrate/${elementName.toLowerCase()}.hydrate.tsx`;
    const componentPath =
      `${this.#internalRoute}/${elementName.toLowerCase()}.js`;

    const esbuildWasmURL =
      new URL("./esbuild_v0.17.19.wasm", import.meta.url).href;

    console.log(esbuildWasmURL);
    console.log("Deno.run", Deno.run);

    // await esbuild.initialize({
    //   wasmURL: esbuildWasmURL,
    //   worker: false,
    // });

    const absWorkingDir = Deno.cwd();
    const esbuildRes = await esbuild.build({
      plugins: [...denoPlugins()],
      entryPoints: [hydrateTarget],
      platform: "browser",
      target: ["chrome99", "firefox99", "safari15"],
      format: "esm",
      absWorkingDir,
      outdir: ".",
      bundle: true,
      treeShaking: true,
      write: false,
    });
    esbuild.stop();

    if (esbuildRes.errors.length > 0) {
      throw esbuildRes.errors;
    }

    for (const file of esbuildRes.outputFiles) {
      const str = new TextDecoder().decode(file.contents);
      this.#server.push("GET", componentPath, () =>
        new Response(str, {
          headers: {
            "Content-Type": "application/javascript",
          },
        }));
    }

    this.#nest[this.#getRenderId(elementName)] = true;
  };

  #getRenderId = (el: string) => {
    if (!this.#readHydrateFile(el)) {
      this.#createHydrateFile(el);
    }
    return `render${el}`;
  };

  #createHydrateFile(elementName: string) {
    try {
      const target = `./hydrate/${elementName.toLowerCase()}.hydrate.tsx`;
      Deno.writeTextFileSync(
        target,
        this.#createHydrate(elementName, this.#options.props),
      );
    } catch (error) {
      throw error;
    }
  }

  #readHydrateFile(elementName: string) {
    const target = `./hydrate/${elementName.toLowerCase()}.hydrate.tsx`;
    if (this.#nest[target]) return this.#nest[target];
    try {
      Deno.readTextFileSync(target);
      return this.#nest[target] = true;
    } catch {
      return this.#nest[target] = false;
    }
  }

  #renderToString = async (component: Component, cached?: boolean) => {
    this.#setDefaultLayout();
    this.#handleDevelopment();
    if (isJSX(component as JSX.Element)) {
      const html = ReactDOMServer.renderToString(this.#initHtml(component));
      return this.#nest["default"] = `<!DOCTYPE html>${html}`;
    }

    const c = component as FunctionComponent;
    if (cached && this.#nest[c.name]) return this.#nest[c.name];
    if (this.#options.build && !this.#nest[this.#getRenderId(c.name)]) {
      await this.#createBundle(c.name);
    }

    this.#setInitialProps();
    this.#handleComponent(c);
    const layout = this.#initHtml(this.#element);
    const html = ReactDOMServer.renderToString(layout);
    return this.#nest[c.name] = `<!DOCTYPE html>${html}`;
  };

  #handleComponent = (c: FunctionComponent) => {
    if (this.#options.html?.body) {
      this.#options.html?.body.script?.push({
        src: `${this.#internalRoute}/${c.name.toLocaleLowerCase()}.js`,
      });
    }
  };

  #setInitialProps = () => {
    if (this.#options.props && this.#options.html?.body) {
      const propsPath = `${this.#internalRoute}/props.js`;
      this.#options.html?.body.script?.push({
        src: propsPath,
      });
      this.#server.push(
        "GET",
        propsPath,
        () =>
          new Response(this.#initPropsJs(), {
            headers: {
              "Content-Type": "application/javascript",
            },
          }),
      );
    }
  };

  #setDefaultLayout = () => {
    if (!this.#options.html.lang) {
      this.#options.html.lang = "en";
    }

    if (!this.#options.html.head?.meta) {
      const meta = {
        title: this.#options.html.head?.title,
        descriptions: this.#options.html.head?.descriptions,
        meta: [
          { charset: "utf-8" },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
          {
            name: "description",
            content: this.#options.html.head?.descriptions,
          },
        ],
      };
      this.#options.html.head = { ...meta };
    }

    if (!this.#options.html.head?.script) {
      const head = this.#options.html.head;
      head.script = [];
      this.#options.html.head = { ...head };
    }
  };

  #handleDevelopment = () => {
    if (!this.#development) return;
    const refreshPath = `${this.#internalRoute}/refresh.js`;
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

    if (this.#options.html?.head) {
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
