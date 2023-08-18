// deno-lint-ignore-file no-explicit-any
import { Esbuild } from "../build/esbuild.ts";
import {
  addSalt,
  exportCryptoKey,
  keyPromise,
  reverseString,
  SALT,
} from "../crypto/key.ts";

import {
  ConnInfo,
  contentType,
  extname,
  Handler,
  JSX,
  renderToString,
  Server,
  Status,
  STATUS_TEXT,
  toHashString,
} from "./deps.ts";

import { Render } from "./render.tsx";
import { version } from "./version.ts";

type ServerHandler = Deno.ServeHandler | Handler;

type HandlerArgument =
  | ServerHandler
  | RequestHandler
  | MiddlewareArgument;

export interface Next {
  (error?: Error, data?: unknown): unknown;
}

export type Hook = (
  server: Fastro,
  request: Request,
  info: Info,
) => Response | Promise<Response>;
export class HttpRequest extends Request {
  record!: Record<string, any>;
  match?: URLPatternResult | null;
  params?: Record<string, string | undefined>;
  query?: Record<string, string>;
  [key: string]: any;
}

export type Info = Deno.ServeHandlerInfo | ConnInfo;

type Meta = {
  name?: string;
  content?: string;
  charset?: string;
  property?: string;
  itemprop?: string;
};

type Script = {
  type?: string;
  src?: string;
  crossorigin?: "anonymous" | "use-credentials" | "" | undefined;
  nonce?: string;
  integrity?: string;
};

type Link = {
  href?: string;
  as?: string;
  onload?: any;
  rel?: string;
  integrity?: string;
  media?: string;
  crossorigin?: "anonymous" | "use-credentials" | "" | undefined;
};

type NoScriptLink = {
  rel?: string;
  href?: string;
};

type ModuleFunction = (f: Fastro) => Fastro;

export type RenderOptions = {
  build?: boolean;
  cache?: boolean;
  pageFolder?: string;
  status?: number;
  props?: any;
  development?: boolean;
  html?: {
    lang?: string;
    class?: string;
    style?: JSX.CSSProperties;
    head?: {
      title?: string;
      descriptions?: string;
      meta?: Meta[];
      script?: Script[];
      link?: Link[];
      headStyle?: string;
      headScript?: string;
      noScriptLink?: NoScriptLink;
    };
    body?: {
      class?: string;
      style?: JSX.CSSProperties;
      script?: Script[];
      root: {
        class?: string;
        style?: JSX.CSSProperties;
      };
    };
  };
};

export const hydrateFolder = ".hydrate";

export class Context {
  server!: Fastro;
  info!: Info;
  [key: string]: any;
  render!: (options?: RenderOptions) => Response | Promise<Response>;
  send!: (data: unknown, status?: number) => Response | Promise<Response>;
}

type RequestHandler = (
  request: HttpRequest,
  ctx: Context,
) =>
  | Response
  | Promise<Response>;

type MiddlewareArgument = (
  request: HttpRequest,
  ctx: Context,
  next: Next,
) =>
  | Promise<unknown>
  | unknown;

type RouteNest = {
  handler: HandlerArgument;
  method?: string;
  pathname?: string;
  params?: Record<string, string | undefined>;
  query?: Record<string, string>;
  match?: URLPatternResult;
  element?: Component;
  handlers?: Array<MiddlewareArgument>;
};

type Route = {
  method: string;
  path: string;
  handler: HandlerArgument;
};

type Middleware = {
  method?: string;
  path?: string;
  handler: MiddlewareArgument;
};

export type Component = FunctionComponent | JSX.Element;

export type FunctionComponent = (props?: any) => JSX.Element;
type Page = {
  path: string;
  element: Component;
  handlers: Array<MiddlewareArgument>;
};

