// deno-lint-ignore-file
import { createElement, renderToReadableStream } from "./deps.ts";
import {
  BUILD_ID,
  checkReferer,
  Component,
  Fastro,
  FunctionComponent,
  isPageComponent,
  PageComponent,
  RenderOptions,
} from "./server.ts";
import {
  clean,
  extractOriginalString,
  importCryptoKey,
  keyType,
  keyUsages,
  reverseString,
} from "../crypto/key.ts";
import { encryptData } from "../crypto/encrypt.ts";

function isJSX(res: JSX.Element) {
  return res && res.props != undefined && res.type != undefined;
}

export async function createInitScript(server: Fastro, props?: any) {
  let exportedKeyString = server.record["exportedKeyString"] as string;
  exportedKeyString = clean(exportedKeyString);
  exportedKeyString = reverseString(exportedKeyString);
  exportedKeyString = extractOriginalString(
    exportedKeyString,
    server.record["salt"],
  ) as string;
  exportedKeyString = atob(exportedKeyString);
  const importedKey = await importCryptoKey(
    exportedKeyString,
    keyType,
    keyUsages,
  );

  const env = Deno.env.get("ENV") === undefined
    ? ""
    : `window.__ENV__ = "DEVELOPMENT";`;

  const plaintext = JSON.stringify(props);
  const encryptedData = await encryptData(importedKey, plaintext);
  return `${env}window.__INITIAL_DATA__ = "${encryptedData}";`;
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
    opt.cache = opt.props.cache;
    opt.development = opt.development ?? true;

    const options = { ...opt };
    return this.#options = options;
  };

  #refreshJs = (refreshUrl: string, buildId: string) => {
    return `const es = new EventSource('${refreshUrl}');
window.addEventListener("beforeunload", (event) => {
  es.close();
});
es.onmessage = function(e) {
  if (e.data !== "${buildId}") {
    location.reload();
  };
};`;
  };

  #handleComponentLayout = async (c: FunctionComponent) => {
    const init = await createInitScript(this.#server, this.#options.props);
    const refreshPath = `${this.#staticPath}/refresh.js`;
    return (
      <>
        {this.#development ? <script src={refreshPath} /> : ""}
        <script
          dangerouslySetInnerHTML={{
            __html: init,
          }}
        />
        <script src={`${this.#staticPath}/${c.name.toLocaleLowerCase()}.js`} />
      </>
    );
  };

  async #handleLayout(element: Component) {
    const jsx = isJSX(element as JSX.Element);
    const el = jsx ? element as JSX.Element : createElement(
      element as FunctionComponent,
      this.#options.props,
    );
    const hydrateScript = jsx ? "" : await this.#handleComponentLayout(
      element as FunctionComponent,
    );

    const defaultRoot = (
      <div id="root">
        {el}
      </div>
    );

    const defaultContainer = (
      <>
        {defaultRoot}
        {hydrateScript}
      </>
    );

    if (!this.#options.layout) {
      const defaultLayout = ({ children }: { children: React.ReactNode }) => {
        return (
          <html>
            <body>{children}</body>
          </html>
        );
      };
      return defaultLayout({ children: defaultContainer });
    }

    const root = this.#options.customRoot
      ? this.#options.customRoot(el)
      : defaultRoot;

    const rootContainer = (
      <>
        {root}
        {hydrateScript}
      </>
    );

    const props = { children: rootContainer, data: this.#options.props };
    return this.#options.layout(props);
  }

  #createHTML = async (component: Component, cached?: boolean) => {
    let compID = "";
    this.#handleDevelopment();
    if (isJSX(component as JSX.Element)) {
      return this.#handleJSXElement(compID, component, cached);
    }

    // handle a modular page
    const is = isPageComponent(component as PageComponent);
    const pc = component as PageComponent;
    const c = is ? pc.component : component as FunctionComponent;
    const e = is ? pc.component : this.#element;

    if (isJSX(c as JSX.Element)) {
      return this.#handleJSXElement(compID, c, cached);
    }
    const fc = c as FunctionComponent;
    compID = `${fc.name}${this.#reqUrl}`;
    if (cached && this.#nest[compID]) return this.#nest[compID];
    const htmlLayout = this.#handleLayout(e);
    return this.#nest[compID] = htmlLayout;
  };

  #handleJSXElement = async (
    compID: string,
    component: Component,
    cached?: boolean,
  ) => {
    compID = `default${this.#reqUrl}`;
    if (cached && this.#nest[compID]) return this.#nest[compID];
    let html = await this.#handleLayout(component);
    return this.#nest[compID] = html;
  };

  #handleDevelopment = () => {
    if (!this.#development) return;
    const refreshPath = `${this.#staticPath}/refresh.js`;
    this.#server.push(
      "GET",
      refreshPath,
      () =>
        new Response(this.#refreshJs(`/___refresh___`, BUILD_ID), {
          headers: {
            "Content-Type": "application/javascript",
          },
        }),
    );
  };

  render = async () => {
    console.log("this.#options.cache", this.#options.cache);
    const html = await this.#createHTML(
      this.#element,
      this.#options.cache,
    );

    const defaultOnError = (error: unknown) => {
      console.error(error);
    };

    const onError = this.#options.onError ?? defaultOnError;
    const signal = this.#options.abortController?.signal;
    const stream: ReadableStream = await renderToReadableStream(html, {
      signal,
      onError,
    });

    return new Response(
      stream,
      {
        status: this.#options.status,
        headers: {
          "content-type": "text/html",
        },
      },
    );
  };
}
