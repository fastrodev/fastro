// 10 middleware simulations — each mutates a shared context object,
// matching Fastro's 10 global app.use() calls that set ctx properties.
// deno-lint-ignore no-explicit-any
type Ctx = Record<string, any>;
type Next = () => Response | Promise<Response>;

const mw1 = (ctx: Ctx, next: Next) => {
  ctx.requestId = "req-123";
  return next();
};
const mw2 = (ctx: Ctx, next: Next) => {
  ctx.logged = true;
  return next();
};
const mw3 = (ctx: Ctx, next: Next) => {
  ctx.corsOrigin = "*";
  return next();
};
const mw4 = (ctx: Ctx, next: Next) => {
  ctx.securityHeaders = true;
  return next();
};
const mw5 = (ctx: Ctx, next: Next) => {
  ctx.rateLimit = 100;
  return next();
};
const mw6 = (ctx: Ctx, next: Next) => {
  ctx.sessionId = "sess-abc";
  return next();
};
const mw7 = (ctx: Ctx, next: Next) => {
  ctx.authUser = "admin";
  return next();
};
const mw8 = (ctx: Ctx, next: Next) => {
  ctx.compress = "gzip";
  return next();
};
const mw9 = (ctx: Ctx, next: Next) => {
  ctx.cacheControl = "no-cache";
  return next();
};
const mw10 = (ctx: Ctx, next: Next) => {
  ctx.metricsStart = Date.now();
  return next();
};

Deno.serve({
  port: 3000,
  handler: (req) => {
    // Create a fresh context per request, just like Fastro does
    const ctx: Ctx = {};

    return mw1(
      ctx,
      () =>
        mw2(ctx, () =>
          mw3(ctx, () =>
            mw4(ctx, () =>
              mw5(ctx, () =>
                mw6(ctx, () =>
                  mw7(ctx, () =>
                    mw8(ctx, () =>
                      mw9(ctx, () =>
                        mw10(ctx, async () => {
                          const url = new URL(req.url);
                          const method = req.method;

                          if (method === "GET") {
                            if (url.pathname === "/") {
                              return new Response("Hello world!");
                            }
                            if (url.pathname.startsWith("/user/")) {
                              const id = url.pathname.split("/")[2];
                              return new Response(`User ${id}`);
                            }
                            if (url.pathname === "/query") {
                              const name = url.searchParams.get("name");
                              return new Response(`Hello ${name}`);
                            }
                            if (url.pathname === "/middleware") {
                              ctx.user = "fastro";
                              return new Response(`Hello ${ctx.user}`);
                            }
                          }

                          if (method === "POST" && url.pathname === "/json") {
                            const body = await req.json();
                            return Response.json(body);
                          }

                          return new Response("Not Found", { status: 404 });
                        }))))))))),
    ) as Response;
  },
});
