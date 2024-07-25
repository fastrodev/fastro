import fastro, { Context, HttpRequest } from "@app/mod.ts";
import { connect } from "https://deno.land/x/redis@v0.32.1/mod.ts";

const redis = await connect({
  hostname: "localhost",
  port: 6379,
});

await redis.set("hoge", "fuga");

async function getData() {
  return await redis.get("hoge");
}

const f = new fastro();

f.get(
  "/",
  async (_req: HttpRequest, ctx: Context) => {
    const data = await getData();
    return ctx.send(data, 200);
  },
);

await f.serve();
