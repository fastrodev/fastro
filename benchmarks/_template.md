![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)
# Fastro
Fast, simple, minimalist web framework for [Deno](https://deno.land/). 

Inspired by [Fastify](https://www.fastify.io/) & [Express](https://expressjs.com/).

```ts
import { Fastro } from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.get("/", (req) => req.send("root"));

await server.listen({ port: 8000 });

```

## How to use
These modules are tagged in accordance with Fastro releases. So, for example, the v0.1.0 tag is guaranteed to work with fastro v0.1.0. You can link to v0.1.0 using the URL [https://deno.land/x/fastro@v0.1.0/mod.ts](https://deno.land/x/fastro@v0.1.0/mod.ts). Not specifying a tag will link to the master branch.

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

> Inside plugin, you can not send any response.

## Add a hoook
For example you want to get a payload of all post method or want to get the url parameters of all get method or want to get headers of all types of requests -- instead of defining it in each handler, you can add a hook.

## Benchmarks
If performance is important to you, here are the benchmark results:

| Framework | Version | Router? | Avg Req |
| :-- | :-- | :--: | --: |
| Abc | ${abc_version} | &#10003; | ${abc} |
| Deno `http` | ${deno_version} | &#10007; | ${deno_http} |
| Express | ${express_version} | &#10003; | ${express} |
| Fastify | ${fastify_version} | &#10003; | ${fastify} |
| **Fastro** | **${fastro_version}** | **&#10003;** | **${fastro}**  |
| Node `http` | ${node_version} | &#10007; | ${node} |
| Oak | ${oak_version} | &#10007; | ${oak} |

Check this to see the detail method & results: [benckmarks](https://github.com/fastrojs/fastro-server/tree/master/benchmarks)

## Examples
You can see above basic example code here: [hello.ts](https://github.com/fastrojs/fastro-server/blob/master/examples/hello.ts)

Check the following codes to find out how to:
- [send simple text & json data](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L5)
- [handle url parameters](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L20)
- [set custom http headers & status](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L9)
- [handle http posts & get the payload](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L28)
- [add server listen optional callback](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L34)
- [plugin: compare parameter with local variable](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L5)
- [plugin: add new request function & property](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L23)
- [plugin: get client headers & custom send method](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L13)
- [plugin: create simple jwt auth](https://github.com/fastrojs/fastro-server/blob/master/examples/simple_jwt_auth.ts)
