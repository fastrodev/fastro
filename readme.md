# Fastro

Fast and simple web application framework for deno.

With [near-native perfomance](https://deno.land/x/fastro@v0.58.0/benchmarks),
you can:

- Manage your routing, middlewares, and dependencies cleanly.
- Simplifies JSON, HTML, JSX, and [SSR initiation](https://fastro.dev/blog/ssr-simple-example-with-deno/).
- Take advantage of existing Deno objects and methods.

### Getting started

Create a `main.ts` file for deno-cli entry point.

```ts
import application from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

app.get("/", () => "Hello world");

console.log("Listening on: http://localhost:8000");

await app.serve();

```
Run the app
```
deno run -A main.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/hello_world.ts)

## More examples

- [Custom Port](#custom-port)
- [JSON Response](#json-response)
- [JSON with Native Response](#json-with-native-response)
- [JSON with Fastro Response](#json-with-fastro-response)
- [HTML with Native Response](#html-with-native-response)
- [HTML with Fastro Response](#html-with-fastro-response)
- [HTML with React JSX](#html-with-react-jsx)
- [HTML Render with Eta Template Engine](#html-render-with-eta-template-engine)
- [HTML Render with SSR](https://github.com/fastrodev/multipage-ssr-example)
- [Cookie with Native Response](#cookie-with-native-response)
- [Cookie with Fastro Response](#cookie-with-fastro-response)
- [Send custom HTTP Status, Content Type, and Authorization](#send-custom-http-status-content-type-and-authorization)
- [Routing](#routing)
- [Route Parameters](#route-parameters)
- [Router Middleware](#router-middleware)
- [Router Middleware with Array](#route-level-middleware-with-array)
- [Application Level Middleware](#application-level-middleware)
- [Application Level Middleware with Array](#application-level-middleware-with-array)
- [Route Level Middleware](#route-level-middleware)
- [Route Level Middleware with Array](#route-level-middleware-with-array)
- [SQLite and Dependency Injection](#sqlite-and-dependency-injection)

### Custom port

```ts
import application from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

app.get("/", () => new Response("Hello world!"));

await app.serve({ port: 3000 });

```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/custom_port.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/custom_port.ts)



### JSON Response

```ts
import application from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

const json = { text: "Hello world" };

app.get("/", () => json);

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/json_response_default.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/json_response_default.ts)

### JSON with Native Response

```ts
import application from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

app.get("/", () => {
  const json = { text: "Hello world" };
  return new Response(JSON.stringify(json), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/json_response_native.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/json_response_native.ts)

### JSON with Fastro Response

```ts
import application, { response } from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

app.get("/", () => {
  return response().json({ text: "Hello world" });
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/json_response_fastro.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/json_response_fastro.ts)

### HTML with Native Response

```ts
import application from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

app.get("/", () => {
  return new Response("<html> Hello world </html>", {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/html_response_native.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/html_response_native.ts)

### HTML with Fastro Response

```ts
import application, { response } from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

app.get("/", () => response().html("<h2>Hello world</h2"));

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/html_response_fastro.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/html_response_fastro.ts)

### HTML with React JSX

```tsx
import application from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

app.get("/", () => <h1>Hello world</h1>);

console.log("Listening on: http://localhost:8000");

await app.serve();
```

#### tsconfig: `deno.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "jsxImportSource": "https://esm.sh/react"
  }
}
```

```
deno run -A --config deno.json https://deno.land/x/fastro@v0.58.0/examples/html_response_jsx.tsx
```

### Send Custom HTTP Status, Content Type, and Authorization

```ts
import application, { response } from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

app.get("/", () => {
  return response()
    .contentType("application/json")
    .authorization("Basic YWxhZGRpbjpvcGVuc2VzYW1l")
    .status(200)
    .send(JSON.stringify({ message: "Hello world" }));
});

console.log("Listening on: http://localhost:8000");

await app.serve();

```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/response_status.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/response_status.ts)

### Cookie with Native Response

```ts
import {
  Cookie,
  deleteCookie,
  getCookies,
  setCookie,
} from "https://deno.land/std@0.133.0/http/cookie.ts"

import application from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";


const app = application();

app.get("/set", () => {
  const headers = new Headers();
  const cookie: Cookie = { name: "Space", value: "Cat" };
  setCookie(headers, cookie);

  return new Response(JSON.stringify(cookie), {
    headers,
  });
});

app.get("/delete", () => {
  const headers = new Headers();
  deleteCookie(headers, "Space");
  const cookies = getCookies(headers);

  return new Response(JSON.stringify(cookies), {
    headers,
  });
});

app.get("/check", (req: Request) => {
  const cookie = getCookies(req.headers);
  return new Response(JSON.stringify(cookie));
});

console.log("Listening on: http://localhost:8000");

await app.serve();

```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/cookies_native.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/cookies_native.ts)

### Cookie with Fastro Response

```ts
import application, {
  Cookie,
  getCookies,
  response,
} from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

app.get("/set", () => {
  const cookie: Cookie = { name: "Space", value: "Cat" };
  return response()
    .setCookie(cookie)
    .send(JSON.stringify(cookie));
});

