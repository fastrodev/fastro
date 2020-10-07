// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import { createError, getErrorTime, replaceAll } from "./utils.ts";
import type { Request } from "./request.ts";
import type { Cookie } from "./cookie.ts";
import {
  FASTRO_VERSION,
  MAX_MEMORY,
  MIDDLEWARE_DIR,
  SERVICE_DIR,
  SERVICE_FILE,
  STATIC_DIR,
  TEMPLATE_DIR,
  TEMPLATE_FILE,
} from "./types.ts";
import type {
  DynamicService,
  ListenOptions,
  MultiPartData,
  Query,
  ServerOptions,
} from "./types.ts";
import {
  decode,
  isFormFile,
  MultipartReader,
  serve,
  Server,
  ServerRequest,
} from "../deps.ts";

/**
 * You have to create a `Fastro` class instance.
 * This will load all of your controller file  automatically.
 * 
 *      const server = new Fastro();
 * 
 * With server options, you can change default service folder, add prefix, or enable cors.
 *      
 *      const serverOptions = {
 *        cors: true,
 *        prefix: "api", 
 *        serviceDir: "api",
 *        staticFile: true,
 *      };
 *      const server = new Fastro(serverOptions);
 */
export class Fastro {
  private dynamicService: DynamicService[] = [];
  private cwd = Deno.cwd();
  private prefix!: string;
  private server!: Server;
  private serviceDir!: string;
  private corsEnabled!: boolean;
  private staticDir!: string;
  private cookieList = new Map<string, Cookie>();
  // deno-lint-ignore no-explicit-any
  private middlewares = new Map<string, any>();
  // deno-lint-ignore no-explicit-any
  private services = new Map<string, any>();
  // deno-lint-ignore no-explicit-any
  private staticFiles = new Map<string, any>();
  // deno-lint-ignore no-explicit-any
  private templateFiles = new Map<string, any>();

  constructor(options?: ServerOptions) {
    if (options && options.prefix) this.prefix = options.prefix;
    if (options && options.serviceDir) this.serviceDir = options.serviceDir;
    if (options && options.cors) this.corsEnabled = options.cors;
    if (options && options.staticDir) this.staticDir = options.staticDir;
    this.staticDir = this.staticDir ? this.staticDir : STATIC_DIR;
    this.serviceDir = this.serviceDir ? this.serviceDir : SERVICE_DIR;
    this.importMiddleware(MIDDLEWARE_DIR)
      .then(() => this.importServices(this.serviceDir))
      .then(() => this.readStaticFiles(this.staticDir))
      .then(() => this.readHtmlTemplate(TEMPLATE_DIR));
  }

  private handleRoot(request: Request) {
    if (this.staticFiles.size === 0) request.send("root");
    else {
      const index = this.staticFiles.get("/index.html");
      if (!index) return request.send("root");
      TEMPLATE_DIR;
      request.send(index);
    }
  }

  private send<T>(
    payload: string | T,
    status: number | undefined = 200,
    headers: Headers | undefined = new Headers(),
    req: ServerRequest,
  ) {
    try {
      // deno-lint-ignore no-explicit-any
      let body: any;
      if (
        typeof payload === "string" ||
        payload instanceof Uint8Array
      ) {
        body = payload;
      } else if (typeof payload === "undefined") body = "undefined";
      else if (Array.isArray(payload)) body = JSON.stringify(payload);
      else if (
        typeof payload === "number" ||
        typeof payload === "boolean" ||
        typeof payload === "bigint" ||
        typeof payload === "function" ||
        typeof payload === "symbol"
      ) {
        body = payload.toString();
      } else body = JSON.stringify(payload);
      headers.set("Connection", "keep-alive");
      headers.set("Date", new Date().toUTCString());
      headers.set("x-powered-by", "Fastro/" + FASTRO_VERSION);
      if (this.corsEnabled) {
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Headers", "*");
        headers.set("Access-Control-Allow-Methods", "*");
      }
      if (this.cookieList.size > 0) {
        this.cookieList.forEach((c) => {
          let str = `${c.name}=${c.value}`;
          const expire = c.expires ? `;expires=${c.expires}` : undefined;
          const domain = c.domain ? `;domain=${c.domain}` : undefined;
          const path = c.path ? `;path=${c.path}` : undefined;
          const secure = c.secure ? `;secure` : undefined;
          const httpOnly = c.HttpOnly ? `;HttpOnly=${c.HttpOnly}` : undefined;
          const sameSite = c.SameSite ? `;SameSite=${c.SameSite}` : undefined;

          if (expire) str = str.concat(expire);
          if (domain) str = str.concat(domain);
          if (path) str = str.concat(path);
          if (secure) str = str.concat(secure);
          if (httpOnly) str = str.concat(httpOnly);
          if (sameSite) str = str.concat(sameSite);

          str = str.concat(";");
          headers.set("Set-Cookie", str);
        });
      }
      req.respond({ body, status, headers });
    } catch (error) {
      throw createError("SEND_ERROR", error);
    }
  }

