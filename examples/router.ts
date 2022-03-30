import { application, ConnInfo, Next, router } from "../server/mod.ts";

const app = application();
const r = router();
const middleware = (_req: Request, _connInfo: ConnInfo, next: Next) => {
  console.log("v2");
  next();
};

const middlewares = [(_req: Request, _connInfo: ConnInfo, next: Next) => {
  console.log("v3");
  next();
}];

r.get("/", () => new Response("Get"))
  .post("/", () => new Response("Post"))
  .put("/", () => new Response("Put"))
  .delete("/", () => new Response("Delete"));

app.use("/v1", r);
app.use("/v2", middleware, r);
app.use("/v3", middlewares, r);

await app.serve();
