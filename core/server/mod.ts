// deno-lint-ignore-file no-explicit-any
import {
  contentType,
  encodeHex,
  extname,
  STATUS_CODE,
  STATUS_TEXT,
} from "./deps.ts";
import { Render } from "../render/render.ts";
import {
  Context,
  Fastro,
  FunctionComponent,
  Handler,
  HttpRequest,
  ListenHandler,
  Middleware,
  ModuleFunction,
  Page,
  Static,
} from "./types.ts";
import { EsbuildMod } from "../build/esbuildMod.ts";
import { Store } from "../map/mod.ts";
import { createTaskQueue } from "../utils/queue.ts";
import { ulid } from "jsr:@std/ulid/ulid";

export function checkReferer(req: Request) {
  const referer = req.headers.get("referer");
  const host = req.headers.get("host") as string;
  if (!referer || !referer?.includes(host)) {
    return new Response(STATUS_TEXT[STATUS_CODE.NotFound], {
      status: STATUS_CODE.NotFound,
    });
  }
}

export const BUILD_ID = Deno.env.get("DENO_DEPLOYMENT_ID") || encodeHex(
  new Uint8Array(
    await crypto.subtle.digest(
      "sha-1",
      new TextEncoder().encode(crypto.randomUUID()),
    ),
  ),
);

export const getDevelopment = () => {
  return Deno.env.get("ENV") === "DEVELOPMENT";
};

const parseBody = (req: Request) => {
  return async <T>() => {
    const text = await req.text();
    return JSON.parse(text) as T;
  };
};

const createResponse = (
  res: any,
  status = 200,
  headers?: Headers,
): Response => {
  if (typeof res === "string") return new Response(res, { status, headers });
  if (res instanceof Response) return res;

  const h = headers ? headers : new Headers({
    "Content-Type": "application/json",
  });
  if (
    typeof res === "number" || typeof res === "bigint" ||
    typeof res === "boolean" || typeof res === "undefined"
  ) {
    return new Response(JSON.stringify(res), { status, headers: h });
  }
  try {
    return Response.json(res, { status, headers: h });
  } catch (error) {
    throw error;
  }
};

export default class Server implements Fastro {
  constructor(options?: Record<string, any>) {
    this.serverOptions = options ?? {};
    this._render = new Render(this); // Add this line
    this.#handler = this.#createHandler();
    this.#addPropsEndpoint();
    this.#nonce = ulid();
  }
  getNonce(): string {
    return this.#nonce;
  }
  get(
    path: string,
    ...handler: Array<Handler>
  ): Fastro {
    return this.add("GET", path, ...handler);
  }
  post(
    path: string,
    ...handler: Array<Handler>
  ): Fastro {
    return this.add("POST", path, ...handler);
  }
  put(
    path: string,
    ...handler: Array<Handler>
  ): Fastro {
    return this.add("PUT", path, ...handler);
  }
  patch(
    path: string,
    ...handler: Array<Handler>
  ): Fastro {
    return this.add("PATCH", path, ...handler);
  }
  delete(
    path: string,
    ...handler: Array<Handler>
  ): Fastro {
    return this.add("DELETE", path, ...handler);
  }
  options(
    path: string,
    ...handler: Array<Handler>
  ): Fastro {
    return this.add("OPTIONS", path, ...handler);
  }
  head(
    path: string,
    handler: Handler,
    ...middleware: Array<Handler>
  ): Fastro {
    return this.add("HEAD", path, handler, ...middleware);
  }
  page<T = any>(
    path: string,
    page: Page<T>,
    ...middleware: Array<Handler>
  ): Fastro {
    return this.#addPage(path, page, ...middleware);
  }
  use(...handlers: Handler[]): Fastro {
    for (let index = 0; index < handlers.length; index++) {
      const element = handlers[index];
      const middleware: Middleware = {
        path: undefined,
        method: undefined,
        handler: element,
      };
      this.#middleware.push(middleware);
    }
    return this;
  }

