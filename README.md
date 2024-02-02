# Fastro
[![build](https://github.com/fastrodev/fastro/actions/workflows/build.yml/badge.svg)](https://github.com/fastrodev/fastro/actions/workflows/build.yml)
[![bench](https://github.com/fastrodev/fastro/actions/workflows/bench.yml/badge.svg)](https://github.com/fastrodev/fastro/actions/workflows/bench.yml)
[![deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/fastro/mod.ts)
[![Coverage Status](https://coveralls.io/repos/github/fastrodev/fastro/badge.svg?branch=main)](https://coveralls.io/github/fastrodev/fastro?branch=main)

<img align="right" src="https://avatars.githubusercontent.com/u/84224795" height="70px">

Fast and simple web application framework for deno.

With [deno near native performance](https://fastro.dev/docs/benchmarks), you can:

- Manage your app and routing cleanly with
  [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern)
- Leverage existing Deno objects and methods such as
  [Request](https://deno.land/api?s=Request),
  [Headers](https://deno.land/api?s=Headers),
  [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API)
- Access the request, the context, and the next callback before execute the handler with
  [app middleware](https://github.com/fastrodev/fastro/blob/main/examples/app_middleware.ts) and [route middleware](https://github.com/fastrodev/fastro/blob/main/examples/route_middleware.ts).
- You can add multiple middleware at once in one route.
- Get url param with URLPattern
- Set the preact component props from the server side

## Create your first end point

Create a `main.ts` file for deno-cli entry point.

```ts
import fastro from "https://fastro.deno.dev/mod.ts";

const f = new fastro();

f.get("/", () => "Hello, World!");

await f.serve();
```

Run the app

```
deno run -A main.ts
```

## Simple Examples

To find one that fits your use case, you can explore
[the examples page](https://github.com/fastrodev/fastro/tree/main/examples).

## SSR Example

And to create your first JSX SSR page, you can follow
[the start page step by step](https://fastro.deno.dev/docs/start).

## Contribution

Feel free to help us!

Here are some issues to improving.
- Logo
- Landing page
- Improve speed
- Unit tests
- Middlewares
- Use case examples
- App Templates
