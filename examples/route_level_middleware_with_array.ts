import application, { ConnInfo, Next } from "https://fastro.dev/server/mod.ts";

const app = application();

const middlewares = [(_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #2");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #3");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #4");
  next();
}];

app.get("/mnop", middlewares, () => new Response("Route level middleware #3"));

await app.serve();
