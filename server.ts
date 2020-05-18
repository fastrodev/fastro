import { serve, Server, ServerRequest } from "./deps.ts";
export type ListenOptions = { port: number; hostname?: string };

export class FastroRequest extends ServerRequest {
  parameter!: {
    [key: string]: string;
  };
}
export interface Router {
  method: string;
  url: string;
  handler(req: FastroRequest): void;
}

export function FastroError(title: string, error: Error) {
  error.name = title;
  return error;
}

function getParameter(incoming: string, registered: string) {
  try {
    const incomingSplit = incoming.substr(1, incoming.length).split("/");
    const registeredSplit = registered.substr(1, registered.length).split("/");
    const obj: {
      [key: string]: string;
    } = {};

    registeredSplit
      .map((path, idx) => {
        return { path, idx };
      })
      .filter((value) => value.path.startsWith(":"))
      .map((value) => {
        const name = value.path.substr(1, value.path.length);
        obj[name] = incomingSplit[value.idx];
      });
    return obj;
  } catch (error) {
    throw FastroError("GET_URL_PARAMETER_ERROR", error);
  }
}

function checkUrl(incoming: string, registered: string): boolean {
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
  /**
   * private field
   * https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#ecmascript-private-fields
   */
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
      return route.handler(request);
    } catch (error) {
      throw FastroError("SERVER_REQUEST_HANDLER_ERROR", error);
    }
  };

  /** close server */
  async close(): Promise<void> {
    if (this.#server) {
      this.#server.close();
    }
  }

  /** Add route */
  route(options: Router) {
    try {
      const filteredRoutes = this.#router.filter(function (value) {
        return options.url === value.url && options.method === value.method;
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

  /** Callback */
  callback!: {
    (error: Error | undefined, address: Deno.Addr | undefined): void;
  };

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
  // definite assignment assertion
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html
  #server!: Server;
  #router: Router[] = [];
}
