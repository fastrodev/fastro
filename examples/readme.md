## Examples

```ts
import { Fastro } from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.get("/", (req) => req.send("root"));

await server.listen();

```

You can see above basic example code here: [hello.ts](https://github.com/fastrojs/fastro-server/blob/master/examples/hello.ts)

Check the following codes to find out how to:
- [send simple text & json data](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L5)
- [handle url parameters](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L20)
- [set custom http headers & status](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L9)
- [handle http posts & get the payload](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L28)
- [add server listen optional callback](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L34)

## Create a plugin
You can add new properties or functions to the default `request`. This feature is similar to the [`fastify decorator`](https://www.fastify.io/docs/latest/Decorators/). For example, you want to add a new function that changes the default status and header:

```ts
const plugin = (req: FastroRequest) => {
  req.sendOk = (payload: string) => {
    const headers = new Headers();
    headers.set("X-token", "your_token");
    return req.send(payload, 200, headers);
  };
}

server
  .use(plugin)
  .get("/:hello", (req) => req.sendOk("hello"))

```

Check the following codes to find out how to:
- [compare parameter with local variable](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L5)
- [add new request function & property](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L23)
- [get client headers & custom send method](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L13)
- [create simple jwt auth](https://github.com/fastrojs/fastro-server/blob/master/examples/simple_jwt_auth.ts)