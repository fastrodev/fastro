import Server from "http://localhost:8000/mod.ts";

const s = new Server();

s.get("/", (_req, ctx) => {
  return ctx.send("Hello");
});

s.get(
  "/m",
  (_req, ctx) => {
    console.log("m1");
    return ctx.next();
  },
  (_req, ctx) => {
    console.log("m2");
    return ctx.next();
  },
  (_req, ctx) => {
    return ctx.send("Hello world");
  },
);

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