export interface Fastro {
  /**
   * Immediately close the server listeners and associated HTTP connections.
   * @returns void
   */
  close: () => void;
  /**
   * Add application level middleware
   *
   * ### Example
   *
   * ```ts
   * import fastro from "../mod.ts";
   *
   * const f = new fastro();
   * f.use((req: HttpRequest, _ctx: Context, next: Next) => {
   *   console.log(`${req.method} ${req.url}`);
   *   return next();
   * });
   *
   * await f.serve();
   * ```
   * @param handler
   */
  use(...handler: Array<HandlerArgument>): Fastro;
  get(path: string, ...handler: Array<HandlerArgument>): Fastro;
  post(path: string, ...handler: Array<HandlerArgument>): Fastro;
  put(path: string, ...handler: Array<HandlerArgument>): Fastro;
  delete(path: string, ...handler: Array<HandlerArgument>): Fastro;
  patch(path: string, ...handler: Array<HandlerArgument>): Fastro;
  options(path: string, ...handler: Array<HandlerArgument>): Fastro;
  head(path: string, ...handler: Array<HandlerArgument>): Fastro;
  /**
   * Allow you access Server, Request, and Info after Middleware, Routes, Pages, and Static File Processing.
   * It can return `Response`, `Promise<Response>` or `void`.
   *
   * ### Example
   *
   * ```ts
   * import fastro, { Fastro, Info } from "../mod.ts";
   *
   * const f = new fastro();
   *
   * f.hook((_f: Fastro, _r: Request, _i: Info) => new Response("Hello World"));
   *
   * await f.serve();
   * ```
   *
   * @param hook
   */
  hook(hook: Hook): Fastro;
  /**
   * Allow you to access static files with custom `path`, `folder`, and `maxAge`
   *
   * ### Example
   *
   * ```ts
   * import fastro from "../mod.ts";
   *
   * const f = new fastro();
   *
   * f.static("/static", { folder: "static", maxAge: 90 });
   *
   * await f.serve();
   * ```
   * @param path
   * @param options
   */
  static(path: string, options?: { maxAge?: number; folder?: string }): Fastro;
  /**
   * Allow you to define SSR page with custom `path`, `element`, and `handler`
   *
   * ### Example
   *
   * ```ts
   * import fastro, { Context, HttpRequest } from "../mod.ts";
   * import user from "../pages/user.tsx";
   *
   * const f = new fastro();
   *
   * f.static("/static", { folder: "static", maxAge: 90 });
   *
   * f.page("/", user, (_req: HttpRequest, ctx: Context) => {
   *     const options = {
   *       props: { data: "Guest" },
   *       status: 200,
   *       html: { head: { title: "React Component" } },
   *     };
   *     return ctx.render(options);
   *   },
   * );
   * await f.serve();
   * ```
   * @param path
   * @param element
   * @param handler
   */
  page(
    path: string,
    element: Component,
    ...handler: Array<MiddlewareArgument>
  ): Fastro;
  register(mf: ModuleFunction): Fastro;
  getStaticFolder(): string;
  getStaticPath(): string;
  getDevelopmentStatus(): boolean;
  /**
   * Add a handler directly
   *
   * @param method
   * @param path
   * @param handler
   */
  push(
    method?: string,
    path?: string,
    ...handler: Array<HandlerArgument>
  ): Fastro;
  onListen(handler: ListenHandler): void;
  finished(): Promise<void> | undefined;
  getNest(): Nest;
  record: Record<string, any>;
  /**
   * Serves HTTP requests
   *
   * If the server was constructed without a specified port, 8000 is used.
   */
  serve(): Promise<void>;
}

type ListenHandler = (params: { hostname: string; port: number }) => void;

type Static = {
  file: string;
  contentType: string;
};

type Nest = Record<
  string,
  any
>;

export const BUILD_ID = Deno.env.get("DENO_DEPLOYMENT_ID") || toHashString(
  new Uint8Array(
    await crypto.subtle.digest(
      "sha-1",
      new TextEncoder().encode(crypto.randomUUID()),
    ),
  ),
  "hex",
);

export default class HttpServer implements Fastro {
  #server: Deno.Server | Server | undefined;
  #routes: Route[];
  #middlewares: Middleware[];
  #pages: Page[];
  #patterns: Record<string, URLPattern>;
  #root: URLPattern;
  #port;
  #ac;
  #staticUrl: string;
  #staticFolder: string;
  #maxAge: number;
  record: Record<string, any>;
  #development: boolean;
  #nest: Nest;
  #body: ReadableStream<any> | undefined;
  #listenHandler: ListenHandler | undefined;
  #hook: Hook | undefined;
  #staticPath: string | undefined;