  private getCookies(request: ServerRequest) {
    const cookies = request.headers.get("cookie")?.split(";");
    const results = cookies?.map((v) => {
      const [n, value] = v.split("=");
      const name = n.trim();
      return `${name}=${value}`;
    });
    return results;
  }

  private getCookiesByName(name: string, request: ServerRequest) {
    const cookies = request.headers.get("cookie")?.split(";");
    const results = cookies?.map((v) => {
      const [n, value] = v.split("=");
      const name = n.trim();
      return { name, value };
    })
      .filter((c) => c.name === name);
    if (!results || results.length < 1) return "";
    const [c] = results;
    return c.value;
  }

  private clearCookie(name: string) {
    let cookie = this.cookieList.get(name);
    if (cookie) {
      cookie.expires = new Date("1970-01-01").toUTCString();
      cookie.value = "";
      this.cookieList.set(name, cookie);
    }
  }

  private handleRedirect(url: string, status: number, request: ServerRequest) {
    const headers = new Headers();
    headers.set("Location", url);
    request.respond({ status, headers });
  }

  private async handleFormUrlEncoded(req: ServerRequest, contentType: string) {
    try {
      const bodyString = decode(await Deno.readAll(req.body));
      const body = bodyString
        .replace(contentType, "")
        .split("&");

      // deno-lint-ignore no-explicit-any
      const data: any[] = [];
      body.forEach((i: string) => {
        if (i.includes("=")) {
          const [key, value] = i.split("=");
          const decodedV = decodeURIComponent(value);
          const decodedK = decodeURIComponent(key);
          // deno-lint-ignore no-explicit-any
          const obj: any = {};
          obj[decodedK] = decodedV;
          data.push(obj);
        } else {
          const obj = JSON.parse(i);
          data.push(obj);
        }
      });
      if (data.length > 1) return data;
      if (data.length === 1) {
        const [d] = data;
        return d;
      }
    } catch (error) {
      throw createError("HANDLE_FORM_URL_ENCODED_ERROR", error);
    }
  }

  private async handleMultipart(req: ServerRequest, contentType: string) {
    try {
      const boundaries = contentType?.match(/boundary=([^\s]+)/);
      let boundary;
      const multiPartArray: MultiPartData[] = [];
      if (boundaries && boundaries?.length > 0) [, boundary] = boundaries;
      if (boundary) {
        const reader = new MultipartReader(req.body, boundary);
        const form = await reader.readForm(MAX_MEMORY);
        const map = new Map(form.entries());
        map.forEach((v, key) => {
          const content = form.file(key);
          if (isFormFile(content)) {
            const v = decode(content.content);
            multiPartArray.push({ key, value: v, filename: content.filename });
          } else {
            multiPartArray.push({ key, value: v });
          }
        });
        await form.removeAll();
      }

      return multiPartArray;
    } catch (error) {
      throw createError("HANDLE_MULTIPART_ERROR", error);
    }
  }

