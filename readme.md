# Fastro

Fast and simple web application framework for deno.

<img align="right" src="https://raw.githubusercontent.com/fastrodev/fastro.dev/main/images/fstr.svg" height="150px" alt="the deno mascot dinosaur standing in the rain">

With [near-native perfomance](https://github.com/fastrodev/fastro/tree/main/benchmarks),
you can:

- Manage your routing, middlewares, and dependencies cleanly.
- Take advantage of existing Deno objects and methods.
- [Simplifies JSX](#html-render-with-react-jsx) and [Multipage SSR Initiation](https://github.com/fastrodev/multipage-ssr-example).

### Getting started

Create a `main.ts` file for deno-cli entry point.

```ts
import application from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

const app = application();

app.get("/", () => "Hello world");

console.log("Listening on: http://localhost:8000");

await app.serve();

```
Run the app
```
deno run -A main.ts
```

## More examples

- [HTML Render with React JSX](#html-render-with-react-jsx)
- [HTML Render with React SSR](https://github.com/fastrodev/multipage-ssr-example)
- [HTML with Native Response](#html-with-native-response)
- [HTML with Fastro Response](#html-with-fastro-response)
- [HTML Render with Eta Template Engine](#html-render-with-eta-template-engine)
- [JSON Response](#json-response)
- [JSON with Native Response](#json-with-native-response)
- [JSON with Fastro Response](#json-with-fastro-response)
- [Cookie with Native Response](#cookie-with-native-response)
- [Cookie with Fastro Response](#cookie-with-fastro-response)
- [Send custom HTTP Status, Content Type, and Authorization](#send-custom-http-status-content-type-and-authorization)
- [Routing](#routing)
- [Route Parameters](#route-parameters)
- [Route Query](#route-query)
- [Router Middleware](#router-middleware)
- [Router Middleware with Array](#route-level-middleware-with-array)
- [Application Level Middleware](#application-level-middleware)
- [Application Level Middleware with Array](#application-level-middleware-with-array)
- [Route Level Middleware](#route-level-middleware)
- [Route Level Middleware with Array](#route-level-middleware-with-array)
- [SQLite and Dependency Injection](#sqlite-and-dependency-injection)

### HTML Render with React JSX

```tsx
import application, { h }  from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

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
deno run -A --config deno.json https://deno.land/x/fastro@v0.59.0/examples/html_response_jsx.tsx
```

### HTML with Native Response

```ts
import application from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/html_response_native.ts
```

### HTML with Fastro Response

```ts
import application, { response } from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

const app = application();

app.get("/", () => response().html("<h2>Hello world</h2"));

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.59.0/examples/html_response_fastro.ts
```

### JSON Response

```ts
import application from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

const app = application();

const json = { text: "Hello world" };

app.get("/", () => json);

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.59.0/examples/json_response_default.ts
```

### JSON with Native Response

```ts
import application from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/json_response_native.ts
```

### JSON with Fastro Response

```ts
import application, { response } from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

const app = application();

app.get("/", () => {
  return response().json({ text: "Hello world" });
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.59.0/examples/json_response_fastro.ts
```

### Send Custom HTTP Status, Content Type, and Authorization

```ts
import application, { response } from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/response_status.ts
```

### Cookie with Native Response

```ts
import {
  Cookie,
  deleteCookie,
  getCookies,
  setCookie,
} from "https://deno.land/std@0.133.0/http/cookie.ts"

import application from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";


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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/cookies_native.ts
```

### Cookie with Fastro Response

```ts
import application, {
  Cookie,
  getCookies,
  response,
} from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/cookies_fastro.ts
```

### HTML Render with Eta Template Engine

```ts
import application from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";import { render } from "https://deno.land/x/eta@1.12.3/mod.ts";
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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/html_render.ts
```

### Routing

```ts
import application from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";
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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/routing.ts
```

### Route parameters

```ts
import application, {
  getParam,
  getParams,
} from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";
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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/route_params.ts
```

### Route query

```ts
import application, { getQueries, getQuery } from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

const app = application();

app.get("/hello", (req: Request) => {
  return getQueries(req);
});

app.get("/welcome", (req: Request) => {
  return getQuery(req, "name");
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.59.0/examples/query_params.ts
```

### Router Middleware

```ts
import application, {
  ConnInfo,
  Next,
  router,
} from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";
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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/router_middleware.ts
```

### Router Middleware with Array

```ts
import application, {
  ConnInfo,
  Next,
  router,
} from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";
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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/router_middleware_with_array.ts
```

### Application Level Middleware

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";
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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/application_level_middleware.ts
```

### Application Level Middleware with Array

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";
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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/application_level_middleware_with_array.ts
```

### Route Level Middleware

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

const app = application();

const middlewares = (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
};

app.get("/", middlewares, () => new Response("App level #1"));

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.59.0/examples/route_level_middleware.ts
```

### Route Level Middleware with Array

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/route_level_middleware_with_array.ts
```

### SQLite and Dependency Injection

```ts
import application, { dependency } from "https://deno.land/x/fastro@v0.59.0/server/mod.ts";
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
deno run -A https://deno.land/x/fastro@v0.59.0/examples/deps_injection.ts
```

