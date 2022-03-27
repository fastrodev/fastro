import { application, ConnInfo, Next } from "../server/mod.ts";

const app = application();
app.get("/", (_req: Request, _conn: ConnInfo, next: Next) => {
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  next();
}, (_req: Request, _conn: ConnInfo) => {
  return new Response("Middleware");
});

console.log("listening on: http://localhost:8000");
await app.serve();
