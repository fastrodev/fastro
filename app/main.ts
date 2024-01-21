import Server from "../http/server/mod.ts";

const s = new Server();

s.get("/", (_req, ctx) => ctx.send("Hello world"));

s.get("/string", () => "Hello world");

s.get("/json", () => ({ message: "hello" }));

s.get("/number", () => 5);

s.get("/boolean", () => true);

s.get("/record", () => {
  const r: Record<string, string> = {};
  r["message"] = "Hello";
  return r;
});

s.serve();
