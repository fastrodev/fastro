// deno-lint-ignore-file
import {
  ConnInfo,
  contentType,
  extname,
  Handler,
  ReactDOMServer,
  Server,
  Status,
  STATUS_TEXT,
  toHashString,
} from "./deps.ts";
import { Markdown, Post } from "./markdown.tsx";
import { Render } from "./render.tsx";

export type ServerHandler = Deno.ServeHandler | Handler;

export type HandlerArgument =
  | ServerHandler
  | RequestHandler
  | MiddlewareArgument;

export interface Next {
  (error?: Error, data?: unknown): unknown;
}

export class HttpRequest extends Request {
  record!: Record<string, any>;
  match?: URLPatternResult | null;
  params?: Record<string, string | undefined>;
  query?: Record<string, string>;
  [key: string]: any;
}

type Info = Deno.ServeHandlerInfo | ConnInfo;

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
  rel?: string;
  integrity?: string;
  media?: string;
  crossorigin?: "anonymous" | "use-credentials" | "" | undefined;
};

export type RenderOptions = {
  build?: boolean;
  cache?: boolean;
  pageFolder?: string;
  status?: number;
  props?: unknown;
  development?: boolean;
  html: {
    lang?: string;
    class?: string;
    head?: {
      title?: string;
      descriptions?: string;
      meta?: Meta[];
      script?: Script[];
      link?: Link[];
    };
    body?: {
      rootClass?: string;
      class?: string;
      style?: string;
      script?: Script[];
    };
  };
};

export class Context {
  server!: Fastro;
  info!: Info;
  [key: string]: any;
  props!: (props: unknown) => this;
  render!: (options?: RenderOptions) => Response | Promise<Response>;
  send!: (data: unknown, status?: number) => Response | Promise<Response>;
}

export type RequestHandler = (
  request: HttpRequest,
  ctx: Context,
) =>
  | Response
  | Promise<Response>;

export type MiddlewareArgument = (
  request: HttpRequest,
  ctx: Context,
  next: Next,
) =>
  | Promise<unknown>
  | unknown;

export type ExecHandler = (
  request?: HttpRequest,
  ctx?: Context,
) => Response;

export type RouteNest = {
  handler: HandlerArgument;
  method?: string;
  pathname?: string;
  params?: Record<string, string | undefined>;
  query?: Record<string, string>;
  match?: URLPatternResult;
  element?: Component;
  handlers?: Array<MiddlewareArgument>;
};

export type Route = {
  method: string;
  path: string;
  handler: HandlerArgument;
};

export type Middleware = {
  method?: string;
  path?: string;
  handler: MiddlewareArgument;
};

export type Component = FunctionComponent | JSX.Element;

export type FunctionComponent = (props?: any) => JSX.Element;
export type Page = {
  path: string;
  element: Component;
  handlers: Array<MiddlewareArgument>;
};

export interface Fastro {
  close: () => void;
  use(...handler: Array<HandlerArgument>): Fastro;
  get(path: string, ...handler: Array<HandlerArgument>): Fastro;
  post(path: string, ...handler: Array<HandlerArgument>): Fastro;
  put(path: string, ...handler: Array<HandlerArgument>): Fastro;
  delete(path: string, ...handler: Array<HandlerArgument>): Fastro;
  patch(path: string, ...handler: Array<HandlerArgument>): Fastro;
  options(path: string, ...handler: Array<HandlerArgument>): Fastro;
  head(path: string, ...handler: Array<HandlerArgument>): Fastro;
  static(path: string, options?: { maxAge?: number; folder?: string }): Fastro;
  page(
    path: string,
    element: Component,
    ...handler: Array<MiddlewareArgument>
  ): Fastro;
  getStaticFolder(): string;
  getStaticPath(): string;
  getDevelopmentStatus(): boolean;
  push(
    method?: string,
    path?: string,
    ...handler: Array<HandlerArgument>
  ): Fastro;
  onListen(handler: ListenHandler): void;
  finished(): Promise<void> | undefined;
}

type ListenHandler = (params: { hostname: string; port: number }) => void;

export type Static = {
  file: string;
  contentType: string;
};

export const BUILD_ID = Deno.env.get("DENO_DEPLOYMENT_ID") || toHashString(
  new Uint8Array(
    await crypto.subtle.digest(
      "sha-1",
      new TextEncoder().encode(crypto.randomUUID()),
    ),
  ),
  "hex",
);

export class HttpServer implements Fastro {
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
  #nest: Record<
    string,
    RouteNest | URLPatternResult | Static | null | undefined
  >;
  #body: ReadableStream<any> | undefined;
  #unstable: boolean | undefined;
  #listenHandler: ListenHandler | undefined;

