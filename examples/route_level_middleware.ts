import application, { ConnInfo, Next } from "../server/mod.ts";

const app = application();

const middlewares = (_req: Request, _conn: ConnInfo, next: Next) => {
  console.log("middleware #1");
  next();
};

app.get("/", middlewares, () => new Response("App level #1"));

await app.serve();
