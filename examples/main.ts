import { fastro } from "../server/server.ts";

const f = fastro();

f.flash(false);

f.get("/", () => new Response("Hello world"));

await f.serve();