  private async getPayload(requestServer: ServerRequest) {
    try {
      const contentType = requestServer.headers.get("content-type");
      if (contentType?.includes("multipart/form-data")) {
        return this.handleMultipart(requestServer, contentType);
      } else if (
        contentType?.includes("application/x-www-form-urlencoded")
      ) {
        return this.handleFormUrlEncoded(requestServer, contentType);
      } else if (
        contentType?.includes("application/json")
      ) {
        const payload = decode(await Deno.readAll(requestServer.body));
        return JSON.parse(payload);
      } else {
        const payload = decode(await Deno.readAll(requestServer.body));
        return payload;
      }
    } catch (error) {
      throw createError("GET_PAYLOAD_ERROR", error);
    }
  }

  private getParams(incoming: string) {
    let incomingSplit = incoming.substr(1, incoming.length).split("/");
    const params: string[] = [];
    incomingSplit
      .map((path, idx) => {
        return { path, idx };
      })
      .forEach((value) => params.push(incomingSplit[value.idx]));

    return params;
  }

  // deno-lint-ignore no-explicit-any
  private queryByName(key: string, queryList: any[]) {
    try {
      const [query] = queryList.filter((i) => i[key] !== undefined);
      return Promise.resolve(query as Query);
    } catch (error) {
      throw createError("QUERY_BY_NAME", error);
    }
  }

  private getQuery(key?: string, url?: string) {
    try {
      if (!url) throw createError("GET_QUERY_ERROR", new Error("Url empty"));
      const [, query] = url.split("?");
      if (!query) throw new Error("Query not found");
      const queryPair = query.split("&");
      const queryList: Query[] = [];
      queryPair.forEach((q) => {
        // deno-lint-ignore no-explicit-any
        const obj: any = {};
        const [key, value] = q.split("=");
        obj[key] = value;
        queryList.push(obj);
      });
      if (key) return this.queryByName(key, queryList);
      return Promise.resolve(queryList);
    } catch (error) {
      return Promise.resolve([]);
    }
  }

  private async proxy(url: string, request: Request) {
    try {
      const resp = await fetch(url, {
        method: request.method,
      });
      request.send(new Uint8Array(await resp.arrayBuffer()));
    } catch (error) {
      throw createError("PROXY_ERROR", error);
    }
  }

  // deno-lint-ignore no-explicit-any
  private async view(template: string, options?: any, request?: Request) {
    let html = this.templateFiles.get(template);
    for (const key in options) {
      const value = options[key];
      html = replaceAll(html, `{{${key}}}`, value);
    }
    if (request) request.send(html);
  }

  private async transformRequest(serverRequest: ServerRequest) {
    try {
      const request = serverRequest as Request;
      request.proxy = (url) => this.proxy(url, request);
      request.view = (template, options) =>
        this.view(template, options, request);
      request.redirect = (url, status = 302) =>
        this.handleRedirect(url, status, serverRequest);
      request.getQuery = (key) => this.getQuery(key, serverRequest.url);
      request.getParams = () => this.getParams(serverRequest.url);
      request.getPayload = () => this.getPayload(serverRequest);
      request.getCookies = () => this.getCookies(serverRequest);
      request.getCookie = (name) => this.getCookiesByName(name, serverRequest);
      request.clearCookie = (name) => this.clearCookie(name);
      request.setCookie = (cookie) => {
        this.cookieList.set(cookie.name, cookie);
        return request;
      };
      request.send = (payload, status, headers) => {
        this.send(payload, status, headers, serverRequest);
      };
      return request;
    } catch (error) {
      const err = createError("TRANSFORM_REQUEST_ERROR", error);
      console.error(
        `ERROR: ${getErrorTime()}, url: ${serverRequest.url},`,
        err,
      );
    }
  }

