import { ConnInfo } from "../http/deps.ts";
import fastro from "../mod.ts";

const f = new fastro();

f.get("/", (_req: Request, _info: ConnInfo) => {
  return new Response("Hello, World!");
});

await f.serve();
