// deno-lint-ignore-file no-explicit-any
import { VNode } from "preact";
import { contentType, extname, STATUS_CODE, STATUS_TEXT } from "./deps.ts";
import { Render } from "./render.tsx";
import { Fastro, Handler, ListenHandler, Page, Static } from "./types.ts";
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

export default class Server implements Fastro {
  constructor() {
    this.#handler = this.#createHandler();
  }
  get(path: string, handler: Handler): Fastro {
    return this.add("GET", path, handler);
  }
  post(path: string, handler: Handler): Fastro {
    return this.add("POST", path, handler);
  }
  put(path: string, handler: Handler): Fastro {
    return this.add("PUT", path, handler);
  }
  patch(path: string, handler: Handler): Fastro {
    return this.add("PATCH", path, handler);
  }
  delete(path: string, handler: Handler): Fastro {
    return this.add("DELETE", path, handler);
  }
  options(path: string, handler: Handler): Fastro {
    return this.add("OPTIONS", path, handler);
  }
  head(path: string, handler: Handler): Fastro {
    return this.add("HEAD", path, handler);
  }
  page<T>(path: string, page: Page<T>): Fastro {
    return this.#addPage(path, page);
  }
  static(
    path: string,
    options?: { maxAge?: number; folder?: string; referer?: boolean },
  ) {
    this.#staticUrl = path;
    if (options?.folder) this.#staticFolder = options?.folder;
    // if (options?.referer) this.#staticReferer = options.referer;
    // if (options?.maxAge) this.#maxAge = options.maxAge;
    return this;
  }

  #addPage = <T>(path: string, page: Page<T>) => {
    const key = path;
    this.#routePage[key] = page;
    return this;
  };

  add = (method: string, path: string, handler: Handler) => {
    const key = method + "-" + path;
    this.#routeHandler[key] = handler;
    return this;
  };

  #getPath = (key: string) => {
    if (key.includes(":")) {
      const [path] = key.split(":");
      return path;
    }
    return key;
  };

  #build = async () => {
    // deno-lint-ignore no-deprecated-deno-api
    if (Deno.run === undefined) return [];
    for (const [_key, page] of Object.entries(this.#routePage)) {
      await this.#createHydrate(page);
      await this.#buildPageComponent(page);
    }
    return Deno.args.filter((v) => v === "--hydrate");
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
      // const ref = checkReferer(req);
      // if (ref && this.#staticReferer) return ref;
      return new Response(s.file, {
        headers: {
          "Content-Type": s.contentType,
          "Cache-Control": `max-age=${this.#maxAge}`,
        },
      });
    }

    return new Response(STATUS_TEXT[STATUS_CODE.NotFound], {
      status: STATUS_CODE.NotFound,
    });
  };

  #handlePage = (req: Request, info: Deno.ServeHandlerInfo) => {
    const url = new URL(req.url);
    const key = url.pathname;
    let page = this.#routePage[key];
    let params: Record<string, string | undefined> | undefined = undefined;
    if (!page) {
      const res = this.#getParamsPage(req, this.#routePage);
      if (!res) return this.#handleStaticFile(req);
      const [pg, prm] = res;
      page = pg;
      params = prm;
    }

    const r = new Render(this);
    return page.handler(req, {
      render: (data: any) => r.render(key, page, data),
      info: info,
      params,
    });
  };

  #createHandler = () => {
    return (req: Request, info: Deno.ServeHandlerInfo) => {
      try {
        const id = req.method + req.url;
        if (this.#record[id]) {
          const [handler, ctx] = this.#record[id];
          return handler(req, ctx);
        }
        const r = new Render(this);
        const ctx = {
          params: undefined as Record<string, string | undefined> | undefined,
          info,
          render: <T>(jsx: T) => {
            return r.renderJsx(jsx as VNode);
          },
        };

        const url = new URL(req.url);
        const key = req.method + "-" + url.pathname;
        let handler = this.#routeHandler[key];
        let params: Record<string, string | undefined> | undefined;
        if (!handler) {
          const res = this.#getParamsHandler(req, this.#routeHandler);
          if (!res) return this.#handlePage(req, info);
          const [h, p] = res;
          handler = h;
          params = p;
        }

        ctx.params = params;
        ctx.info = info;
        this.#record[id] = [handler, ctx];
        return handler(req, ctx);
      } catch (error) {
        const msg = error.message as string;
        if (msg.includes(STATUS_TEXT[STATUS_CODE.NotFound])) {
          return new Response(STATUS_TEXT[STATUS_CODE.NotFound], {
            status: STATUS_CODE.NotFound,
          });
        }
        return new Response(STATUS_TEXT[STATUS_CODE.InternalServerError], {
          status: STATUS_CODE.InternalServerError,
        });
      }
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
  #staticFolder = "";
  #staticUrl = "";
  #maxAge = 0;
}
