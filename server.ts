import { serve, Server, ServerRequest } from "./deps.ts";
export type ListenOptions = { port: number; hostname?: string };
export interface Router { 
  method: string; 
  url: string; 
  handler(req: ServerRequest): void;
};
export { ServerRequest } from "./deps.ts"

export class Fastro {
  // definite assignment assertion
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html
  #server!: Server;
  #router: Router[] = [];

  close() {
    this.#server.close();
  }

  route(options: Router) {
    this.#router.push(options);
  }

  // private field
  // https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#ecmascript-private-fields
  #requestHandler = (req: ServerRequest) => {
    const filteredRoutes = this.#router.filter(function (value, index) {
      return (req.url === value.url && req.method == value.method);
    });
    if (filteredRoutes.length < 1)
      return req.respond({ body: `${req.url} not found`, status: 404})
    const [route] = filteredRoutes
    return route.handler(req)
  };

  async listen(options: ListenOptions) {
    this.#server = serve(options);
    // creates a loop iterating over async iterable objects
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
    for await (const req of this.#server) {
      this.#requestHandler(req);
    }
  }
}