  private handleStaticFile(request: Request) {
    const url = request.url;
    const staticFile = this.staticFiles.get(url);
    const header = new Headers();
    if (url.includes(".svg")) header.set("content-type", "image/svg+xml");
    else if (url.includes(".png")) header.set("content-type", "image/png");
    else if (url.includes(".jpeg")) header.set("content-type", "image/jpeg");
    else if (url.includes(".css")) header.set("content-type", "text/css");
    else if (url.includes(".html")) header.set("content-type", "text/html");
    else if (url.includes(".json")) {
      header.set("content-type", "application/json ");
    } else if (url.includes("favicon.ico")) {
      header.set("content-type", "image/ico");
    }
    request.send(staticFile, 200, header);
  }

  private handleDynamicParams(request: Request) {
    const [serviceFile] = this.dynamicService.filter((service) => {
      return request.url.includes(service.url);
    });
    if (!serviceFile) return this.handleStaticFile(request);
    if (
      serviceFile.service.methods &&
      !serviceFile.service.methods.includes(request.method)
    ) {
      throw new Error("Not Found");
    }
    serviceFile.service.handler(request);
  }

  private handleMiddleware(request: Request) {
    this.middlewares.forEach((middleware, key) => {
      if (middleware.methods && !middleware.methods.includes(request.method)) {
        throw createError(
          "HANDLE_MIDDLEWARE_ERROR",
          new Error("Middleware HTTP method not found"),
        );
      }

      middleware.handler(request, (err: Error) => {
        if (err) {
          if (!err.message) err.message = `Middleware error: ${key}`;
          throw createError("HANDLE_MIDDLEWARE_ERROR", err);
        }
        this.handleRoute(request);
      });
    });
  }

  private handleRoute(request: Request) {
    const handlerFile = this.services.get(request.url);
    if (!handlerFile) return this.handleDynamicParams(request);
    if (
      handlerFile.methods && !handlerFile.methods.includes(request.method)
    ) {
      throw new Error("Not Found");
    }
    handlerFile.handler(request);
  }

  private async handleRequest(serverRequest: ServerRequest) {
    try {
      const request = await this.transformRequest(serverRequest);
      if (!request) throw new Error("Request Error");
      if (serverRequest.url === "/") return this.handleRoot(request);
      if (this.middlewares.size > 0) return this.handleMiddleware(request);
      this.handleRoute(request);
    } catch (error) {
      const err = createError("HANDLE_REQUEST_ERROR", error);
      serverRequest.respond({ status: 404, body: error.message });
      console.error(
        `ERROR: ${getErrorTime()}, url: ${serverRequest.url},`,
        err,
      );
    }
  }

  private async readHtmlTemplate(target: string) {
    try {
      const templateFolder = `${this.cwd}/${target}`;
      const decoder = new TextDecoder("utf-8");
      for await (const dirEntry of Deno.readDir(templateFolder)) {
        if (dirEntry.isFile && dirEntry.name.includes(TEMPLATE_FILE)) {
          const filePath = templateFolder + "/" + dirEntry.name;
          const file = await Deno.readFile(filePath);
          this.templateFiles.set(dirEntry.name, decoder.decode(file));
        } else if (dirEntry.isDirectory) {
          this.readHtmlTemplate(target + "/" + dirEntry.name);
        }
      }
    } catch (error) {
      console.error("HTML_TEMPLATE_NOT_FOUND", error);
    }
  }

  private isTxtFile(file: string) {
    const extension = [
      ".html",
      ".json",
      ".css",
      ".xml",
      ".txt",
      ".ts",
      ".js",
      ".md",
    ];
    const result = extension.filter((ext) => {
      return file.includes(ext);
    });

    return result.length > 0;
  }

