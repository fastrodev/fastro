// Copyright 2021 the Fastro author. All rights reserved. MIT license.
// deno-lint-ignore-file no-explicit-any

import {
  createError,
  getErrorTime,
  replaceAll,
  validateObject,
} from "./utils.ts";
import type { Request } from "./request.ts";
import type { Cookie } from "./cookie.ts";
import { Data, HandlerOptions, HttpMethod } from "./types.ts";
import {
  FASTRO_VERSION,
  HOSTNAME,
  MAX_MEMORY,
  MIDDLEWARE_DIR,
  NO_CONFIG,
  PAGE_DIR,
  PORT,
  RUNNING_TEXT,
  SERVICE_DIR,
  SERVICE_FILE,
  SRVC_TYPE_PAGE,
  SRVC_TYPE_SERVICE,
  STATIC_DIR,
  TEMPLATE_DIR,
  TEMPLATE_FILE,
  TIMEOUT,
} from "./constant.ts";
import type {
  DynamicService,
  MultiPartData,
  Query,
  Schema,
  ServerOptions,
} from "./types.ts";
import {
  decode,
  decodeBase64,
  green,
  isFormFile,
  MultipartReader,
  parseYml,
  red,
  serve,
  Server,
  ServerRequest,
  yellow,
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
  private appStatus!: string;
  private cookieList = new Map<string, Cookie>();
  private corsEnabled!: boolean;
  private cwd = Deno.cwd();
  private dynamicService: DynamicService[] = [];
  private hostname = HOSTNAME;
  private middlewares = new Map<string, any>();
  private pages = new Map<string, any>();
  private port = PORT;
  private prefix!: string;
  private server!: Server;
  private serviceDir = SERVICE_DIR;
  private staticDir = STATIC_DIR;
  private services = new Map<string, any>();
  private staticFiles = new Map<string, any>();
  private templateFiles = new Map<string, any>();

  constructor(options?: ServerOptions) {
    if (options && options.cors) this.corsEnabled = options.cors;
    if (options && options.hostname) this.hostname = options.hostname;
    if (options && options.prefix) this.prefix = options.prefix;
    if (options && options.port) this.port = options.port;
    if (options && options.serviceDir) this.serviceDir = options.serviceDir;
    if (options && options.staticDir) this.staticDir = options.staticDir;
    this.initApp();
  }

  private handleRoot(request: Request) {
    const index = this.staticFiles.get("/index.html");
    if (!index) return request.send(`Fastro v${FASTRO_VERSION}`);
    request.send(index);
  }

  private send<T>(
    payload: string | T,
    status: number | undefined = 200,
    headers: Headers | undefined = new Headers(),
    req: ServerRequest,
  ) {
    try {
      let body: string | Uint8Array | Deno.Reader | undefined;
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
      const date = new Date().toUTCString();
      headers.set("Connection", "keep-alive");
      headers.set("Date", date);
      headers.set("x-powered-by", this.appStatus);
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
      error.message = "SEND_ERROR: " + error.message;
      console.error(error);
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
    const cookie = this.cookieList.get(name);
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

      const data: Data[] = [];
      body.forEach((i: string) => {
        if (i.includes("=")) {
          const [key, value] = i.split("=");
          const decodedV = decodeURIComponent(value);
          const decodedK = decodeURIComponent(key);
          const obj: Data = {};
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
      error.message = "HANDLE_FORM_URL_ENCODED_ERROR: " + error.message;
      throw error;
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
      error.message = "HANDLE_MULTIPART_ERROR: " + error.message;
      throw error;
    }
  }

  private validateJsonPayload(payload: Data, url: string) {
    try {
      const service = this.services.get(url);
      if (
        service && service.validationSchema && service.validationSchema.body
      ) {
        const schema = service.validationSchema.body as Schema;
        validateObject(payload, schema);
      }
    } catch (error) {
      error.message = "VALIDATE_JSON_PAYLOAD_ERROR: " + error.message;
      throw error;
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
        const payloadString = decode(await Deno.readAll(requestServer.body));
        const payload = JSON.parse(payloadString);
        this.validateJsonPayload(payload, requestServer.url);
        return payload;
      } else {
        const payload = decode(await Deno.readAll(requestServer.body));
        return payload;
      }
    } catch (error) {
      error.message = "GET_PAYLOAD_ERROR: " + error.message;
      throw error;
    }
  }

  private validateParams(params: Data, url: string) {
    try {
      const [handler] = this.dynamicService.filter((val) => val.url === url);
      if (
        handler && handler.service.options.validationSchema &&
        handler.service.options.validationSchema.params
      ) {
        const schema = handler.service.options.validationSchema
          .params as Schema;
        validateObject(params, schema);
      }
    } catch (error) {
      error.message = "VALIDATE_PARAMS_ERROR: " + error.message;
      throw error;
    }
  }

  private getParams(incoming: string) {
    try {
      const incomingSplit = incoming.substr(1, incoming.length).split("/");
      const params: string[] = [];
      incomingSplit
        .map((path, idx) => {
          return { path, idx };
        })
        .forEach((value) => params.push(incomingSplit[value.idx]));
      this.validateParams(params, incoming);
      return params;
    } catch (error) {
      error.message = "GET_PARAMS_ERROR: " + error.message;
      throw error;
    }
  }

  private validateQuery(query: Data, url: string) {
    try {
      const [handler] = this.dynamicService.filter((val) =>
        url.includes(val.url)
      );
      if (
        handler && handler.service.options.validationSchema &&
        handler.service.options.validationSchema.params
      ) {
        const schema = handler.service.options.validationSchema
          .querystring as Schema;
        validateObject(query, schema);
      }
    } catch (error) {
      error.message = "VALIDATE_QUERY_ERROR: " + error.message;
      throw error;
    }
  }

  private getQuery(key?: string, url?: string) {
    try {
      if (!url) throw new Error("Url empty");
      const [, query] = url.split("?");
      if (!query) throw new Error("Query not found");
      const queryPair = query.split("&");
      const obj: Query = {};
      queryPair.forEach((q) => {
        const [key, value] = q.split("=");
        obj[key] = value;
      });
      this.validateQuery(obj, url);
      if (key) {
        const singleQuery: Query = {};
        singleQuery[key] = obj[key];
        return singleQuery;
      }
      return obj;
    } catch (error) {
      error.message = "GET_QUERY_ERROR: " + error.message;
      throw error;
    }
  }

  private async proxy(url: string, request: Request) {
    try {
      const resp = await fetch(url, {
        method: request.method,
      });
      request.send(new Uint8Array(await resp.arrayBuffer()));
    } catch (error) {
      error.message = "PROXY_ERROR: " + error.message;
      throw error;
    }
  }

  private view(template: string, options?: Data, request?: Request) {
    try {
      let html = this.templateFiles.get(template);
      if (html) {
        for (const key in options) {
          const value = options[key];
          html = replaceAll(html, `\${${key}}`, value);
        }
      }
      if (request) request.send(html);
    } catch (error) {
      error.message = "VIEW_ERROR" + error.message;
      throw error;
    }
  }

  private transformRequest(serverRequest: ServerRequest) {
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
      request.type = (contentType: string) => {
        request.contentType = contentType;
        return request;
      };
      request.status = (status: number) => {
        request.httpStatus = status;
        return request;
      };
      request.send = (payload, status, headers) => {
        status = request.httpStatus ? request.httpStatus : 200;
        if (request.contentType) {
          headers = new Headers();
          headers.set("content-type", request.contentType);
        }
        this.send(payload, status, headers, serverRequest);
      };
      return request;
    } catch (error) {
      error.message = "TRANSFORM_REQUEST_ERROR: " + error.message;
      console.error(
        `ERROR: ${getErrorTime()}, url: ${serverRequest.url},`,
        error,
      );
    }
  }

  private handleStaticFile(request: Request) {
    try {
      const url = request.url;
      const staticFile = this.staticFiles.get(url);
      if (!staticFile) throw new Error("not found");
      const header = new Headers();
      if (url.includes(".svg")) header.set("content-type", "image/svg+xml");
      else if (url.includes(".png")) header.set("content-type", "image/png");
      else if (url.includes(".jpeg")) header.set("content-type", "image/jpeg");
      else if (url.includes(".css")) header.set("content-type", "text/css");
      else if (url.includes(".html")) header.set("content-type", "text/html");
      else if (url.includes(".json")) {
        header.set("content-type", "application/json");
      } else if (url.includes("favicon.ico")) {
        header.set("content-type", "image/ico");
      }
      request.send(staticFile, 200, header);
    } catch (error) {
      throw createError("HANDLE_STATIC_FILE_ERROR", error);
    }
  }

  private handleDynamicParams(request: Request) {
    try {
      const [handlerFile] = this.dynamicService.filter((service) => {
        return request.url.includes(service.url);
      });
      if (!handlerFile) return this.handleStaticFile(request);
      const options: HandlerOptions = handlerFile.service.options
        ? handlerFile.service.options
        : undefined;
      if (
        options &&
        options.methods &&
        !options.methods.includes(request.method as HttpMethod)
      ) {
        throw new Error("not found");
      }
      if (
        options && options.validationSchema && options.validationSchema.headers
      ) {
        const schema = options.validationSchema.headers as Schema;
        this.validateHeaders(request.headers, schema);
      }
      handlerFile.service.handler(request);
    } catch (error) {
      throw createError("HANDLE_DYNAMIC_PARAMS_ERROR", error);
    }
  }

  private handleMiddleware(request: Request) {
    try {
      this.middlewares.forEach((middleware, key) => {
        if (
          middleware.options &&
          middleware.options.methods &&
          !middleware.options.methods.includes(request.method)
        ) {
          throw new Error("Middleware HTTP method not found");
        }

        if (
          middleware.options &&
          middleware.options.validationSchema
        ) {
          const schema = middleware.options.validationSchema.headers as Schema;
          this.validateHeaders(request.headers, schema);
        }

        middleware.handler(request, (err: Error) => {
          if (err) {
            if (!err.message) err.message = `Middleware error: ${key}`;
            throw err;
          }
          this.handleRoute(request);
        });
      });
    } catch (error) {
      throw createError("HANDLE_MIDDLEWARE_ERROR", error);
    }
  }

  private validateHeaders(headers: Headers, schema: Schema) {
    try {
      const target: Data = {};
      const { properties } = schema;
      for (const key in properties) target[key] = headers.get(key);
      validateObject(target, schema);
    } catch (error) {
      error.message = "VALIDATE_HEADERS_ERROR: " + error.message;
      throw error;
    }
  }

  private handleJSX(service: any): string {
    return service.default();
  }

  private handleRoute(request: Request) {
    let service;
    try {
      service = this.services.get(request.url);
      const options = service && service.options ? service.options : undefined;
      if (!service) return this.handleDynamicParams(request);
      if (
        options &&
        options.methods &&
        !options.methods.includes(request.method as HttpMethod)
      ) {
        throw new Error("not found");
      }
      if (
        options && options.validationSchema && options.validationSchema.headers
      ) {
        const schema = options.validationSchema.headers as Schema;
        this.validateHeaders(request.headers, schema);
      }
      service.handler(request);
    } catch (other) {
      if (!service) throw createError("HANDLE_ROUTE_ERROR", other);
      const jsxElement = this.handleJSX(service);
      request.send(jsxElement);
    }
  }

  private handleRequestError(error: Error, serverRequest: ServerRequest) {
    const err = createError("HANDLE_REQUEST_ERROR", error);
    let status = 500;
    if (error.message.includes("not found")) status = 404;
    if (error.message.includes("VALIDATE")) status = 400;
    const message = JSON.stringify({ error: true, message: error.message });
    const headers = new Headers();
    headers.set("content-type", "application/json");
    serverRequest.respond({ status, body: message, headers });
    console.error(
      `ERROR: ${getErrorTime()}, url: ${serverRequest.url},`,
      err,
    );
  }

  private handleRequest(serverRequest: ServerRequest) {
    try {
      const request = this.transformRequest(serverRequest);
      if (!request) throw new Error("request rrror");
      if (serverRequest.url === "/") return this.handleRoot(request);
      if (this.middlewares.size > 0) return this.handleMiddleware(request);
      this.handleRoute(request);
    } catch (error) {
      this.handleRequestError(error, serverRequest);
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
      console.info("Start with no html template");
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
    const result = extension.filter((ext) => file.includes(ext));
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
      if (Deno.env.get("DENO_ENV") !== "test") {
        console.info("Start with no static file");
      }
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
      if (Deno.env.get("DENO_ENV") !== "test") {
        console.info("Start with no middleware");
      }
    }
  }

  private async importPages(target: string) {
    await this.importFile(target, SRVC_TYPE_PAGE);
  }

  private async importServices(target: string) {
    await this.importFile(target, SRVC_TYPE_SERVICE);
  }

  private async importFile(target: string, importType: string) {
    try {
      const servicesFolder = `${this.cwd}/${target}`;
      for await (const dirEntry of Deno.readDir(servicesFolder)) {
        if (dirEntry.isDirectory) {
          this.importFile(target + "/" + dirEntry.name, importType);
        } else if (dirEntry.isFile && dirEntry.name.includes(SERVICE_FILE)) {
          const filePath = servicesFolder + "/" + dirEntry.name;
          const [, splittedFilePath] = filePath.split(this.serviceDir);
          const [splittedWithDot] = splittedFilePath.split(".");

          const finalPath = Deno.env.get("DENO_ENV") === "development"
            ? `file:${filePath}#${new Date().getTime()}`
            : `file:${filePath}`;

          const fileKey = this.prefix
            ? `/${this.prefix}${splittedWithDot}`
            : `${splittedWithDot}`;

          this.nativeImport(finalPath, fileKey, importType);
        }
      }
    } catch (error) {
      if (Deno.env.get("DENO_ENV") !== "test") {
        console.info("Start with no service");
      }
    }
  }

  private nativeImport(filePath: string, fileKey: string, importType: string) {
    import(filePath)
      .then((importedFile) => {
        const options = importedFile.options as HandlerOptions;

        fileKey = options && options.prefix
          ? `/${options.prefix}${fileKey}`
          : fileKey;

        if (options && options.params) {
          this.dynamicService.push(
            { url: fileKey, service: importedFile },
          );
        } else {
          if (importType === SRVC_TYPE_SERVICE) {
            this.services.set(fileKey, importedFile);
          }
          if (importType === SRVC_TYPE_PAGE) {
            this.pages.set(fileKey, importedFile);
          }
        }
      });
  }

  private getAppStatus() {
    const decoded = this.regid
      ? decodeBase64("cmVnaXN0ZXJlZA==")
      : decodeBase64("VU5SRUdJU1RFUkVE");
    const text = new TextDecoder().decode(decoded);
    const version = `Fastro/${FASTRO_VERSION} (${text})`;
    return version;
  }

  private async readConfig() {
    try {
      const configFile = await Deno.readTextFile("config.yml");
      const parsedConfig = parseYml(configFile);
      if (configFile && parsedConfig) {
        const { email, regid } = <{
          email: string;
          regid: string;
        }> parsedConfig;
        this.regid = regid;
        this.email = email;
      }
    } catch (error) {
      if (Deno.env.get("DENO_ENV") !== "test") {
        console.info(yellow(NO_CONFIG));
      }
    }
  }

  private regid!: string;
  private email!: string;
  initApp() {
    this.readConfig()
      .then(() => this.appStatus = this.getAppStatus())
      .then(() => this.importMiddleware(MIDDLEWARE_DIR))
      .then(() => this.importServices(this.serviceDir))
      .then(() => this.importPages(PAGE_DIR))
      .then(() => this.readStaticFiles(this.staticDir))
      .then(() => this.readHtmlTemplate(TEMPLATE_DIR))
      .then(() => this.listen());
  }

  /**
   * Close server
   * 
   *      server.close()
   */
  public close() {
    this.server.close();
  }

  private async listen() {
    try {
      if (Deno.env.get("DENO_ENV") !== "test") {
        const addr = `http://${this.hostname}:${this.port}`;
        const runningText = `${RUNNING_TEXT}: ${addr}`;
        if (!this.regid) {
          console.info(red(this.getAppStatus()));
          console.info(green(runningText));
        } else {
          console.info(green(this.getAppStatus()));
          console.info(green(runningText));
        }
      }
      this.server = serve({ hostname: this.hostname, port: this.port });
      for await (const request of this.server) {
        this.handleRequest(request);
      }
    } catch (error) {
      error.message = "LISTEN_ERROR: " + error.message;
      console.error(`ERROR: ${getErrorTime()}`, error);
    }
  }
}
