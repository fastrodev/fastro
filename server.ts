import { serve, Server, ServerRequest, decode } from "./deps.ts";

/**
 * Fastro class
 * 
 * 
 *      const server = new Fastro()
 */
export class Fastro {
  private checkUrl(incoming: string, registered: string): boolean {
    try {
      const incomingSplit = incoming.substr(1, incoming.length).split("/");
      const registeredSplit = registered.substr(1, registered.length).split(
        "/",
      );
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

  private getParameter(incoming: string, registered: string) {
    try {
      const incomingSplit = incoming.substr(1, incoming.length).split("/");
      const registeredSplit = registered.substr(1, registered.length).split(
        "/",
      );
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

  /**
   * Add plugin
   * 
   *      server.use((req) => {
   *        console.log(req.headers.get("token"));
   *      });
   * @param plugin
   */
  use(plugin: Plugin) {
    this.#plugins.push(plugin);
    return this;
  }

  private mutateRequest(req: Request, route: Router) {
    let mutate = false;
    let mutates = [];
    this.#plugins.forEach((plugin) => {
      const pluginResult = plugin(req, () => {});
      if (mutates.length > 1) {
        throw new Error(
          `request.send() already called ${mutates.length} times on registered plugins. You only can call request.send() once.`,
        );
      }
      if (pluginResult) {
        mutates.push(true);
        mutate = true;
      }
    });
    this.routeHandler(req, route, mutate);
    mutates.length = 0;
  }

  private requestHandler = async (req: ServerRequest) => {
    try {
      const request = req as Request;
      const [route] = this.#router.filter((value) => {
        return this.checkUrl(req.url, value.url) &&
          (req.method == value.method);
      });

      if (route) request.parameter = this.getParameter(req.url, route.url);
      request.payload = decode(await Deno.readAll(req.body));
      request.send = (payload, status, headers): boolean => {
        return this.send(payload, status, headers, req);
      };
      if (this.#plugins.length > 0) this.mutateRequest(request, route);
      else this.routeHandler(request, route);
    } catch (error) {
      throw FastroError("SERVER_REQUEST_HANDLER_ERROR", error);
    }
  };

  private routeHandler = async (
    req: Request,
    route?: Router,
    mutate?: boolean,
  ) => {
    try {
      if (mutate) return;
      if (!route) {
        return req.respond({ body: `${req.url} not found`, status: 404 });
      }
      return route.handler(req);
    } catch (error) {
      throw FastroError("SERVER_ROUTE_HANDLER_ERROR", error);
    }
  };

  private send<T>(
    payload: string | T,
    status: number | undefined = 200,
    headers: Headers | undefined = new Headers(),
    req: ServerRequest,
  ) {
    try {
      let body: any;
      headers.set("X-Powered-By", "fastro");
      if (typeof payload === "string") body = payload;
      else body = JSON.stringify(payload);
      req.respond({ status, headers, body });
      return true; // this is used for request mutation flag
    } catch (error) {
      throw FastroError("SERVER_SEND_ERROR", error);
    }
  }

  /** 
   * Listen 
   *      
   *      server.listen({ port: 8000 })
   **/
  listen = async (
    options?: ListenOptions,
    callback?: (error: Error | undefined, address: string | undefined) => void,
  ): Promise<void> => {
    try {
      let opt = options ? options : { port: 8080 };
      this.#server = serve(opt);
      if (!callback) console.info(opt);
      else callback(undefined, opt as any);
      // creates a loop iterating over async iterable objects
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
      for await (const req of this.#server) {
        await this.requestHandler(req);
      }
    } catch (error) {
      const errStr = "SERVER_LISTEN_ERROR";
      if (callback) callback(FastroError(errStr, error), undefined);
      else throw FastroError(errStr, error);
    }
  };

  /**
   * Add route
   * 
   *      server.route({
   *        url: "/hello",
   *        method: "GET",
   *        handler: (req) => {
   *          req.send("hello");
   *        },
   *       });
   * 
   * @param options
   * 
   **/
  route(options: Router) {
    try {
      const filteredRoutes = this.#router.filter((value) => {
        return this.checkUrl(options.url, value.url) &&
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
   * 
   *       server.get('/', (req) => req.send('hello'))
   * 
   * @param url 
   * @param handler 
   */
  get(url: string, handler: Handler) {
    return this.route({ method: "GET", url, handler });
  }

  /**
   * POST route shorthand declaration
   * 
   *       server.post('/', (req) => {
   *          const payload = req.payload;
   *          req.send(payload);
   *       })
   * 
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

  /**
   * Add new property or function to Fastro instance
   * 
   *    const middleware = function (instance: Fastro) {
   *      instance.hello = function () {
   *        console.log("hello");
   *      };
   *    };
   *
   *    server.decorate(middleware);
   *    server.hello();
   * 
   * @param instance 
   */
  decorate(instance: Middleware) {
    instance(this);
  }

  [key: string]: any
  // definite assignment assertion
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html
  #server!: Server;
  #router: Router[] = [];
  #plugins: Plugin[] = [];
}

export class Request extends ServerRequest {
  /** URL parameter */
  parameter!: Parameter;
  /** Payload */
  payload!: string;
  /**
   * Send payload
   *      
   *      // send basic message, default http status 200
   *      send('ok')
   * 
   *      // send json object
   *      send({ message: 'Hello' })
   * 
   *      // send message with custom http status
   *      send('not found', 404)
   * 
   *      // send message with custom status & headers
   *      const headers = new Headers()
   *      headers.set('Authorization', `Bearer ${your_token}`)
   *      send({ login: true }, 200, headers)
   * 
   * @param payload 
   * @param status
   * @param headers 
   *     
   */
  send!: {
    <T>(payload: string | T, status?: number, headers?: Headers): boolean;
  };
  [key: string]: any
}

interface Router {
  method: string;
  url: string;
  handler(req: Request): void;
}
interface ListenOptions {
  port: number;
  hostname?: string;
}
interface Plugin {
  (req: Request, callback: Function): any;
}
interface Handler {
  (req: Request): void;
}
interface Parameter {
  [key: string]: string;
}
interface Middleware {
  (instance: Fastro): void;
}
function FastroError(title: string, error: Error) {
  error.name = title;
  return error;
}
