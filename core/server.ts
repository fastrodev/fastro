// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import { createError, getErrorTime } from "./utils.ts";
import type { ServerOptions, ListenOptions, MultiPartData } from "./types.ts";
import type { Request } from "./request.ts";
import type { Cookie } from "./cookie.ts";
import {
  serve,
  Server,
  ServerRequest,
  MultipartReader,
  decode,
  isFormFile,
} from "../deps.ts";

export const FASTRO_VERSION = "0.30.0";

export class Fastro {
  // deno-lint-ignore no-explicit-any
  private services = new Map<string, any>();
  private cwd!: string;
  private prefix!: string;
  private server!: Server;
  private serviceDir!: string;
  private corsEnabled!: boolean;
  private cookieList: Cookie[] = [];

  constructor(options?: ServerOptions) {
    if (options && options.prefix) this.prefix = options.prefix;
    if (options && options.serviceDir) this.serviceDir = options.serviceDir;
    if (options && options.cors) this.corsEnabled = options.cors;
    this.initService();
  }

  async initService() {
    this.cwd = Deno.cwd();
    this.serviceDir = this.serviceDir ? this.serviceDir : "services";
    this.importServiceFile(this.serviceDir);
  }

  private handleRoot(request: ServerRequest) {
    const res = {
      body: `Fastro v${FASTRO_VERSION}`,
      headers: new Headers(),
    };
    res.headers.set("Date", new Date().toUTCString());
    res.headers.set("Connection", "keep-alive");
    request.respond(res);
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
      if (this.corsEnabled) {
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Headers", "*");
        headers.set("Access-Control-Allow-Methods", "*");
      }
      if (this.cookieList.length > 0) {
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

  private getCookies(request: Request) {
    const cookies = request.headers.get("cookie")?.split(";");
    const results = cookies?.map((v) => {
      const [n, value] = v.split("=");
      const name = n.trim();
      return `${name}=${value}`;
    });
    return results;
  }

  private getCookiesByName(name: string, request: Request) {
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

  private clearCookie(name: string, request: Request) {
    let str = `${name}="";expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    request.headers.set("Set-Cookie", str);
  }

  private handleRedirect(url: string, status: number, request: Request) {
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
      throw createError("FORM_URL_ENCODED_HANDLER_ERROR", error);
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
        const form = await reader.readForm(1024 * 1024);
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
      throw createError("MULTIPART_HANDLER_ERROR", error);
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

  private async transformRequest(serverRequest: ServerRequest) {
    try {
      const request = <Request> serverRequest;
      request.getPayload = () => {
        return this.getPayload(request);
      };
      request.send = (payload, status, headers) => {
        this.send(payload, status, headers, serverRequest);
      };
      request.getCookies = () => this.getCookies(request);
      request.getCookie = (name) => this.getCookiesByName(name, request);
      request.clearCookie = (name) => this.clearCookie(name, request);
      request.setCookie = (cookie) => {
        this.cookieList.push(cookie);
        return request;
      };
      request.redirect = (url, status = 302) =>
        this.handleRedirect(url, status, request);
      request.getParams = () => this.getParams(serverRequest.url);
      return request;
    } catch (error) {
      const err = createError("TRANSFORM_REQUEST_ERROR", error);
      console.error(
        `ERROR: ${getErrorTime()}, url: ${serverRequest.url},`,
        err,
      );
    }
  }

  private async handleRequest(serverRequest: ServerRequest) {
    if (serverRequest.url === "/") return this.handleRoot(serverRequest);
    try {
      const request = await this.transformRequest(serverRequest);
      if (!request) throw new Error("Request Error");
      const handlerFile = this.services.get(request.url);
      if (!handlerFile) throw new Error("Not Found");
      if (
        handlerFile.methods && !handlerFile.methods.includes(request.method)
      ) {
        throw new Error("Not Found");
      }
      handlerFile.handler(request);
    } catch (error) {
      const err = createError("HANDLE_REQUEST_ERROR", error);
      serverRequest.respond({ status: 404, body: error.message });
      console.error(
        `ERROR: ${getErrorTime()}, url: ${serverRequest.url},`,
        err,
      );
    }
  }

  private async importServiceFile(target: string) {
    try {
      const servicesFolder = `${this.cwd}/${target}`;
      for await (const dirEntry of Deno.readDir(servicesFolder)) {
        if (dirEntry.isFile && dirEntry.name.includes(".ts")) {
          const filePath = servicesFolder + "/" + dirEntry.name;
          const [, splittedFilePath] = filePath.split(this.serviceDir);
          const [splittedWithDot] = splittedFilePath.split(".");
          const fileKey = this.prefix
            ? `/${this.prefix}${splittedWithDot}`
            : `${splittedWithDot}`;
          const fileImport = Deno.env.get("DENO_ENV") === ""
            ? `file:${filePath}#${new Date().getTime()}`
            : `file:${filePath}`;
          // deno-lint-ignore no-undef
          const service = await import(fileImport);
          this.services.set(fileKey, service);
        } else if (dirEntry.isDirectory) {
          this.importServiceFile(target + "/" + dirEntry.name);
        }
      }
    } catch (error) {
      throw createError("IMPORT_SERVICE_FILE_ERROR", error);
    }
  }

  public close() {
    if (this.server) {
      this.server.close();
    }
  }

  async listen(options?: ListenOptions) {
    try {
      const port = options && options.port ? options.port : 3000;
      const hostname = options && options.hostname
        ? options.hostname
        : "0.0.0.0";
      this.server = serve({ hostname, port });
      console.log(
        `HTTP webserver running.  Access it at:  http://localhost:${port}`,
      );
      for await (const request of this.server) {
        await this.handleRequest(request);
      }
    } catch (error) {
      const err = createError("LISTEN_ERROR", error);
      console.error(`ERROR: ${getErrorTime()}`, err);
    }
  }
}
