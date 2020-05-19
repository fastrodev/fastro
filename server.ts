import { serve, Server, ServerRequest } from "./deps.ts";
import { decode } from "./deps.ts";

export type ListenOptions = { port: number; hostname?: string };
export interface Handler {
  (req: FastroRequest): void;
}
export type Parameter = {
  [key: string]: string;
};
export class FastroRequest extends ServerRequest {
  /** URL parameter */
  parameter!: Parameter;
  /** Payload */
  payload!: string;
  /**
   * Send payload
   * @param payload 
   * @param status
   * @param headers 
   * 
   * 
   * Example:
   *      
   *      // send basic message
   *      // default http status 200
   *      send('ok')
   * 
   *      // send json object
   *      send({ message: 'Hello' })
   * 
   *      // send message with http status
   *      send('not found', 404)
   * 
   *      // send message with custom status & headers
   *      const headers = new Headers()
   *      headers.set('Authorization', `Bearer ${your_token}`)
   *      send({ login: true }, 200, headers)
   *     
   */
  send!: {
    <T>(payload: string | T, status?: number, headers?: Headers): void;
  };
}
export interface RouterInterface {
  method: string;
  url: string;
  handler(req: FastroRequest): void;
}

export function FastroError(title: string, error: Error) {
  error.name = title;
  return error;
}

export function getParameter(incoming: string, registered: string) {
  try {
    const incomingSplit = incoming.substr(1, incoming.length).split("/");
    const registeredSplit = registered.substr(1, registered.length).split("/");
    const param: Parameter = {};
    registeredSplit
      .map((path, idx) => {
        return { path, idx };
      })
      .filter((value) => value.path.startsWith(":"))
      .map((value) => {
        const name = value.path.substr(1, value.path.length);
        param[name] = incomingSplit[value.idx];
      });
    return param;
  } catch (error) {
    throw FastroError("GET_URL_PARAMETER_ERROR", error);
  }
}

export function checkUrl(incoming: string, registered: string): boolean {
  try {
    const incomingSplit = incoming.substr(1, incoming.length).split("/");
    const registeredSplit = registered.substr(1, registered.length).split("/");
    const filtered = registeredSplit
      .filter((value, idx) => {
        if (value.startsWith(":")) return incomingSplit[idx];
        return value === incomingSplit[idx];
      });
    return incomingSplit.length === filtered.length;
  } catch (error) {
    throw FastroError("CHECK_URL_ERROR", error);
  }
}

export class Fastro {
  private send<T>(
    payload: string | number | boolean | T,
    status: number | undefined = 200,
    headers: Headers | undefined = new Headers(),
    req: ServerRequest,
  ) {
    try {
      let body: any;
      headers.set("X-Powered-By", "fastro");
      if (
        typeof payload === "string" ||
        typeof payload === "number" ||
        typeof payload === "boolean"
      ) {
        body = payload;
        headers.set("Content-Type", "text/html; charset=UTF-8");
      } else {
        body = JSON.stringify(payload);
        headers.set("Content-Type", "application/json");
      }
      req.respond({ status, headers, body });
    } catch (error) {
      throw FastroError("SERVER_SEND_ERROR", error);
    }
  }

  #requestHandler = async (req: ServerRequest) => {
    try {
      const filteredRoutes = this.#router
        .filter(function (value) {
          return checkUrl(req.url, value.url) && (req.method == value.method);
        });
      if (filteredRoutes.length < 1) {
        return req.respond({ body: `${req.url} not found`, status: 404 });
      }
      const [route] = filteredRoutes;
      const request = req as FastroRequest;
      request.parameter = getParameter(req.url, route.url);
      request.payload = decode(await Deno.readAll(req.body));
      request.send = (payload, status, headers) =>
        this.send(payload, status, headers, req);
      return route.handler(request);
    } catch (error) {
      throw FastroError("SERVER_REQUEST_HANDLER_ERROR", error);
    }
  };

  /** Listen */
  listen = async (
    options?: ListenOptions,
    callback?: (error: Error | undefined, address: string | undefined) => void,
  ): Promise<void> => {
    try {
      let opt = options ? options : { port: 8000 };
      this.#server = serve(opt);
      if (!callback) console.info(options);
      else callback(undefined, opt as any);
      // creates a loop iterating over async iterable objects
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
      for await (const req of this.#server) {
        await this.#requestHandler(req);
      }
    } catch (error) {
      const errStr = "SERVER_LISTEN_ERROR";
      if (!callback) console.error(errStr, options);
      else callback(FastroError(errStr, error), undefined);
    }
  };

  /** Add route */
  route(options: RouterInterface) {
    try {
      const filteredRoutes = this.#router.filter(function (value) {
        return checkUrl(options.url, value.url) &&
          options.method === value.method;
      });
      if (filteredRoutes.length > 0) {
        const [route] = filteredRoutes;
        const errStr = `Duplicate route: ${
          JSON.stringify(route)
        } already added.`;
        throw FastroError("SERVER_ROUTE_ERROR", new Error(errStr));
      }
      this.#router.push(options);
      return this;
    } catch (error) {
      throw FastroError("SERVER_ROUTE_ERROR", error);
    }
  }

  /**
   * GET route shorthand declaration
   * @param url 
   * @param handler 
   */
  get(url: string, handler: Handler) {
    return this.route({ method: "GET", url, handler });
  }

  /**
   * POST route shorthand declaration
   * @param url 
   * @param handler 
   */
  post(url: string, handler: Handler) {
    return this.route({ method: "POST", url, handler });
  }

  /**
   * HEAD route shorthand declaration
   * @param url 
   * @param handler 
   */
  head(url: string, handler: Handler) {
    return this.route({ method: "HEAD", url, handler });
  }

  /**
   * PATCH route shorthand declaration
   * @param url 
   * @param handler 
   */
  patch(url: string, handler: Handler) {
    return this.route({ method: "PATCH", url, handler });
  }

  /**
   * PUT route shorthand declaration
   * @param url 
   * @param handler 
   */
  put(url: string, handler: Handler) {
    return this.route({ method: "PUT", url, handler });
  }

  /**
   * OPTIONS route shorthand declaration
   * @param url 
   * @param handler 
   */
  options(url: string, handler: Handler) {
    return this.route({ method: "OPTIONS", url, handler });
  }

  /**
   * DELETE shorthand declaration
   * @param url 
   * @param handler 
   */
  delete(url: string, handler: Handler) {
    return this.route({ method: "DELETE", url, handler });
  }

  /** Close server */
  async close(): Promise<void> {
    if (this.#server) {
      this.#server.close();
    }
  }
  // definite assignment assertion
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html
  #server!: Server;
  #router: RouterInterface[] = [];
}
