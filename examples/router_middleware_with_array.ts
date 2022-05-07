import application, { ConnInfo, Next, router } from "../server/mod.ts";

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
