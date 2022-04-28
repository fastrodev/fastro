# Fastro

Fast and simple web application framework for deno.

With
[near-native perfomance](https://deno.land/x/fastro@v0.53.0/benchmarks),
you can manage your routing, middlewares, and dependencies cleanly. You can also
take advantage of existing Deno objects and methods:
[Request](https://deno.com/deploy/docs/runtime-request),
[Response](https://deno.com/deploy/docs/runtime-request),
[Headers](https://deno.com/deploy/docs/runtime-headers), and
[Cookie](https://deno.land/std@0.133.0/http).

### Examples

- [Getting Started](#getting-started)
- [Custom Port](#custom-port)
- [Set HTML](#set-html)
- [Set HTML with RequestResponse](#set-html-with-requestresponse)
- [Set JSON](#set-json)
- [Set JSX](#set-jsx)
- [Set Server Side Rendering](#set-ssr)
- [Set Content Type](#set-content-type)
- [Set HTTP Status](#set-http-status)
- [Set Authorization](#set-authorization)
- [Set, Get, and Delete a Cookie](#set-get-and-delete-a-cookie)
- [Set, Get, and Delete a Cookie with RequestResponse](#set-get-and-delete-a-cookie-with-requestresponse)
- [Render with Eta Template Engine](#render-with-eta-template-engine)
- [Routing](#routing)
- [Route Parameters](#route-parameters)
- [Router Middleware](#router-middleware)
- [Router Middleware with Array](#route-level-middleware-with-array)
- [Application Level Middleware](#application-level-middleware)
- [Application Level Middleware with Array](#application-level-middleware-with-array)
- [Route Level Middleware](#route-level-middleware)
- [Route Level Middleware with Array](#route-level-middleware-with-array)
- [SQLite and Dependency Injection](#sqlite-and-dependency-injection)

### Getting started

```ts
import application from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

const app = application();

app.get("/", () => "Hello world");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.53.0/examples/main.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/main.ts)

### Custom port

```ts
import application from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

const app = application();

app.get("/", () => "Hello world!");

await app.serve({ port: 3000 });
```

```
deno run -A https://deno.land/x/fastro@v0.53.0/examples/custom_port.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/custom_port.ts)

### Set HTML

```ts
import application from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.53.0/examples/html_response.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/html_response.ts)

### Set HTML with RequestResponse

```ts
import application, {
  response,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

const app = application();

app.get("/", () => {
  const res = response();
  return res.html("<h2>Hello world</h2>");
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.53.0/examples/response_html.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/response_html.ts)

### Set JSON

```ts
import application, {
  response,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

const app = application();

app.get("/", () => {
  const res = response();
  return res.json({ text: "Hello world" });
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.53.0/examples/response_json.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/response_json.ts)

### Set JSX

```tsx
import application from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

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
deno run -A --unstable --config deno.json https://deno.land/x/fastro@v0.53.0/examples/jsx_response.tsx
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/jsx_response.tsx)

### Set SSR

#### React Component: `response_ssrApp.tsx`

```ts
import React from "https://esm.sh/react";

const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>Hello Deno Land!</h1>
      <button onClick={() => setCount(count + 1)}>Click the 🦕</button>
      <p>You clicked the 🦕 {count} times</p>
    </div>
  );
};

export default App;
```

#### Endpoint: `response_ssr.tsx`

```ts
import application, {
  response,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";
import App from "./response_ssrApp.tsx";

const app = application();
const hydratePath = "./response_ssrClient.tsx";

app.get("/", () => {
  const res = response();
  return res.ssr(<App />, hydratePath);
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

#### SSR Hydration `response_ssrClient.tsx`

```ts
import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import App from "./response_ssrApp.tsx";

ReactDOM.hydrate(
  <App />,
  //@ts-ignore: used by Deno.emit
  document.getElementById("root"),
);
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

#### How to run locally

```
deno run -A --unstable response_ssr.tsx
```

### Set Content Type

```ts
import application, {
  response,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

const app = application();

app.get("/", () => {
  const res = response();
  return res.contentType("application/json")
    .send(JSON.stringify({ msg: "Hello world" }));
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.53.0/examples/response_content_type.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/response_content_type.ts)

### Set HTTP Status

```ts
import application, {
  response,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

const app = application();

app.get("/", () => {
  const res = response();
  return res.status(200).send("status");
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.53.0/examples/response_status.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/response_status.ts)

### Set Authorization

```ts
import application, {
  response,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

const app = application();

app.get("/", () => {
  const res = response();
  return res.authorization("Basic YWxhZGRpbjpvcGVuc2VzYW1l")
    .send("Basic auth");
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.53.0/examples/response_auth.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/response_auth.ts)

### Set, Get, and Delete a Cookie

```ts
import {
  Cookie,
  deleteCookie,
  getCookies,
  setCookie,
} from "https://deno.land/std@0.133.0/http/cookie.ts";

import application from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

const app = application();

app.post("/", () => {
  const headers = new Headers();
  const cookie: Cookie = { name: "Space", value: "Cat" };
  setCookie(headers, cookie);

  return new Response(JSON.stringify(cookie), { headers });
});

app.get("/", (req: Request) => {
  const headers = req.headers;
  const cookies = getCookies(headers);

  return new Response(JSON.stringify(cookies));
});

app.delete("/", () => {
  const headers = new Headers();
  deleteCookie(headers, "Space");
  const cookies = getCookies(headers);

  return new Response(JSON.stringify(cookies), {
    headers,
  });
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.53.0/examples/cookies.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/cookies.ts)

### Set, Get, and Delete a Cookie with RequestResponse

```ts
import application, {
  Cookie,
  getCookies,
  response,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

const app = application();

app.get("/set", () => {
  const res = response();
  const cookie: Cookie = { name: "Space", value: "Cat" };

  return res.setCookie(cookie)
    .send(JSON.stringify(cookie));
});

app.get("/del", () => {
  const res = response();
  return res.deleteCookie("Space").send("Cookie deleted");
});

app.get("/chk", (req: Request) => {
  const res = response();
  const cookie = getCookies(req.headers);
  return res.send(JSON.stringify(cookie));
});

console.log("Listening on: http://localhost:8000");

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.53.0/examples/response_cookies.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/response_cookies.ts)

### Render with Eta Template Engine

```ts
import application from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";
import { render } from "https://deno.land/x/eta@v1.12.3/mod.ts";

const app = application();

const headers = new Headers();
headers.set("Content-Type", "text/html charset=UTF-8");

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

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.53.0/examples/render.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/render.ts)

### Routing

```ts
import application from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.53.0/examples/routing.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/routing.ts)

### Route parameters

```ts
import application, {
  getParam,
  getParams,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.53.0/examples/route_params.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/route_params.ts)

### Router Middleware

```ts
import application, {
  ConnInfo,
  Next,
  router,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.53.0/examples/router_middleware.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/router_middleware.ts)

### Router Middleware with Array

```ts
import application, {
  ConnInfo,
  Next,
  router,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.53.0/examples/router_middleware_with_array.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/router_middleware_with_array.ts)

### Application Level Middleware

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.53.0/examples/application_level_middleware.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/application_level_middleware.ts)

### Application Level Middleware with Array

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.53.0/examples/application_level_middleware_with_array.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/application_level_middleware_with_array.ts)

### Route Level Middleware

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

const app = application();

const middlewares = (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
};

app.get("/", middlewares, () => new Response("App level #1"));

await app.serve();
```

```
deno run -A https://deno.land/x/fastro@v0.53.0/examples/route_level_middleware.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/route_level_middleware.ts)

### Route Level Middleware with Array

```ts
import application, {
  ConnInfo,
  Next,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.53.0/examples/route_level_middleware_with_array.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/route_level_middleware_with_array.ts)

### SQLite and Dependency Injection

```ts
import application, {
  dependency,
} from "https://deno.land/x/fastro@v0.53.0/server/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.3.0/mod.ts";

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
deno run -A https://deno.land/x/fastro@v0.53.0/examples/deps_injection.ts
```

[![alt text](https://raw.githubusercontent.com/fastrodev/fastro/gh-pages/assets/img/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.land/x/fastro@v0.53.0/examples/deps_injection.ts)