  constructor(options?: { port?: number }) {
    this.#port = options?.port ?? 8000;
    this.#routes = [];
    this.#middlewares = [];
    this.#pages = [];
    this.#patterns = {};
    this.#nest = {};
    this.record = {};
    this.#root = new URLPattern({ pathname: "/*" });
    this.#ac = new AbortController();
    this.#staticUrl = "";
    this.#staticFolder = "";
    this.#maxAge = 0;
    this.#development = this.#getDevelopment();
    this.#unstable = this.#getUnstable();
    console.log("this.#development", this.#development);
  }

  #getUnstable = () => {
    return Deno.args.length < 0
      ? Deno.env.get("UNSTABLE") === "true"
      : (Deno.args[0] === "--unstable" ?? false);
  };

  #getDevelopment = () => {
    return Deno.env.get("DEVELOPMENT") === "false"
      ? false
      : Deno.args[0] === "--development";
  };

  serve = async () => {
    await this.#build();
    if (this.#unstable) {
      return this.#server = Deno.serve({
        port: this.#port,
        handler: this.#handleRequest,
        onListen: this.#listenHandler,
        onError: this.#handleError,
        signal: this.#ac.signal,
      });
    }

    this.#server = new Server({
      port: this.#port,
      handler: this.#handleRequest,
      onError: this.#handleError,
    });

    if (this.#listenHandler) {
      this.#listenHandler({ hostname: "localhost", port: this.#port });
    }
    this.#server.listenAndServe();
  };

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

      if (this.#development) this.#handleDevelopment();
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

  #build = async () => {
    if (!this.#development) {
      console.log("this.#development===>", this.#development);
      return;
    }
    try {
      Deno.mkdirSync(`${Deno.cwd()}/hydrate`);
    } catch (error) {
      throw error;
    }

    for (let index = 0; index < this.#pages.length; index++) {
      const page = this.#pages[index];
      const r = new Render(
        page.element,
        {
          props: {},
          html: {},
        },
        this.#nest,
        this,
      );

      const el = page.element as FunctionComponent;
      r.createHydrateFile(el.name);
      await r.createBundle(el.name);
    }
    Deno.removeSync(`${Deno.cwd()}/hydrate`, { recursive: true });
  };

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
    const refreshPath = "/refresh";
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

  #handleError = (error: unknown) => {
    const err: Error = error as Error;
    console.error(error);
    return new Response(err.stack);
  };

  #handleRequest = async (
    req: Request,
    i: Info,
  ) => {
    const m = await this.#findMiddleware(req, i);
    if (m) return this.#handleResponse(m);

    const r = this.#findRoute(req.method, req.url);
    if (r?.handler) {
      const h = r?.handler as MiddlewareArgument;
      const res = await h(
        this.#transformRequest(this.record, req, r.params, r.query, r.match),
        this.#initContext(i),
        () => {},
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

    const md = this.#findMarkdownFiles(req);
    if (md) {
      const options: RenderOptions = {
        cache: true,
        html: {
          head: {
            title: md.meta?.title,
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
            }],
          },
          body: {
            class: "text-bg-dark",
            rootClass: "p-3 mx-auto flex-column",
          },
        },
      };
      return this.#renderElement(md.content, options);
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

    return this.#handleBinary(this.#staticUrl, req.url);
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
    const ctx = this.#initContext(i, element);
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
      const nestId = method + m.method + m.path + url;

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
    const nestID = method + url;
    const r = this.#nest[nestID];
    if (r) return r as RouteNest;

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

  #findMarkdownFiles = (req: Request) => {
    return new Markdown(this.#nest, req).getPost() as Post;
  };

  #findStaticFiles = async (staticUrl: string, reqUrl: string) => {
    const pathname = staticUrl + `/*`;
    const nestID = pathname + reqUrl;
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

  #handleBinary = async (staticUrl: string, reqUrl: string) => {
    try {
      const match = new URLPattern({ pathname: staticUrl + `/*` }).exec(reqUrl);
      const filePath = `${this.#staticFolder}/${match?.pathname.groups["0"]}`;
      const ct = contentType(extname(filePath)) || "application/octet-stream";

      if (filePath === "/") {
        return new Response(STATUS_TEXT[Status.NotFound], {
          status: Status.NotFound,
        });
      }
      const file = await Deno.open(`./${filePath}`, { read: true });
      return new Response(file.readable, {
        headers: {
          "Content-Type": ct,
          "Cache-Control": `max-age=${this.#maxAge}`,
        },
      });
    } catch {
      return new Response(STATUS_TEXT[Status.NotFound], {
        status: Status.NotFound,
      });
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
  ) {
    let props: unknown;
    const ctx = new Context();
    ctx.server = this;
    ctx.info = info;
    ctx.props = (p: unknown) => {
      props = p;
      return ctx;
    };
    ctx.render = (options?: RenderOptions) => {
      if (!element) return new Response("Component not found");
      if (options) options.props = props;
      return this.#renderElement(element, options);
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
    const component = ReactDOMServer.renderToString(element);
    return new Response(component, {
      status,
      headers: {
        "content-type": "text/html",
      },
    });
  }

  #renderElement(element: Component, options?: RenderOptions) {
    const opt = options ?? { html: {} };
    const r = new Render(element, opt, this.#nest, this);
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
