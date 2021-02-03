// Copyright 2021 the Fastro author. All rights reserved. MIT license.

import { Cookie, Cookies, Response, ServerRequest } from "../deps.ts";
// import type { Cookie } from "./cookie.ts";
import type { Query } from "./types.ts";

/**
 * Request Class. It is extended from [Deno ServerRequest](https://doc.deno.land/https/deno.land/std@0.75.0/http/server.ts#ServerRequest).
 *
 */
export class Request extends ServerRequest {
  response!: Response;
  contentType!: string;
  httpStatus!: number;
  /**
   * Set content type before send
   *
   *      request.type("text/html").send("hello");
   */
  type!: {
    (contentType: string): Request;
  };

  /**
   * Set HTTP Status
   *
   *      request.status(404).send("not found");
   */
  status!: {
    (httpStatus: number): Request;
  };
  /**
   * Get all cookies
   *
   *    const cookies = request.getCookies();
   */
  getCookies!: {
    (): Cookies;
  };
  /**
   * Get cookie by name
   *
   *    const cookie = request.getCookie("my-cookie");
   */
  getCookie!: {
    (name: string): string;
  };
  /**
   * Set cookie
   *
   *    import { Cookie } from "../mod.ts";
   *    const cookie: Cookie = { name: "hello", value: "pram" };
   *    request.setCookie(cookie);
   */
  setCookie!: {
    (cookie: Cookie): Request;
  };
  /**
   * Clear cookie by name
   *
   *      request.clearCookie("hello")
   */
  clearCookie!: {
    (name: string): void;
  };
  /**
   * Redirect to the specified url, the status code is optional (default to 302)
   *
   *      request.redirect("/", 302)
   */
  redirect!: {
    (url: string, status?: number): void;
  };
  /**
   *  Sends the payload to the user, could be a plain text, a buffer, JSON, stream, or an Error object.
   *
   *        request.send("hello");
   */
  send!: {
    <T>(payload: string | T, status?: number, headers?: Headers): void;
  };
  /**
   *  Sends json object.
   *
   *        request.send({ message: "hello" });
   */
  json!: {
    // deno-lint-ignore no-explicit-any
    (payload: any): void;
  };
  /**
   * Get url parameters
   *
   *
   *      const params = request.getParams();
   */
  getParams!: {
    (): string[];
  };
  /**
   * Get payload. Could be plain text, json, multipart, or url-encoded
   *
   *
   *      const payload = await request.getPayload();
   */
  getPayload!: {
    // deno-lint-ignore no-explicit-any
    (): Promise<any>;
  };

  /**
   * Get query
   *
   *      const query = await request.getQuery()
   */
  getQuery!: {
    (name?: string): Query;
  };

  /**
   * URL proxy
   *
   *      request.proxy("https://github.com/fastrodev/fastro");
   */
  proxy!: {
    (url: string): void;
  };

  /**
   * Render html template
   *
   *      request.view("index.template.html", { title: "Hello" });
   */
  view!: {
    // deno-lint-ignore no-explicit-any
    (template: string, options?: any): void;
  };
  // deno-lint-ignore no-explicit-any
  [key: string]: any
}
