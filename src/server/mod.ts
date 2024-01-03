// deno-lint-ignore-file no-explicit-any
import { JSX } from "preact";
import {
  contentType,
  encodeHex,
  extname,
  STATUS_CODE,
  STATUS_TEXT,
} from "./deps.ts";
import { Render } from "./render.tsx";
import {
  Context,
  Fastro,
  Handler,
  HttpRequest,
  ListenHandler,
  Middleware,
  ModuleFunction,
  Page,
  Static,
} from "./types.ts";
import { EsbuildMod } from "../build/esbuildMod.ts";

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

export default class Server implements Fastro {
  constructor() {
    this.#handler = this.#createHandler();
  }
  get<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro {
    return this.add<T>("GET", path, handler, ...middleware);
  }
  post<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro {
    return this.add("POST", path, handler, ...middleware);
  }
  put<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro {
    return this.add("PUT", path, handler, ...middleware);
  }
  patch<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro {
    return this.add("PATCH", path, handler, ...middleware);
  }
  delete<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro {
    return this.add("DELETE", path, handler, ...middleware);
  }
  options<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro {
    return this.add("OPTIONS", path, handler, ...middleware);
  }
  head<T = any>(
    path: string,
    handler: Handler<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro {
    return this.add("HEAD", path, handler, ...middleware);
  }
  page<T = any>(
    path: string,
    page: Page<T>,
    ...middleware: Array<Handler<T>>
  ): Fastro {
    return this.#addPage(path, page, ...middleware);
  }
  use<T = any>(...handlers: Handler<T>[]): Fastro {
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

  #addPage = <T>(path: string, page: Page<T>, ...middlewares: Handler<T>[]) => {
    const key = path;
    this.#routePage[key] = page;
    if (middlewares.length > 0) {
      this.#pushPageMiddleware<T>(path, ...middlewares);
    }
    return this;
  };

  #pushPageMiddleware = <T>(
    path: string,
    ...middlewares: Array<Handler<T>>
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

  add = <T>(
    method: string,
    path: string,
    handler: Handler<T>,
    ...middlewares: Handler<T>[]
  ) => {
    const key = method + "-" + path;
    this.#routeHandler[key] = handler;
    if (middlewares.length > 0) {
      this.#push<T>(method, path, ...middlewares);
    }
    return this;
  };

  #push = <T = any>(
    method: any,
    path: any,
    ...middlewares: Array<Handler<T>>
  ) => {
    for (let index = 0; index < middlewares.length; index++) {
      const handler = middlewares[index];
      this.#middleware.push({
        method,
        path,
        handler,
      });
    }
  };

  #build = async () => {
    // deno-lint-ignore no-deprecated-deno-api
    if (Deno.run === undefined) return [];
    for (const [_key, page] of Object.entries(this.#routePage)) {
      await this.#createHydrate(page);
      await this.#buildPageComponent(page);
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
const root = document.getElementById("root");
if (root) {
  const parsedUrl = new URL(window.location.href);
  fetch("/__" + parsedUrl.pathname + "/props")
    .then((response) => response.json())
    .then((data) => {
      hydrate(
        h(app, { data }),
        root,
      );
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
`;

    const path = `${Deno.cwd()}/.fastro/${name}.hydrate.tsx`;
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
      await es.build();
      es.stop();
    }
  }

  #getParamsHandler<T extends Record<string, Handler>>(
    req: Request,
    data: T,
  ): [Handler, Record<string, string | undefined> | undefined] | undefined {
    for (const [key, handler] of Object.entries(data)) {
      const [, path] = key.split("-");
      const pattern = new URLPattern({ pathname: path });
      if (key.includes(":") && pattern.test(req.url)) {
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
    const s = (await this.#findStaticFiles(this.#staticUrl, req.url)) as Static;
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
    if (b) return b as Response;

    return new Response(STATUS_TEXT[STATUS_CODE.NotFound], {
      status: STATUS_CODE.NotFound,
    });
  };

  #handlePage = (
    req: Request,
    info: Deno.ServeHandlerInfo,
  ): [Page, Context<any>, Record<string, string | undefined> | undefined] => {
    const url = new URL(req.url);
    const key = url.pathname;
    let page = this.#routePage[key];
    let params: Record<string, string | undefined> | undefined = undefined;
    if (!page) {
      const res = this.#getParamsPage(req, this.#routePage);
      if (res) {
        const [pg, prm] = res;
        page = pg;
        params = prm;
      }
    }

    const r = new Render(this);
    const ctx = {
      render: <T>(data: T) => r.render(key, page, data),
      info: info,
      next: () => {},
      url: new URL(req.url),
    };
    return [page, ctx, params];
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
    let result;
    for (let index = 0; index < mid.length; index++) {
      const m = mid[index];
      const id = method + m.method + m.path + url;
      const match = !page
        ? this.#findMatch(m, id, url, method)
        : this.#findMatch(m, id, url, method, true);

      if (!match) continue;
      const x = await m.handler(
        this.#transformRequest(req, match?.pathname.groups),
        this.#transformCtx(req, info),
      ) as any;

      if (x instanceof Response) {
        result = x;
        break;
      }
    }

    return result;
  };

  #transformRequest = (
    req: Request,
    params?: Record<string, string | undefined>,
  ) => {
    const r = req as HttpRequest;
    r.params = params;
    return r;
  };

  #transformCtx = (
    req: Request,
    info: Deno.ServeHandlerInfo,
  ) => {
    const r = new Render(this);
    return {
      info,
      render: <T>(jsx: T) => {
        return r.renderJsx(jsx as JSX.Element);
      },
      next: () => {},
      url: new URL(req.url),
    };
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

    return this.#record[id] = [handler, this.#transformCtx(req, info), params];
  };

  #createHandler = () => {
    return async (req: Request, info: Deno.ServeHandlerInfo) => {
      const m = await this.#handleMiddleware(req, info);
      if (m) return m;

      const [handler, ctx, params] = this.#handleRequest(req, info);
      if (handler) {
        return handler(this.#transformRequest(req, params), ctx) as Promise<
          Response
        >;
      }

      const pm = await this.#handlePageMiddleware(req, info);
      if (pm) return pm;

      const [page, pageCtx, pageParams] = this.#handlePage(req, info);
      if (page) {
        return page.handler(
          this.#transformRequest(req, pageParams),
          pageCtx,
        ) as Promise<Response>;
      }

      return this.#handleStaticFile(req);
    };
  };

  #normalizeStaticUrl = (url: string, reqUrl: string) => {
    const staticUrl = url === "/" ? "" : url;
    const pathname = `${staticUrl}/*`;
    const id = `${pathname}${reqUrl}`;
    return [id, pathname];
  };

  #findStaticFiles = async (url: string, reqUrl: string) => {
    const [id, pathname] = this.#normalizeStaticUrl(url, reqUrl);
    if (this.#record[id]) return this.#record[id];

    const pattern = new URLPattern({ pathname });
    const match = pattern.exec(reqUrl);
    if (!match) return this.#record[id] = null;

    const input = match?.pathname.groups["0"];
    const filePath = `${this.#staticFolder}/${input}`;
    const ct = contentType(extname(filePath)) || "application/octet-stream";

    const binary = ["png", "jpeg", "jpg", "gif", "pdf", "aac"];
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

      if (filePath === "/") return this.#record[id] = null;
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

  serve = async (port?: number, onListen?: ListenHandler) => {
    const [s] = await this.#build();
    if (s) return;
    this.#server = Deno.serve({
      port,
      handler: this.#handler,
      signal: this.#ac.signal,
      onListen,
    });
  };

  shutdown = () => {
    if (this.#server) {
      this.#server.finished.then(() => console.log("Server closed"));
      console.log("Closing server...");
      this.#ac.abort();
    }
  };

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
}
