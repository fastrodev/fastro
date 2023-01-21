import {
  Application,
  FlashServer,
  hasFlash,
} from "https://deno.land/x/oak/mod.ts";

const appOptions = hasFlash() ? { serverConstructor: FlashServer } : undefined;

const app = new Application(appOptions);

// Hello World!
app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

await app.listen({ port: 8000 });

// Deno.serve(async () => await new Response("Hello, world!"));

// import fastro from "$fastro/http/server.ts";
// import { HttpRequest } from "$fastro/http/types.ts";

// const app = fastro();

// app.use("/", (_req: HttpRequest) => "Hello")
//   .get("/hi", () => new Response("Hi"))
//   .get("/user/:userId", () => new Response("Hi user"))
//   .get("/search/:name/price/:price", () => new Response("Your search"));

// app.serve();
