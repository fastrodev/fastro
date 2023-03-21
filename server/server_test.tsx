import { HttpRequest, HttpResponse } from "../types.d.ts";
import { assertEquals } from "./deps.ts";
import { fastro } from "./server.ts";

const host = "http://localhost:9000";

Deno.test({ permissions: { net: true } }, async function jsx() {
  const app = fastro();
  app.get(
    "/",
    (req: HttpRequest, res: HttpResponse) =>
      res.status(200).jsx(<h1>Hello jsx</h1>),
  );
  app.post("/", () => <h1>Hello jsx</h1>);
  const server = app.serve();

  let response = await fetch(host, { method: "GET" });
  assertEquals(await response.text(), `<h1>Hello jsx</h1>`);

  response = await fetch(host, { method: "POST" });
  assertEquals(await response.text(), `<h1>Hello jsx</h1>`);

  app.close();
  await server;
});
