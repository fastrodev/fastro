import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { fastro } from "./server.ts";
import { HttpRequest, HttpResponse } from "./types.ts";

const host = "http://localhost:9000";

Deno.test({ permissions: { net: true } }, async function jsx() {
  const app = fastro();
  app.get(
    "/",
    (req: HttpRequest, res: HttpResponse) =>
      res.status(200).jsx(<h1>Hello, jsx</h1>),
  );
  const server = app.serve();
  const response = await fetch(host, { method: "GET" });
  assertEquals(await response.text(), `<h1>Hello, jsx</h1>`);
  app.close();
  await server;
});