app.get("/delete", () => {
  return response()
    .deleteCookie("Space")
    .send("Cookie deleted");
});

app.get("/check", (req: Request) => {
  const cookie = getCookies(req.headers);
  return response().send(JSON.stringify(cookie));
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/cookies_fastro.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/cookies_fastro.ts)

### HTML Render with Eta Template Engine

```ts
import application from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";import { render } from "https://deno.land/x/eta@1.12.3/mod.ts";
const app = application();

const headers = new Headers();
headers.set("Content-Type", "text/html; charset=UTF-8");

app.get("/", () => {
  const html = <string> render(
    "<h4>The answer to everything is <%= it.answer %></h4>",
    {
      answer: 42,
    },
  );

  return new Response(html, { headers });
});

console.log("Listening on: http://localhost:8000");

app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/html_render.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/html_render.ts)

### Routing

```ts
import application from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";
const app = application();

app.get("/abcd", () => new Response("/abcd"));

app.get("/ef?gh", () => new Response("/ef?gh"));

app.get("/ij+kl", () => new Response("/ij+kl"));

app.get("/mn*op", () => new Response("mn*op"));

app.get("/qr(st)?u", () => new Response("qr(st)?u"));

app.get(/v/, () => new Response("/v/"));

app.get(/.*fast$/, () => new Response("/.*fast$/"));

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/routing.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/routing.ts)

### Route parameters

```ts
import application, {
  getParam,
  getParams,
} from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";
const app = application();

app.get("/:id/user/:name", (req: Request) => {
  const params = getParams(req);
  return new Response(JSON.stringify({ params }));
});

app.get("/post/:id", (req: Request) => {
  const param = getParam("id", req);
  return new Response(param);
});

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/route_params.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/route_params.ts)

### Router Middleware

```ts
import application, {
  ConnInfo,
  Next,
  router,
} from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";
const app = application();
const r = router();
const middleware = (_req: Request, _connInfo: ConnInfo, next: Next) => {
  console.log("v2 - 1");
  next();
};

r.get("/", () => new Response("Get"))
  .post("/", () => new Response("Post"))
  .put("/", () => new Response("Put"))
  .delete("/", () => new Response("Delete"));

app.use("/v1", r);
app.use("/v2", middleware, r);

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/router_middleware.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/router_middleware.ts)

### Router Middleware with Array

```ts
import application, {
  ConnInfo,
  Next,
  router,
} from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";
const app = application();
const r = router();
const middlewares = [(_req: Request, _connInfo: ConnInfo, next: Next) => {
  console.log("v2 - 1");
  next();
}, (_req: Request, _connInfo: ConnInfo, next: Next) => {
  console.log("v2 - 2");
  next();
}];

r.get("/", () => new Response("Get"))
  .post("/", () => new Response("Post"))
  .put("/", () => new Response("Put"))
  .delete("/", () => new Response("Delete"));

app.use("/v1", r);
app.use("/v2", middlewares, r);

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/router_middleware_with_array.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/router_middleware_with_array.ts)

### Application Level Middleware

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";
const app = application();

app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #1");
  next();
});

app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #2");
  next();
});

app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #3");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #4");
  next();
});

app.get("/", () => new Response("App level #1"));

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/application_level_middleware.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/application_level_middleware.ts)

### Application Level Middleware with Array

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";
const app = application();

const middlewares = [(_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #2");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #3");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #4");
  next();
}];

app.use(middlewares);

app.get("/", () => new Response("App level #1"));

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/application_level_middleware_with_array.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/application_level_middleware_with_array.ts)

### Route Level Middleware

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

const middlewares = (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
};

app.get("/", middlewares, () => new Response("App level #1"));

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/route_level_middleware.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/route_level_middleware.ts)

### Route Level Middleware with Array

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";

const app = application();

const middlewares = [(_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #2");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #3");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #4");
  next();
}];

app.get("/mnop", middlewares, () => new Response("Route level middleware #3"));

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/route_level_middleware_with_array.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/route_level_middleware_with_array.ts)

### SQLite and Dependency Injection

```ts
import application, { dependency } from "https://deno.land/x/fastro@v0.58.0/server/mod.ts";
const app = application();
const db = new DB("test.db");

const deps = dependency();
deps.set("hello", () => "Hello world");
deps.set("db", db);
app.use(deps);

app.get("/", () => {
  type FunctionType = () => string;
  const fn = <FunctionType> app.getDeps("hello");
  return new Response(fn());
});

app.post("/name", () => {
  const db = <DB> app.getDeps("db");
  db.query(`CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT)`);

  const names = ["Peter Parker", "Clark Kent", "Bruce Wayne"];
  for (const name of names) {
    db.query("INSERT INTO people (name) VALUES (?)", [name]);
  }

  return new Response(JSON.stringify(names));
});

app.get("/name", () => {
  const db = <DB> app.getDeps("db");
  const res = db.query("SELECT name FROM people");
  return new Response(JSON.stringify(res));
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.58.0/examples/deps_injection.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.58.0/examples/deps_injection.ts)
