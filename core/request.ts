// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import { ServerRequest } from "../deps.ts";
import type { Cookie } from "./cookie.ts";

/**
 * Request Class. It is extended from ServerRequest. One of Deno standart module.
 */
export class Request extends ServerRequest {
  /**
   * Get all cookies
   * 
   *    const cookies = request.getCookies();
   */
  getCookies!: {
    (): string[] | undefined;
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
   *    request.clearCookie("hello")
   */
  clearCookie!: {
    (name: string): void;
  };
  /**
   * Redirect to the specified url, the status code is optional (default to 302)
   * 
   *    request.redirect("/", 302)
   */
  redirect!: {
    (url: string, status?: number): void;
  };
  /**
   *  Sends the payload to the user, could be a plain text, a buffer, JSON, stream, or an Error object.
   * 
   *      request.send("hello");
   */
  send!: {
    <T>(payload: string | T, status?: number, headers?: Headers): void;
  };
  /**
   * Get url parameters
   * 
   * 
   *    const params = request.getParams();
   */
  getParams!: {
    (): string[];
  };
  /**
   * Get payload. Could be plain text, json, multipart, or url-encoded
   * 
   * 
   *    const payload = await request.getPayload();
   */
  getPayload!: {
    // deno-lint-ignore no-explicit-any
    (): Promise<any>;
  };
  // deno-lint-ignore no-explicit-any
  [key: string]: any
}
