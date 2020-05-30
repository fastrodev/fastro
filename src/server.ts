import { serve, Server, ServerRequest, decode } from "../deps.ts";

/**
 * Fastro class
 * 
 * 
 *      const server = new Fastro()
 */
export class Fastro {
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
   * Register plugin
   *        
   *        const plugin = function (fastro: Fastro, request: Request) {
   *           fastro.decorate((instance) => {
   *              instance.hello = "hello";
   *            });
   *           request.ok = "ok";
   *        };
   * 
   *       server.register(plugin)
   * @param plugin
   */
  register(plugin: Plugin) {
    this.#plugins.push(plugin);
    const req = new Request();
    return this
    // return this.loadPlugin(this, req);
  }

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
   * @param router Router
   * 
   **/
  route(router: Router) {
    try {
      const filteredRoutes = this.#router.filter((value) => {
        return this.checkUrl(router.url, value.url) &&
          router.method === value.method;
      });
      if (filteredRoutes.length > 0) {
        const [route] = filteredRoutes;
        const errStr = `Duplicate route: ${
          JSON.stringify(route)
        } already added.`;
        throw FastroError("SERVER_ROUTE_ERROR", new Error(errStr));
      }
      this.#router.push(router);
      return this;
    } catch (error) {
      throw FastroError("SERVER_ROUTE_ERROR", error);
    }
  }

  /**
   * 
   * @param url 
   * @param handler 
   */
  all(url: string, handler: Handler) {
    this.route({ method: "GET", url, handler });
    this.route({ method: "POST", url, handler });
    this.route({ method: "HEAD", url, handler });
    this.route({ method: "PATCH", url, handler });
    this.route({ method: "OPTIONS", url, handler });
    this.route({ method: "PUT", url, handler });
    this.route({ method: "DELETE", url, handler });
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
   *      const middleware = function (instance: Fastro) {
   *        instance.hello = function () {
   *          console.log("hello");
   *        };
   *      };
   *
   *      server.decorate(middleware);
   *      server.hello();
   * 
   * @param instance 
   */
  decorate(instance: { (instance: Fastro): void }) {
    instance(this);
    return this;
  }

  /**
   * Add plugin
   * 
   *      server.use((req) => {
   *        console.log(req.headers.get("token"));
   *      });
   * @param plugin
   */
  use(handler: Handler): Fastro;
  use(url: string, handler: Handler): Fastro;
  use(handlerOrUrl: string | Handler, handler?: Handler) {
    if (typeof handlerOrUrl !== "string") {
      this.#middlewares.push({ url: "/", handler: handlerOrUrl });
    }
    if (handler && (typeof handlerOrUrl === "string")) {
      this.#middlewares.push({ url: handlerOrUrl, handler });
    }
    return this;
  }

  private loadPlugin(fastro: Fastro, request: Request) {
    const [router] = this.#router
      .map((router, idx )=> {
        return { router, idx }
      })
      .filter(r=> {
        return r.router.url === request.url
      })

    this.#router.splice(router.idx, 1);
    this.#plugins.forEach((plugin) => {
      plugin(fastro, request);
    });
    return this;
  }

  private mutateRequest(req: Request) {
    const plugins = this.#middlewares.filter((p) => {
      if (p.url === "/") return p;
      return p.url && this.checkUrl(req.url, p.url);
    });
    let mutates = 0;
    let mutate = false;
    const [plugin] = plugins;
    plugins.forEach((p) => {
      mutate = p.handler(req, () => {});
      if (mutates > 0) {
        throw new Error(
          "`req.send()` has been called. It can only be run once in a request.",
        );
      }
      if (mutate) mutates++;
    });
    if (plugin.url) req.parameter = this.getParameter(req.url, plugin.url);
    this.routeHandler(req, mutate);
  }

  private requestHandler = async (req: ServerRequest) => {
    try {
      const request = req as Request;
      request.payload = decode(await Deno.readAll(req.body));
      request.send = (payload, status, headers): boolean => {
        return this.send(payload, status, headers, req);
      };
      if (this.#plugins.length > 0) this.loadPlugin(this, request);
      if (this.#middlewares.length > 0) this.mutateRequest(request);
      else this.routeHandler(request);
    } catch (error) {
      throw FastroError("SERVER_REQUEST_HANDLER_ERROR", error);
    }
  };

  private routeHandler = async (
    req: Request,
    mutate?: boolean,
  ) => {
    try {
      if (mutate) return;
      const [route] = this.#router.filter((value) => {
        return this.checkUrl(req.url, value.url) &&
          (req.method == value.method);
      });
      if (!route) {
        return req.respond({ body: `${req.url} not found`, status: 404 });
      }
      req.parameter = this.getParameter(req.url, route.url);
      return route.handler(req, () => {});
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

  [key: string]: any
  // definite assignment assertion
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html
  #server!: Server;
  #router: Router[] = [];
  #middlewares: Middleware[] = [];
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
  handler(req: Request, callback: Function): any;
}
interface ListenOptions {
  port: number;
  hostname?: string;
}
interface Middleware {
  url?: string;
  handler(req: Request, callback: Function): any;
}
interface Plugin {
  (fastro: Fastro, request: Request): any;
}
interface Handler {
  (req: Request, callback: Function): any;
}
interface Parameter {
  [key: string]: string;
}
function FastroError(title: string, error: Error) {
  error.name = title;
  return error;
}
