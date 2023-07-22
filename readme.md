# Fastro

[![Build Status - Cirrus][]][Build status]
[![deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/fastro/mod.ts)
[![Coverage Status](https://coveralls.io/repos/github/fastrodev/fastro/badge.svg?branch=main)](https://coveralls.io/github/fastrodev/fastro?branch=main)

<img align="right" src="https://avatars.githubusercontent.com/u/84224795" height="70px">

Fast and simple web application framework for deno.

With
[deno near native performance](https://fastro.dev/benchmarks), you
can:

- Manage your app and routing cleanly with
  [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern)
- Leverage existing Deno objects and methods such as
  [Request](https://deno.land/api?s=Request),
  [Headers](https://deno.land/api?s=Headers),
  [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API)
- Access the request, the context, and the next callback before execute the
  route handler with
  [route and app middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)
- Get url param with URLPattern
- Set the react component props from the server side 
- Attach your API and React-SSR-SEO-ready pages [in a single file](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)

## Getting started

Create a `main.ts` file for deno-cli entry point.

```ts
import fastro from "https://deno.land/x/fastro/mod.ts";

const f = new fastro();

f.get("/", () => "Hello, World!");

await f.serve();
```

Run the app

```
deno run -A main.ts
```

## Examples

Find one that fits your use case
[here](https://github.com/fastrodev/fastro/tree/main/examples)

[Build Status - Cirrus]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=main&event=push
[Build status]: https://github.com/fastrodev/fastro/actions
