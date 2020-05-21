![ci](https://github.com/fastrojs/fastro-server/workflows/ci/badge.svg)
# Fastro
Fast, simple, minimalist web framework for [deno](https://deno.land/).

```ts
import { Fastro } from "https://deno.land/x/fastro/mod.ts";

const server = new Fastro();

server.get("/", (req) => req.send("root"));

await server.listen({ port: 8000 });

```

## How to use
These modules are tagged in accordance with Fastro releases. So, for example, the v0.1.0 tag is guaranteed to work with fastro v0.1.0. You can link to v0.1.0 using the URL [https://deno.land/x/fastro@v0.1.0/mod.ts](https://deno.land/x/fastro@v0.1.0/mod.ts). Not specifying a tag will link to the master branch.

## Available route shorthand declaration 
- `server.get(url, handler)`
- `server.post(url, handler)`
- `server.put(url, handler)`
- `server.head(url, handler)`
- `server.delete(url, handler)`
- `server.options(url, handler)`
- `server.patch(url, handler)`

## Create a plugin
For example you want to get a payload of all post method or want to get the url parameters of all get method or want to get headers of all types of requests --
instead of defining it in each handler, you can make a plugin.

```ts
function plugin(req: FastroRequest) {
  console.log(req.parameter);
}
server.use(plugin)
```

## Benchmarks
If performance is important to you, here are the benchmark results:

| Framework          | Version      | Router?      | Average Req (1) |  Average Req (2) | Average Req (3)| Average Req (4)|
| :----------------- | :----------- | :----------: | --------------: | --------------:  | --------------:| ---------------:
| Abc                | 1.0.0-rc6    | &#10003;     | 1693            | 1591.4           | 2118.1         | 1593.4         |
| Deno_http          | 0.52.0	      | &#10007;     | 1887.6          | 1644.8           | 2159.31        | 1751.7         |
| Express            | 4.17         | &#10003;     | 1642.4          | 1618             | 1771.8         | 1638.7         |
| Fastify            | 2.14.1       | &#10003;     | 1833.1          | 1703.3           | 2267           | 1850           |
| **Fastro**         | **0.2.8**    | **&#10003;** | **1916.5**      | **1564.4**       | **2132.5**     | **1819.3**     |
| Oak                | 4.0.0        | &#10007;     | 1637.4          | 1516.7           | 2037.3         | 1707.5         |

Check this to see [the method](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/readme.md) and [benchmark code](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/benchmark.js).

## Examples
You can see above basic example code here: [hello.ts](https://github.com/fastrojs/fastro-server/blob/master/examples/hello.ts)

Check the following codes to find out how to:
- [send simple text & json data](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L5)
- [handle url parameters](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L20)
- [set custom http headers & status](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L9)
- [handle http posts & get the payload](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L28)
- [add optional callback](https://github.com/fastrojs/fastro-server/blob/master/examples/main.ts#L34)
- [plugin: compare parameter with local variable](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L5)
- [plugin: add new request function & property](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L23)
- [plugin: get client headers & custom send method](https://github.com/fastrojs/fastro-server/blob/master/examples/use_plugin.ts#L13)
