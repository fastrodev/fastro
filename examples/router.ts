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

r.get("/user", () => new Response("Get user"))
  .post("/user", () => new Response("Post user"))
  .put("/user", () => new Response("Put user"))
  .delete("/user", () => new Response("Delete user"));

app.use("/v1", r);
app.use("/v2", middleware, r);
app.use("/v3", middlewares, r);

await app.serve();
