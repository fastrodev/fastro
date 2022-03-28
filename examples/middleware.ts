import { application, ConnInfo, Next } from "../server/mod.ts";

const app = application();

// // app level middleware
// app.use((_req: Request, _conn: ConnInfo, next: Next) => {
//   console.log("middleware #1");
//   next();
// });

// // app level middleware
// app.use("/abcd", (_req: Request, _conn: ConnInfo, next: Next) => {
//   console.log("middleware #1");
//   next();
// });

// route level middleware
app.get("/efgh", (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
}, () => new Response("Route level middleware #1"));

// route level middleware
app.get("/ijkl", (_req: Request, _conn: ConnInfo, next: Next) => {
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
}, () => new Response("Route level middleware #2"));

// route level middleware
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

console.log("Listening on: http://localhost:8000");

await app.serve();
