import { ConnInfo, fastro, Next } from "../server/mod.ts";

const app = fastro();

function middleware(req: Request, connInfo: ConnInfo, next: Next) {
  console.log("url=", req.url);
  console.log("remoteAddr=", connInfo.remoteAddr);
  next();
}

app.get("/", middleware, () => new Response("Hello world!"));

await app.serve();