  private async readStaticFiles(target: string) {
    try {
      const staticFolder = `${this.cwd}/${target}`;
      const decoder = new TextDecoder("utf-8");
      for await (const dirEntry of Deno.readDir(staticFolder)) {
        if (dirEntry.isFile) {
          const filePath = staticFolder + "/" + dirEntry.name;
          const [, fileKey] = filePath.split(staticFolder);
          const file = await Deno.readFile(filePath);
          if (this.isTxtFile(dirEntry.name)) {
            this.staticFiles.set(fileKey, decoder.decode(file));
          } else this.staticFiles.set(fileKey, file);
        } else if (dirEntry.isDirectory) {
          this.readStaticFiles(target + "/" + dirEntry.name);
        }
      }
    } catch (error) {
      console.error("STATIC_FILE_NOT_FOUND", error);
    }
  }

  private async importMiddleware(target: string) {
    try {
      const middlewareFolder = `${this.cwd}/${target}`;
      for await (const dirEntry of Deno.readDir(middlewareFolder)) {
        if (dirEntry.isFile) {
          const filePath = middlewareFolder + "/" + dirEntry.name;
          const fileImport = Deno.env.get("DENO_ENV") === "development"
            ? `file:${filePath}#${new Date().getTime()}`
            : `file:${filePath}`;
          import(fileImport).then((middleware) => {
            this.middlewares.set(dirEntry.name, middleware);
          });
        } else if (dirEntry.isDirectory) {
          this.importMiddleware(target + "/" + dirEntry.name);
        }
      }
    } catch (error) {
      console.error("IMPORT_MIDDLEWARE_ERROR", error);
    }
  }

  private async importServices(target: string) {
    try {
      const servicesFolder = `${this.cwd}/${target}`;
      for await (const dirEntry of Deno.readDir(servicesFolder)) {
        if (dirEntry.isFile && dirEntry.name.includes(SERVICE_FILE)) {
          const filePath = servicesFolder + "/" + dirEntry.name;
          const [, splittedFilePath] = filePath.split(this.serviceDir);
          const [splittedWithDot] = splittedFilePath.split(".");
          let fileKey = this.prefix
            ? `/${this.prefix}${splittedWithDot}`
            : `${splittedWithDot}`;
          const fileImport = Deno.env.get("DENO_ENV") === "development"
            ? `file:${filePath}#${new Date().getTime()}`
            : `file:${filePath}`;
          import(fileImport).then((service) => {
            fileKey = service.prefix ? `/${service.prefix}${fileKey}` : fileKey;
            if (service.params) {
              this.dynamicService.push({ url: fileKey, service });
            } else this.services.set(fileKey, service);
          });
        } else if (dirEntry.isDirectory) {
          this.importServices(target + "/" + dirEntry.name);
        }
      }
    } catch (error) {
      throw createError("IMPORT_SERVICES_ERROR", error);
    }
  }

  /**
   * Close server
   * 
   *      server.close()
   */
  public close() {
    if (this.server) {
      this.server.close();
    }
  }

  /**
   * Server listen
   * 
   *      server.listen();
   * 
   * With listen options:
   *      
   *      server.listen({ port: 8080, hostname: "0.0.0.0" });
   * 
   * With callback:
   * 
   *      new Fastro().listen({ port: 8080, hostname: "0.0.0.0" }, (err, addr) => {
   *        if (err) console.error(err);
   *        console.log("HTTP webserver running. Access it at:", addr);
   *      });
   * 
   * @param options ListenOptions
   * 
   */
  public async listen(
    options?: ListenOptions,
    callback?: (error: Error | undefined, address: string | undefined) => void,
  ) {
    try {
      const port = options && options.port ? options.port : 3000;
      const hostname = options && options.hostname
        ? options.hostname
        : "0.0.0.0";
      this.server = serve({ hostname, port });
      if (!callback) {
        if (Deno.env.get("DENO_ENV") !== "test") {
          const addr = `http://${hostname}:${port}`;
          console.log(`HTTP webserver running. Access it at: ${addr}`);
        }
      } // deno-lint-ignore no-explicit-any
      else callback(undefined, options as any);
      for await (const request of this.server) {
        await this.handleRequest(request);
      }
    } catch (error) {
      const err = createError("LISTEN_ERROR", error);
      console.error(`ERROR: ${getErrorTime()}`, err);
    }
  }
}
