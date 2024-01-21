import Server from "../http/server/mod.ts";

const s = new Server();

s.get("/", (_req, ctx) => {
  return ctx.send("Hello world");
});

s.serve();
