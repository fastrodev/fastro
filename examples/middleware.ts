import application, { ConnInfo, Next } from "../server/mod.ts";

const app = application();

// app level middleware
app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #1");
  next();
});

// app level middleware
app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #2");
  next();
});

app.use((_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #3");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("app middleware #4");
  next();
});

const middlewares = [(_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #5");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #6");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #7");
  next();
}, (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #8");
  next();
}];

app.use(middlewares);
app.use("/abcd", middlewares);

app.get("/", () => new Response("App level #1"));
app.get("/abcd", () => new Response("App level #2"));

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

app.get("/mnop", middlewares, () => new Response("Route level middleware #3"));

console.log("Listening on: http://localhost:8000");

await app.serve();
