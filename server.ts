import { serve, Server, ServerRequest } from "./deps.ts";
import { decode } from "./deps.ts";

export type ListenOptions = { port: number; hostname?: string };
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
   * 
   * Example:
   *      
   *      // send basic message
   *      send('ok')
   *      // send message with http status
   *      send('not found', 404)
   *      // send json object
   *      send({ message: 'Hello' })
   */
  send!: {
    <T>(payload: string | T, status?: number): void;
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
    payload: string | T,
    status: number | undefined = 200,
    req: ServerRequest,
  ) {
    try {
      const headers = new Headers();
      let body: any;
      if (typeof payload === "string") body = payload;
      else {
        body = JSON.stringify(payload);
        headers.set("Content-Type", "application/json");
      }
      headers.set("X-Powered-By", "fastro");
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
      request.send = (payload, status) => this.send(payload, status, req);
      return route.handler(request);
    } catch (error) {
      throw FastroError("SERVER_REQUEST_HANDLER_ERROR", error);
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

  /** Listen */
  listen = async (options?: ListenOptions): Promise<void> => {
    try {
      if (!options) this.#server = serve({ port: 8000 });
      else this.#server = serve(options);
      if (this.callback) this.callback(undefined, this.#server.listener.addr);
      // creates a loop iterating over async iterable objects
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
      for await (const req of this.#server) {
        await this.#requestHandler(req);
      }
    } catch (error) {
      throw FastroError("SERVER_LISTEN_ERROR", error);
    }
  };

  /** Callback */
  callback!: {
    (error: Error | undefined, address: Deno.Addr | undefined): void;
  };

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
