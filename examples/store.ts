import fastro, { Context, HttpRequest } from "@app/mod.ts";

const f = new fastro();

// set default value for the store
f.store.set("hello", "hello world");

// update default value
f.post(
    "/",
    (_req: HttpRequest, ctx: Context) => {
        ctx.store.set("hello", "hello world v2");
        return ctx.send("Helo world", 200);
    },
);

// update default value with TTL
f.post(
    "/ttl",
    (_req: HttpRequest, ctx: Context) => {
        ctx.store.set("hello", "world", 1000);
        return ctx.send("ttl", 200);
    },
);

// save store to github
f.post(
    "/commit",
    async (_req: HttpRequest, ctx: Context) => {
        await ctx.store.commit();
        return ctx.send("commit", 200);
    },
);

// destroy file
f.post(
    "/destroy",
    async (_req: HttpRequest, ctx: Context) => {
        await ctx.store.destroy();
        return ctx.send("destroy", 200);
    },
);

// get the value
f.get(
    "/",
    async (_req: HttpRequest, ctx: Context) => {
        const res = await ctx.store.get("hello");
        return Response.json({ value: res });
    },
);

await f.serve();
