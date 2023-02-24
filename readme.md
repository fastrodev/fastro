# Fastro

[![Build Status - Cirrus][]][Build status]
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https://deno.land/x/fastro/server/mod.ts)

<img align="right" src="https://avatars.githubusercontent.com/u/84224795" height="70px" alt="A dinosaur is looking back.">

Fast and simple web application framework for deno.

With
[deno near native performance](https://github.com/denosaurs/bench#overview), you
can:

- Manage your app and routing cleanly with
  [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern)
- Leverage existing Deno objects and methods such as
  [Request](https://deno.land/api?s=Request),
  [Headers](https://deno.land/api?s=Headers),
  [Cookie](https://deno.land/std/http/cookie.ts), and
  [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API)
- Access the request, the response, and the next callback before execute the
  route handler with
  [app middleware](https://github.com/fastrodev/fastro/blob/main/examples/middleware.ts)
- Manage your global object in
  [a container with auto-deleted data](https://github.com/fastrodev/fastro/blob/main/examples/container.ts)
- Get url param with URLPattern and set the react component props from the
  server side
- Attach your API and React-SSR-SEO-ready pages
  [in a single file](https://github.com/fastrodev/fastro/blob/main/examples/ssr.ts)

## Getting started

Create a `main.ts` file for deno-cli entry point.

```ts
import fastro from "https://deno.land/x/fastro/server/mod.ts";

const f = fastro();

f.get("/", () => "Hello, World!");

await f.serve();
```

Run the app

```
deno run -A --unstable main.ts
```

## Examples

Find one that fits your use case
[here](https://github.com/fastrodev/fastro/tree/main/examples)

[Build Status - Cirrus]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=main&event=push
[Build status]: https://github.com/fastrodev/fastro/actions