  static(
    path: string,
    options?: { maxAge?: number; folder?: string; referer?: boolean },
  ) {
    this.#staticUrl = path;
    if (options?.folder) this.#staticFolder = options?.folder;
    if (options?.referer) this.#staticReferer = options.referer;
    if (options?.maxAge) this.#maxAge = options.maxAge;
    return this;
  }

  #addPage = (path: string, page: Page, ...middlewares: Handler[]) => {
    const key = path;
    this.#routePage[key] = page;
    if (middlewares.length > 0) {
      this.#pushPageMiddleware(path, ...middlewares);
    }
    return this;
  };

  #pushPageMiddleware = (
    path: string,
    ...middlewares: Array<Handler>
  ) => {
    for (let index = 0; index < middlewares.length; index++) {
      const handler = middlewares[index];
      this.#pageMiddleware.push({
        method: undefined,
        path,
        handler,
      });
    }
  };

  add = (
    method: string,
    path: string,
    ...handler: Handler[]
  ) => {
    const key = method + "-" + path;
    if (handler.length === 1) {
      this.#routeHandler[key] = handler[0];
      return this;
    }

    this.#push(method, path, ...handler);
    return this;
  };

  #push = (
    method: any,
    path: any,
    ...handlers: Array<Handler>
  ) => {
    for (let index = 0; index < handlers.length - 1; index++) {
      const handler = handlers[index];
      this.#middleware.push({
        method,
        path,
        handler,
      });
    }
    const key = method + "-" + path;
    this.#routeHandler[key] = handlers[handlers.length - 1];
  };

  #build = async () => {
    if (Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined) {
      return [];
    }
    for (const [_key, page] of Object.entries(this.#routePage)) {
      await this.#createHydrate(page);
      const result = await this.#buildPageComponent(page);
      if (
        Deno.env.get("ENV") === "DEVELOPMENT" && result && result.outputFiles
      ) {
        for (const out of result.outputFiles) {
          const fc = page.component as FunctionComponent;
          const decoder = new TextDecoder();
          const str = decoder.decode(out.contents);
          const path =
            `/js/${fc.name.toLocaleLowerCase()}.${this.getNonce()}.js`;
          this.add(
            "GET",
            path,
            () => {
              return new Response(str, {
                headers: { "content-type": "application/javascript" },
              });
            },
          );
        }
      }
    }
    return Deno.args.filter((v) => v === "--build");
  };

  #createHydrate = async (c: Page) => {
    if (typeof c.component != "function") return;
    const name = c.component.name.toLocaleLowerCase();
    const folder = c.folder ? c.folder + "/" : "";
    const [d] = Deno.args.filter((v) => v === "--debug");
    const debug = !d ? "" : `import "preact/debug";
`;
    const str = `${debug}import { h, hydrate } from "preact";
import app from "../${folder}${name}.page.tsx";
function getXRequestId() {
    const metaTag = document.querySelector('meta[name="x-request-id"]');
    return metaTag ? metaTag.content : null;
}
async function fetchProps(root: HTMLElement) {
  try {
    const parsedUrl = new URL(window.location.href);
    const response = await fetch("/__/" + getXRequestId());
    const data = await response.json();
    if (!data) throw new Error("undefined");
    hydrate(h(app, { data }), root);
  } catch {
    setTimeout(() => {
      fetchProps(root);
    }, 500);
  }
}
const root = document.getElementById("root");
if (root) fetchProps(root);
`;

    const dir = Deno.cwd() + "/.fastro";
    try {
      Deno.readDirSync(dir);
    } catch {
      Deno.mkdirSync(dir);
    }

    const path = dir + "/" + name + ".hydrate.tsx";
    await Deno.writeTextFile(path, str);
  };

  async #buildPageComponent(c: Page) {
    if (typeof c.component == "function") {
      const str = c.component.name.toLocaleLowerCase() +
        ".page.tsx";
      console.log(
        `%cBuild: %c${str}`,
        "color: blue",
        "color: white",
      );

      const es = new EsbuildMod(c);
      return await es.build();
    }
  }

  #getParamsHandler<T extends Record<string, Handler>>(
    req: Request,
    data: T,
  ): [Handler, Record<string, string | undefined> | undefined] | undefined {
    for (const [key, handler] of Object.entries(data)) {
      const [method, path] = key.split("-");
      const pattern = new URLPattern({ pathname: path });
      if (key.includes(":") && pattern.test(req.url) && req.method === method) {
        const exec = pattern.exec(req.url);
        const params = exec?.pathname.groups;
        return [handler, params];
      }
    }
  }

  #getParamsPage<T extends Record<string, Page>>(
    req: Request,
    data: T,
  ): [Page, Record<string, string | undefined> | undefined] | undefined {
    for (const [path, page] of Object.entries(data)) {
      const pattern = new URLPattern({ pathname: path });
      if (path.includes(":") && pattern.test(req.url)) {
        const match = pattern.exec(req.url);
        const params = match?.pathname.groups;
        return [page, params];
      }
    }
  }

  #handleStaticFile = async (req: Request) => {
    const s = (await this.#findStaticFiles(
      this.#staticUrl,
      req.url,
      this.getNonce(),
    )) as Static;
    if (s) {
      const ref = checkReferer(req);
      if (ref && this.#staticReferer) return ref;
      return new Response(s.file, {
        headers: {
          "Content-Type": s.contentType,
          "Cache-Control": `max-age=${this.#maxAge}`,
        },
      });
    }

    const b = await this.#handleBinary(this.#staticUrl, req.url);
    if (b) return b;

    return new Response(STATUS_TEXT[STATUS_CODE.NotFound], {
      status: STATUS_CODE.NotFound,
    });
  };

  #addPropsEndpoint = () => {
    const path = "/__/:key*";
    this.add("GET", path, (req, _ctx) => {
      const ref = checkReferer(req);
      if (!getDevelopment() && ref) return ref;
      const key = req.params?.key ? req.params?.key : "";
      const data = this.serverOptions[key];

      // Handle case where data doesn't exist
      if (data === undefined || data === null) {
        return new Response(JSON.stringify({ error: "Data not found" }), {
          status: 404,
          headers: new Headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "null",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
          }),
        });
      }

      // Data exists, return normally
      return new Response(JSON.stringify(data), {
        headers: new Headers({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "null",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        }),
      });
    });
  };

  #handlePage = (
    req: Request,
    info: Deno.ServeHandlerInfo,
  ) => {
    const url = new URL(req.url);
    const key = url.pathname;
    let page: Page = this.#routePage[key];
    let params: Record<string, string | undefined> | undefined = undefined;

    if (!page) {
      const res = this.#getParamsPage(req, this.#routePage);
      if (res) {
        const [pg, prm] = res;
        page = pg;
        params = prm;
      }
    }

    if (!page) return [];

    const ctx = this.serverOptions as Context;
    ctx.info = info;
    ctx.next = () => {};
    ctx.url = new URL(req.url);
    ctx.server = this;
    ctx.kv = this.serverOptions["kv"];
    ctx.options = this.serverOptions;
    ctx.stores = this.stores;
    ctx.render = async <T>(data: T, headers?: Headers) => {
      const r = new Render(this);
      return await r.render(key, page, data, this.getNonce(), headers);
    };
    ctx.send = <T>(data: T, status = 200, headers?: Headers) => {
      return createResponse(data, status, headers);
    };
    return [page, ctx, params, url];
  };

  #findMatch(
    m: Middleware,
    id: string,
    url: string,
    method: string,
    page?: boolean,
  ) {
    const r = this.#record[id];
    if (r) return r as URLPatternResult;

    const pattern = m.path
      ? new URLPattern({ pathname: m.path })
      : new URLPattern({ pathname: "/*" });

    const result = pattern.exec(url);
    if (!result) return undefined;
    if (!page && (m.path !== undefined) && (m.method !== method)) {
      return undefined;
    }

    return this.#record[id] = result;
  }

  #handlePageMiddleware = (
    req: Request,
    info: Deno.ServeHandlerInfo,
  ) => {
    const page = true;
    return this.#handleMiddleware(req, info, page);
  };

  #handleMiddleware = async (
    req: Request,
    info: Deno.ServeHandlerInfo,
    page?: boolean,
  ) => {
    const mid = !page ? this.#middleware : this.#pageMiddleware;
    if (mid.length === 0) return undefined;
    const method: string = req.method, url: string = req.url;
    const u = new URL(url);
    for (let index = 0; index < mid.length; index++) {
      const m = mid[index];
      const id = method + m.method + m.path + url;
      const match = !page
        ? this.#findMatch(m, id, url, method)
        : this.#findMatch(m, id, url, method, true);

      if (!match) continue;
      const ctx = this.#transformCtx(info, u, this.serverOptions, false);
      ctx.render = <T>(data: T, headers?: Headers) => {
        return this._render.renderJsx(data as preact.JSX.Element, headers);
      };
      const handler = await m.handler(
        this.#transformRequest(req, match?.pathname.groups, u),
        ctx,
      ) as any;

      if (handler instanceof Response) {
        return handler;
      }
    }
  };

  #iterableToRecord(
    params: URLSearchParams,
  ) {
    const record: Record<string, string> = {};
    params.forEach((v, k) => (record[k] = v));
    return record;
  }

  #transformRequest = (
    req: Request,
    params?: Record<string, string | undefined>,
    url?: URL,
  ) => {
    const u = url ?? new URL(req.url);
    const r = req as HttpRequest;
    r.params = params;
    r.parseBody = parseBody(req);
    r.query = this.#iterableToRecord(u.searchParams);
    return r;
  };

  #transformCtx = (
    info: Deno.ServeHandlerInfo,
    url: URL,
    options: Record<string, any>,
    _page?: boolean,
  ) => {
    const ctx = options as Context;
    const _r = new Render(this);
    ctx.send = <T>(data: T, status = 200) => {
      return createResponse(data, status);
    };
    ctx.info = info;
    ctx.next = () => {};
    ctx.url = url;
    ctx.server = this;
    ctx.kv = this.serverOptions["kv"];
    ctx.stores = this.stores;
    return ctx;
  };

  #handleRequest = (req: Request, info: Deno.ServeHandlerInfo) => {
    const id = req.method + req.url;
    if (this.#record[id]) return this.#record[id];
    const url = new URL(req.url);
    const key = req.method + "-" + url.pathname;
    let handler = this.#routeHandler[key];
    let params: Record<string, string | undefined> | undefined;
    if (!handler) {
      const res = this.#getParamsHandler(req, this.#routeHandler);
      if (res) {
        const [h, p] = res;
        handler = h;
        params = p;
      }
    }

    const ctx = this.#transformCtx(info, url, this.serverOptions, false);
    ctx.render = <T>(data: T, headers?: Headers) => {
      return this._render.renderJsx(data as preact.JSX.Element, headers);
    };
    return this.#record[id] = { handler, ctx, params, url };
  };

  #createHandler = () => {
    return async (req: Request, info: Deno.ServeHandlerInfo) => {
      const m = await this.#handleMiddleware(req, info);
      if (m) return m;

      const r = this.#handleRequest(req, info);
      if (r.handler) {
        const tr = this.#transformRequest(req, r.params, r.url);
        const res = await r.handler(tr, r.ctx);
        return createResponse(res);
      }

      const pm = await this.#handlePageMiddleware(req, info);
      if (pm) return pm;

      const [page, pageCtx, pageParams, pageUrl] = this.#handlePage(
        req,
        info,
      ) as any;
      if (page) {
        return page.handler(
          this.#transformRequest(req, pageParams, pageUrl),
          pageCtx,
        ) as Response;
      }

      return await this.#handleStaticFile(req);
    };
  };

  #normalizeStaticUrl = (url: string, reqUrl: string) => {
    const staticUrl = url === "/" ? "" : url;
    const pathname = `${staticUrl}/*`;
    const id = `${pathname}${reqUrl}`;
    return [id, pathname];
  };

  #findStaticFiles = async (url: string, initReqUrl: string, nonce: string) => {
    let reqUrl = "";
    if (initReqUrl.endsWith(`${nonce}.js`)) {
      const [script] = initReqUrl.split(nonce);
      reqUrl = script + "js";
    }
    const [id, pathname] = this.#normalizeStaticUrl(url, reqUrl);
    if (this.#record[id]) return this.#record[id];

    const pattern = new URLPattern({ pathname });
    const match = pattern.exec(reqUrl);
    if (!match) return this.#record[id] = null;

    const input = match?.pathname.groups["0"];
    const filePath = `${this.#staticFolder}/${input}`;
    const ct = contentType(extname(filePath)) || "application/octet-stream";

    const binary = ["png", "jpeg", "jpg", "gif", "pdf", "aac", "ico"];
    const b = binary.filter((v) => ct.includes(v));
    if (b.length > 0) return this.#record[id] = null;

    let file;
    try {
      file = await Deno.readTextFile(`./${filePath}`);
    } catch {
      return this.#record[id] = null;
    }

    return this.#record[id] = { contentType: ct, file };
  };

  #handleBinary = async (url: string, reqUrl: string) => {
    const [id, pathname] = this.#normalizeStaticUrl(url, reqUrl);
    try {
      const match = new URLPattern({ pathname }).exec(reqUrl);
      const filePath = `${this.#staticFolder}/${match?.pathname.groups["0"]}`;
      const ct = contentType(extname(filePath)) || "application/octet-stream";
      if (filePath.endsWith("/")) {
        return this.#record[id] = null;
      }
      const file = await Deno.open(`./${filePath}`, { read: true });
      return new Response(file.readable, {
        headers: {
          "Content-Type": ct,
          "Cache-Control": `max-age=${this.#maxAge}`,
        },
      });
    } catch {
      return this.#record[id] = null;
    }
  };

  group = (mf: ModuleFunction) => {
    return Promise.resolve(mf(this));
  };

  serve = async (options?: { port?: number; onListen?: ListenHandler }) => {
    const [s] = await this.#build();
    if (s) return Deno.exit();

    this.#server = Deno.serve({
      port: options && options.port ? options.port : 8000,
      handler: this.#handler,
      signal: this.#ac.signal,
      onListen: options && options.onListen ? options.onListen : () => {
        console.log(
          `%cListening on: %chttp://localhost:${options?.port ?? 8000}`,
          "color: blue",
          "color: white",
        );
      },
    });
  };

  shutdown = async () => {
    if (this.#server) {
      this.#server.finished.then(() => console.log("Server closed"));
      console.log("Closing server...");
      this.#ac.abort();
      await this.#server.shutdown();
    }
  };

  getPages(): Record<string, Page> {
    return this.#routePage;
  }

  getRoutes(): Record<string, Handler> {
    return this.#routeHandler;
  }

  #server: Deno.HttpServer | undefined;
  #ac: AbortController = new AbortController();
  #handler: (
    req: Request,
    info: Deno.ServeHandlerInfo,
  ) => Response | Promise<Response>;
  #routeHandler: Record<string, Handler> = {};
  #routePage: Record<string, Page> = {};
  #record: Record<string, any> = {};
  #middleware: Middleware[] = [];
  #pageMiddleware: Middleware[] = [];
  #staticFolder = "static";
  #staticUrl = "/";
  #staticReferer = false;
  #maxAge = 0;
  #nonce = "";
  serverOptions: Record<string, any> = {};
  stores = new Map<string, Store<string | number | symbol, any>>();
  private taskQueue = createTaskQueue();
  private _render: Render;
}