  constructor(options?: { port?: number }) {
    this.#port = options?.port ?? 8000;
    this.#routes = [];
    this.#middlewares = [];
    this.#pages = [];
    this.#hook = undefined;
    this.#patterns = {};
    this.#nest = {};
    this.record = {};
    this.#root = new URLPattern({ pathname: "/*" });
    this.#ac = new AbortController();
    this.#staticUrl = "";
    this.#staticFolder = "";
    this.#maxAge = 0;
    this.#development = this.#getDevelopment();
    this.#handleInit();
    if (this.#development) this.#handleDevelopment();
    const status = this.#development ? "Development" : "Production";
    console.log(
      `%cStatus %c${status}`,
      "color: blue",
      "color: white",
    );
  }

  getNest(): Nest {
    return this.#nest;
  }

  #getDevelopment = () => {
    return Deno.env.get("DEVELOPMENT") === "false"
      ? false
      : Deno.args[0] === "--development";
  };

  #handleInitialData = async () => {
    const key = await keyPromise;
    let exportedKeyString = await exportCryptoKey(key);
    exportedKeyString = btoa(exportedKeyString);
    exportedKeyString = addSalt(exportedKeyString, SALT);
    exportedKeyString = reverseString(exportedKeyString);
    exportedKeyString = "{" + exportedKeyString + "}";
    return exportedKeyString;
  };

  serve = async (options?: { port: number }) => {
    this.record["exportedKeyString"] = await this.#handleInitialData();
    this.record["salt"] = SALT;
    const port = options?.port ?? this.#port;
    const [s] = await this.#build();
    if (s) return;

    if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
      this.#server = new Server({
        port,
        handler: this.#handleRequest,
        onError: this.#handleError,
      });

      if (this.#listenHandler) {
        this.#listenHandler({ hostname: "localhost", port: this.#port });
      } else {
        console.info(`Listening on http://locahost:${this.#port}`);
      }
      return this.#server.listenAndServe();
    }

    this.#server = Deno.serve({
      port,
      handler: this.#handleRequest,
      onListen: this.#listenHandler,
      onError: this.#handleError,
      signal: this.#ac.signal,
    });
  };

  #hydrateExist = async () => {
    try {
      for await (const dirEntry of Deno.readDir(`${Deno.cwd()}`)) {
        if (dirEntry.name === hydrateFolder) {
          return true;
        }
      }
    } catch {
      return false;
    }
    return false;
  };

  #build = async () => {
    if (!await this.#hydrateExist()) {
      await Deno.mkdir(`${Deno.cwd()}/${hydrateFolder}`);
    }
    for (let index = 0; index < this.#pages.length; index++) {
      const page = this.#pages[index];
      if (this.#isJSX(page.element as JSX.Element)) continue;
      const c = page.element as FunctionComponent;
      await this.#createHydrateFile(c.name);
      await this.#buildComponent(c.name);
      console.log(
        `%c${c.name.toLowerCase()}.js %cCreated!`,
        "color: blue",
        "color: green",
      );
    }

    // deno-lint-ignore no-deprecated-deno-api
    if (Deno.run == undefined) return [];
    return Deno.args.filter((v) => v === "--hydrate");
  };

  #createHydrateFile = async (elementName: string) => {
    try {
      const target =
        `${Deno.cwd()}/${hydrateFolder}/${elementName.toLowerCase()}.hydrate.tsx`;
      await Deno.writeTextFile(
        target,
        this.#createHydrate(elementName),
      );
    } catch (error) {
      console.error(error);
      return;
    }
  };

  async #buildComponent(elementName: string) {
    try {
      this.#staticPath = `${this.getStaticPath()}/${BUILD_ID}`;
      const es = new Esbuild(elementName);
      const bundle = await es.build();
      const componentPath =
        `${this.#staticPath}/${elementName.toLocaleLowerCase()}.js`;
      for (const file of bundle.outputFiles) {
        const str = new TextDecoder().decode(file.contents);
        this.push(
          "GET",
          componentPath,
          (req: Request) => {
            const referer = req.headers.get("referer");
            const host = req.headers.get("host") as string;
            if (!referer || !referer?.includes(host)) {
              return new Response(STATUS_TEXT[Status.NotFound], {
                status: Status.NotFound,
              });
            }
            return new Response(str, {
              headers: {
                "Content-Type": "application/javascript",
              },
            });
          },
        );
      }
    } catch {
      return;
    }
  }

  #createHydrate(comp: string) {
    return `/** == ${
      new Date().toLocaleString()
    } == DO NOT EDIT!! AUTOMATICALLY GENERATED BY FASTRO TO HYDRATE HTML FILES SO JS FILES CAN INTERACT. **/ 
import { h, hydrate } from "https://esm.sh/preact@10.16.0";import ${comp} from "../pages/${comp.toLowerCase()}.tsx";import { atobMe as a, clean as c,extractOriginalString as ex,importCryptoKey as i,keyType,keyUsages,reverseString as rev,} from "https://deno.land/x/fastro@${version}/crypto/key.ts";import { decryptData as d } from "https://deno.land/x/fastro@${version}/crypto/decrypt.ts";declare global {interface Window {__INITIAL_DATA__: any;}} fetch("/__INITIAL_DATA__").then((r) => r.json()).then((v) => { let r = c(v.d) as any;let s = c(v.s) as any;s = rev(s);s = a(s);r = rev(r);r = ex(r, s);r = a(r);i(r,keyType,keyUsages).then((k) => {d(k, window.__INITIAL_DATA__).then((v) => {delete window.__INITIAL_DATA__;const p = v as any;const r = document.getElementById("root");if (r) hydrate(h(${comp}, JSON.parse(p)), r);}).catch((error) => console.error(error));}).catch((error) => console.error(error));}).catch((error) => console.error(error));`;
  }

  onListen = (handler: ListenHandler) => {
    this.#listenHandler = handler;
  };

  push(
    method?: string,
    path?: string,
    ...handler: Array<HandlerArgument>
  ) {
    if (method && path) {
      this.#patterns[path] = new URLPattern({
        pathname: path,
      });

      if (handler.length === 1) {
        return this.#pushHandler(method, path, handler[0]);
      }
      this.#pushHandler(method, path, handler[handler.length - 1]);

      for (let i = 0; i < handler.length - 1; i++) {
        this.#pushMiddleware(
          <MiddlewareArgument> <unknown> handler[i],
          method,
          path,
        );
      }
    } else {
      for (let i = 0; i < handler.length; i++) {
        this.#pushMiddleware(
          <MiddlewareArgument> <unknown> handler[i],
        );
      }
    }

    return this;
  }

  #pushHandler(
    method: string,
    path: string,
    handler: HandlerArgument,
  ) {
    this.#routes.push({ method, path, handler });
    return this;
  }

  #pushMiddleware(
    handler: MiddlewareArgument,
    method?: string,
    path?: string,
  ) {
    this.#middlewares.push({ method, path, handler });
    return this;
  }

  use(...handler: HandlerArgument[]) {
    return this.push(undefined, undefined, ...handler);
  }

  get(path: string, ...handler: Array<HandlerArgument>) {
    return this.push("GET", path, ...handler);
  }

  post(path: string, ...handler: Array<HandlerArgument>) {
    return this.push("POST", path, ...handler);
  }

  put(path: string, ...handler: Array<HandlerArgument>) {
    return this.push("PUT", path, ...handler);
  }

  head(path: string, ...handler: Array<HandlerArgument>) {
    return this.push("HEAD", path, ...handler);
  }

  options(path: string, ...handler: Array<HandlerArgument>) {
    return this.push("OPTIONS", path, ...handler);
  }

  delete(path: string, ...handler: Array<HandlerArgument>) {
    return this.push("DELETE", path, ...handler);
  }

  patch(path: string, ...handler: Array<HandlerArgument>) {
    return this.push("PATCH", path, ...handler);
  }

  static(path: string, options?: { maxAge?: number; folder?: string }) {
    this.#staticUrl = path;
    if (options?.folder) this.#staticFolder = options?.folder;
    if (options?.maxAge) this.#maxAge = options.maxAge;
    return this;
  }

  page(
    path: string,
    element: Component,
    ...handlers: MiddlewareArgument[]
  ): Fastro {
    this.#patterns[path] = new URLPattern({
      pathname: path,
    });
    this.#pages.push({ path, element, handlers });
    return this;
  }

  getDevelopmentStatus() {
    return this.#development;
  }

  #handleDevelopment = () => {
    const refreshPath = `/___refresh___`;
    this.#patterns[refreshPath] = new URLPattern({
      pathname: refreshPath,
    });
    const refreshStream = (_req: Request) => {
      let timerId: number | undefined = undefined;
      this.#body = new ReadableStream({
        start(controller) {
          controller.enqueue(`data: ${BUILD_ID}\nretry: 100\n\n`);
          timerId = setInterval(() => {
            controller.enqueue(`data: ${BUILD_ID}\n\n`);
          }, 1000);
        },
        cancel() {
          if (timerId !== undefined) {
            clearInterval(timerId);
          }
        },
      });
      return new Response(this.#body.pipeThrough(new TextEncoderStream()), {
        headers: {
          "content-type": "text/event-stream",
        },
      });
    };
    this.#pushHandler("GET", refreshPath, refreshStream);
  };

  #handleInit = () => {
    const initPath = `/__INITIAL_DATA__`;
    this.#patterns[initPath] = new URLPattern({
      pathname: initPath,
    });

    this.#pushHandler("GET", initPath, (req: HttpRequest) => {
      const referer = req.headers.get("referer");
      const host = req.headers.get("host") as string;
      if (!referer || !referer?.includes(host)) {
        return new Response(STATUS_TEXT[Status.NotFound], {
          status: Status.NotFound,
        });
      }

      let s = btoa(req.record["salt"]);
      s = reverseString(s);
      return Response.json({
        d: req.record["exportedKeyString"],
        s: `{${s}}`,
      }, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "null",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        }),
      });
    });
  };

  #handleError = (error: unknown) => {
    const err: Error = error as Error;
    console.error(error);
    return new Response(err.stack);
  };

  #handleHook = async (h: Hook, r: Request, i: Info) => {
    const x = await h(this, r, i);
    if (this.#isResponse(x)) return x;
  };

  #handleRequest = async (
    req: Request,
    i: Info,
  ) => {
    const m = await this.#findMiddleware(req, i);
    if (m) return this.#handleResponse(m);

    const r = this.#findRoute(req.method, req.url);
    if (r?.handler) {
      const h = r?.handler as RequestHandler;
      const res = await h(
        this.#transformRequest(this.record, req, r.params, r.query, r.match),
        this.#initContext(i),
      );
      return this.#handleResponse(res);
    }

    const p = this.#findPage(req);
    if (p && p.handlers && p.match && p.element) {
      const result = await this.#handlePageMiddleware(
        p.handlers,
        req,
        i,
        p.match,
        p.element,
      );

      if (result) return this.#handleResponse(result);
    }

    const s = (await this.#findStaticFiles(this.#staticUrl, req.url)) as Static;
    if (s) {
      return new Response(s.file, {
        headers: {
          "Content-Type": s.contentType,
          "Cache-Control": `max-age=${this.#maxAge}`,
        },
      });
    }

    const b = await this.#handleBinary(this.#staticUrl, req.url);
    if (b) return this.#handleResponse(b);

    const h = this.#findHook();
    if (h) {
      const res = await this.#handleHook(h, req, i);
      if (res) return this.#handleResponse(res);
    }

    return new Response(STATUS_TEXT[Status.NotFound], {
      status: Status.NotFound,
    });
  };

  hook = (hook: Hook) => {
    this.#hook = hook;
    return this;
  };

  #findHook = () => {
    return this.#hook;
  };

  #findPage = (r: Request) => {
    if (this.#pages.length === 0) return null;
    let page: Page | undefined = undefined;
    const nestID = `p${r.url}`;
    const p = this.#nest[nestID];
    if (p) return p as RouteNest;
    let pattern: URLPattern | null = null;
    for (let index = 0; index < this.#pages.length; index++) {
      const p = this.#pages[index];
      const m = this.#patterns[p.path].test(r.url);
      if (m) {
        page = p;
        pattern = this.#patterns[p.path];
        break;
      }
    }

    const e = pattern?.exec(r.url);
    if (!e) return this.#nest[nestID] = null;
    return this.#nest[nestID] = {
      params: e.pathname.groups,
      query: this.#iterableToRecord(new URL(r.url).searchParams),
      handler: () => {},
      match: e,
      handlers: page?.handlers,
      element: page?.element,
    };
  };

  #handlePageMiddleware = async (
    handlers: MiddlewareArgument[],
    r: Request,
    i: Info,
    match: URLPatternResult,
    element: Component,
  ) => {
    const searchParams = new URL(r.url).searchParams;
    const ctx = this.#initContext(i, element, r);
    let result: unknown;

    for (let index = 0; index < handlers.length; index++) {
      const h = handlers[index];
      const req = this.#transformRequest(
        this.record,
        r,
        match?.pathname.groups,
        this.#iterableToRecord(searchParams),
        match,
      );

      const x = await h(req, ctx, (error, data) => {
        if (error) throw error;
        return data;
      });

      if (this.#isResponse(x)) {
        result = x;
        break;
      }
    }

    return result;
  };

  #findMiddleware = async (r: Request, i: Info) => {
    if (this.#middlewares.length === 0) return undefined;
    const method: string = r.method, url: string = r.url;
    const ctx = this.#initContext(i);
    const searchParams = new URL(r.url).searchParams;
    let result: unknown;

    for (let index = 0; index < this.#middlewares.length; index++) {
      const m = this.#middlewares[index];
      const nestId = `${method}${m.method}${m.path}${url}`;

      const match = this.#findMatch(m, nestId, url);
      if (!match) continue;
      const req = this.#transformRequest(
        this.record,
        r,
        match?.pathname.groups,
        this.#iterableToRecord(searchParams),
        match,
      );
      const x = await m.handler(
        req,
        ctx,
        (error, data) => {
          if (error) throw error;
          return data;
        },
      );

      if (this.#isResponse(x)) {
        result = x;
        break;
      }
    }

    return result;
  };

  #findMatch(
    m: Middleware | Page,
    nestId: string,
    url: string,
  ) {
    const r = this.#nest[nestId];
    if (r) return r as URLPatternResult;

    const pattern = m.path ? this.#patterns[m.path] : this.#root;
    const result = pattern.exec(url);
    if (result) {
      return this.#nest[nestId] = result;
    }
  }

  #findRoute(method: string, url: string) {
    const nestID = `route${method + url}`;
    const r = this.#nest[nestID];
    if (r) return r;

    let h: Route | undefined = undefined;
    let p: URLPattern | null = null;
    for (let index = 0; index < this.#routes.length; index++) {
      const r = this.#routes[index];
      const m = this.#patterns[r.path].test(url);
      if ((r.method === method) && m) {
        h = r;
        p = this.#patterns[r.path];
        break;
      }
    }
    if (!h) return this.#nest[nestID] = null;

    const e = p?.exec(url);
    if (!e) return this.#nest[nestID] = null;
    return this.#nest[nestID] = {
      params: e.pathname.groups,
      query: this.#iterableToRecord(new URL(url).searchParams),
      handler: h?.handler,
      match: e,
    };
  }

  #handleResponse(res: any, status = 200) {
    if (this.#isString(res)) return new Response(res, { status });
    if (this.#isResponse(res)) return res as Response;
    if (this.#isJSX(res)) return this.#renderToString(res, status);
    if (this.#isJSON(res) || Array.isArray(res)) {
      return Response.json(res, { status });
    }
    return new Response(res, { status });
  }

  getStaticPath() {
    return this.#staticUrl;
  }

  getStaticFolder() {
    return this.#staticFolder;
  }

  #findStaticFiles = async (url: string, reqUrl: string) => {
    const [nestID, pathname] = this.#nestIDPathname(url, reqUrl);
    if (this.#nest[nestID]) return this.#nest[nestID];

    const pattern = new URLPattern({ pathname });
    const match = pattern.exec(reqUrl);
    if (!match) return this.#nest[nestID] = null;

    const input = match?.pathname.groups["0"];
    const filePath = `${this.#staticFolder}/${input}`;
    const ct = contentType(extname(filePath)) || "application/octet-stream";

    const binary = ["png", "jpeg", "jpg", "gif", "pdf", "aac"];
    const b = binary.filter((v) => ct.includes(v));
    if (b.length > 0) return this.#nest[nestID] = null;

    let file;
    try {
      file = await Deno.readTextFile(`./${filePath}`);
    } catch {
      return this.#nest[nestID] = null;
    }

    return this.#nest[nestID] = { contentType: ct, file };
  };

  #nestIDPathname = (url: string, reqUrl: string) => {
    const staticUrl = url === "/" ? "" : url;
    const pathname = `${staticUrl}/*`;
    const nestID = `${pathname}${reqUrl}`;

    return [nestID, pathname];
  };

  #handleBinary = async (url: string, reqUrl: string) => {
    const [nestID, pathname] = this.#nestIDPathname(url, reqUrl);
    try {
      const match = new URLPattern({ pathname }).exec(reqUrl);
      const filePath = `${this.#staticFolder}/${match?.pathname.groups["0"]}`;
      const ct = contentType(extname(filePath)) || "application/octet-stream";

      if (filePath === "/") return this.#nest[nestID] = null;
      const file = await Deno.open(`./${filePath}`, { read: true });
      return new Response(file.readable, {
        headers: {
          "Content-Type": ct,
          "Cache-Control": `max-age=${this.#maxAge}`,
        },
      });
    } catch {
      return this.#nest[nestID] = null;
    }
  };

  #iterableToRecord(
    params: URLSearchParams,
  ) {
    const record: Record<string, string> = {};
    params.forEach((v, k) => (record[k] = v));
    return record;
  }

  #initContext(
    info: Info,
    element?: Component,
    req?: Request,
  ) {
    const ctx = new Context();
    ctx.server = this;
    ctx.info = info;
    ctx.render = (options?: RenderOptions) => {
      if (!element) return new Response("Component not found");
      return this.#renderElement(element, options, req);
    };
    ctx.send = (data: unknown, status?: number) => {
      return this.#handleResponse(data, status);
    };
    return ctx;
  }

  #transformRequest(
    record: Record<string, any>,
    r: Request,
    params?: Record<string, string | undefined> | undefined,
    query?: Record<string, string>,
    match?: URLPatternResult | null,
  ) {
    const req = r as HttpRequest;
    req.record = record;
    req.match = match;
    req.params = params;
    req.query = query;
    return req;
  }

  #renderToString(element: JSX.Element, status?: number) {
    const component = renderToString(element);
    return new Response(component, {
      status,
      headers: {
        "content-type": "text/html",
      },
    });
  }

  #renderElement(
    element: Component,
    options?: RenderOptions,
    req?: Request,
  ) {
    const opt = options ?? { html: {} };
    const r = new Render(element, opt, this.#nest, this, req);
    return r.render();
  }

  #isJSX(res: JSX.Element) {
    return res && res.props != undefined && res.type != undefined;
  }

  #isString(res: any) {
    return typeof res === "string";
  }

  #isResponse(res: any) {
    return res instanceof Response;
  }

  #isJSON(val: unknown) {
    try {
      const s = JSON.stringify(val);
      JSON.parse(s);
      return true;
    } catch {
      return false;
    }
  }

  finished = () => {
    if (this.#server instanceof Server) return;
    return this.#server?.finished;
  };

  register = (mf: ModuleFunction) => {
    return mf(this);
  };

  close() {
    if (!this.#server) return;
    if (this.#server instanceof Server) {
      return this.#server.close();
    }

    this.#server.finished.then(() => console.log("Server closed"));
    console.log("Closing server...");
    this.#ac.abort();
  }
}
