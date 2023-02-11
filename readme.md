# Fastro

[![Build Status - Cirrus][]][Build status] [![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https://deno.land/x/fastro/server/mod.ts)

<img align="right" src="https://raw.githubusercontent.com/fastrodev/fastro.dev/main/images/fstr.svg" height="70px" alt="A dinosaur is looking back.">

Fast and simple web application framework for deno.

With [deno near-native perfomance](https://github.com/denosaurs/bench#overview),
you can:

- Take advantage of existing Deno objects and methods
- Manage your routing cleanly
- Simplifies JSX and [Multipage SSR Initiation](https://github.com/fastrodev/multipage-ssr-example)

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

[Build Status - Cirrus]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=main&event=push
[Build status]: https://github.com/fastrodev/fastro/actions