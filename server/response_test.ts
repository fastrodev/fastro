import { HttpRequest, HttpResponse } from "../types.d.ts";
import { assertEquals, Cookie } from "./deps.ts";
import { fastro } from "./server.ts";

const host = "http://127.0.0.1:9000";

Deno.test({ permissions: { net: true } }, async function getJson() {
  const app = fastro();
  app.flash(false);
  app.get("/", (_req: HttpRequest, res: HttpResponse) => {
    return res.json(undefined);
  });
  const server = app.serve();
  const response = await fetch(host, { method: "GET" });
  const r = await response.text();
  assertEquals(
    r,
    `jsonError: TypeError: Cannot read properties of undefined (reading 'props')`,
  );
  app.close();
  await server;
});

Deno.test({ permissions: { net: true } }, async function getPage() {
  const app = fastro();
  app.get("/", (_req: HttpRequest, res: HttpResponse) => {
    const cookie: Cookie = { name: "Space", value: "Cat" };
    res.setCookie(cookie);
    res.deleteCookie("Space");
    return res.setCookie(cookie).html("<div>Hello</div>");
  });
  const server = app.serve();
  const response = await fetch(host, { method: "GET" });
  const cookie = response.headers.get("Set-Cookie");
  assertEquals(
    cookie,
    "Space=; Expires=Thu, 01 Jan 1970 00:00:00 GMT, Space=Cat",
  );
  assertEquals(await response.text(), "<div>Hello</div>");
  app.close();
  await server;
});
