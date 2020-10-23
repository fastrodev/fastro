# Fastro API

## Fastro Instance
Create fastro instance to load all controller, middleware, template and static file.
```ts
const server = new Fastro(serverOptions?: ServerOptions);
```

## Fastro Methods
- `server.listen(listenOptions?: ListenOptions)`
- `server.close()`

## Request
`Request` is extended from [ServerRequest](https://doc.deno.land/https/deno.land/std@0.74.0/http/server.ts#ServerRequest).
```ts
import type { Request } from "https://raw.fastro.dev/master/mod.ts";
export const handler = (request: Request) => {
    request.send("setup complete");
};
```
## Request Methods
- `request.getPayload()`
- `request.setCookie(cookie: Cookie)`
- `request.getCookie(name: string)`
- `request.getCookies()`
- `request.clearCookie(name: string)`
- `request.getParams()`
- `request.getQuery()`
- `request.proxy(url: string)`
- `request.redirect(url: string)`
- `request.send<T>(payload: string | T, status?: number, header?: Headers)`
- `request.view(template: string)`


## What's next:
- [Readme](../readme.md)
- [Quickstart](quickstart.md)
- [Create a handler](handler.md)
- [Create a middleware](middleware.md)
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Publishing and Deployment](deployment.md)
- [Fastro API](api.md)