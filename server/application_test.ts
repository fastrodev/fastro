import { assertEquals, ConnInfo } from "./deps.ts";
import application, {
  getParam,
  getParams,
  getQueries,
  getQuery,
  Next,
  router,
} from "./mod.ts";

Deno.test("app", async (t) => {
  const host = "http://localhost:8000";
  const app = application();

  // routing
  app.get("/", () => new Response("GET"));
  app.post("/", () => new Response("POST"));
  app.put("/", () => new Response("PUT"));
  app.delete("/", () => new Response("DELETE"));
  app.patch("/", () => new Response("PATCH"));
  app.options("/", () => new Response("OPTIONS"));
  app.head("/", () => new Response("HEAD"));
  app.get(/v/, () => new Response("regex"));
  app.get("/user/:id", (req: Request) => {
    const id = getParam("id", req);
    return new Response(id);
  });
  app.get("/account/:name", (req: Request) => {
    const params = getParams(req);
    return new Response(JSON.stringify(params));
  });
  app.get("/hello", (req: Request) => {
    return getQueries(req);
  });
  app.get("/welcome", (req: Request) => {
    return getQuery(req, "name");
  });

  // app middleware
  app.use("/m1", (_req: Request, _conn: ConnInfo, next: Next) => next());
  app.get("/m1", () => new Response("m1"));
  app.use("/m11", [(_req: Request, _conn: ConnInfo, next: Next) => next()]);
  app.get("/m11", () => new Response("m11"));
  // app middleware not working
  app.use("/m2", (_req: Request, _conn: ConnInfo, _next: Next) => {});

  // router middleware
  const r = router();
  r.get("/", () => new Response("r1"));
  app.use("/r1", r);
  app.use("/r2", [(_req: Request, _conn: ConnInfo, next: Next) => next()], r);
  app.get(
    "/level",
    (_req: Request, _conn: ConnInfo, next: Next) => next(),
    () => new Response("route level1"),
  );
  app.get(
    "/level2",
    [(_req: Request, _conn: ConnInfo, next: Next) => next()],
    () => new Response("route level2"),
  );

  const promise = app.serve();

  await t.step({
    name: "GET",
    fn: async () => {
      const response = await fetch(host, { method: "GET" });
      assertEquals(await response.text(), "GET");
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });

  await t.step({
    name: "PUT",
    fn: async () => {
      const response = await fetch(host, { method: "PUT" });
      assertEquals(await response.text(), "PUT");
    },
  });

  await t.step({
    name: "DELETE",
    fn: async () => {
      const response = await fetch(host, { method: "DELETE" });
      assertEquals(await response.text(), "DELETE");
    },
  });

  await t.step({
    name: "PATCH",
    fn: async () => {
      const response = await fetch(host, { method: "PATCH" });
      assertEquals(await response.text(), "PATCH");
    },
  });

  await t.step({
    name: "OPTIONS",
    fn: async () => {
      const response = await fetch(host, { method: "OPTIONS" });
      assertEquals(await response.text(), "OPTIONS");
    },
  });

  await t.step({
    name: "POST",
    fn: async () => {
      const response = await fetch(host, { method: "POST" });
      assertEquals(await response.text(), "POST");
    },
  });

  await t.step({
    name: "HEAD",
    fn: async () => {
      const response = await fetch(host, { method: "HEAD" });
      // QUESTION: WHY EMPTY?
      assertEquals(await response.text(), "");
    },
  });

  await t.step({
    name: "Route with regex path",
    fn: async () => {
      const response = await fetch(`${host}/v`, { method: "GET" });
      assertEquals(await response.text(), "regex");
    },
  });

  await t.step({
    name: "app level middleware",
    fn: async () => {
      const response = await fetch(`${host}/m1`, { method: "GET" });
      assertEquals(await response.text(), "m1");
    },
  });

  await t.step({
    name: "app level middleware with array",
    fn: async () => {
      const response = await fetch(`${host}/m11`, { method: "GET" });
      assertEquals(await response.text(), "m11");
    },
  });

  await t.step({
    name: "app level middleware not finished",
    fn: async () => {
      const response = await fetch(`${host}/m2`, { method: "GET" });
      assertEquals(await response.text(), "Internal Server Error");
    },
  });

  await t.step({
    name: "router middleware",
    fn: async () => {
      const response = await fetch(`${host}/r1`, { method: "GET" });
      assertEquals(await response.text(), "r1");
    },
  });

  await t.step({
    name: "router middleware with array",
    fn: async () => {
      const response = await fetch(`${host}/r2`, { method: "GET" });
      assertEquals(await response.text(), "r1");
    },
  });

  await t.step({
    name: "route level middleware",
    fn: async () => {
      const response = await fetch(`${host}/level`, { method: "GET" });
      assertEquals(await response.text(), "route level1");
    },
  });

  await t.step({
    name: "route level middleware with array",
    fn: async () => {
      const response = await fetch(`${host}/level2`, { method: "GET" });
      assertEquals(await response.text(), "route level2");
    },
  });

  await t.step({
    name: "Route get param",
    fn: async () => {
      const response = await fetch(`${host}/user/5`, { method: "GET" });
      assertEquals(await response.text(), "5");
    },
  });

  await t.step({
    name: "Route get params",
    fn: async () => {
      const response = await fetch(`${host}/account/agus`, { method: "GET" });
      assertEquals(await response.text(), JSON.stringify({ name: "agus" }));
    },
  });

  await t.step({
    name: "Route get queries",
    fn: async () => {
      const response = await fetch(`${host}/hello?id=1&name=agus`, {
        method: "GET",
      });
      assertEquals(
        await response.text(),
        JSON.stringify({ id: "1", name: "agus" }),
      );
    },
  });

  await t.step({
    name: "Route get query",
    fn: async () => {
      const response = await fetch(`${host}/welcome?id=1&name=agus`, {
        method: "GET",
      });
      assertEquals(
        await response.text(),
        "agus",
      );
    },
  });

  await t.step({
    name: "Server Close",
    fn: async () => {
      app.close();
      await promise;
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
});
