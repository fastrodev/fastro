Deno.serve({
  port: 3000,
  handler: async (req) => {
    const url = new URL(req.url);
    const method = req.method;

    if (method === "GET") {
      if (url.pathname === "/") return new Response("Hello world!");
      if (url.pathname.startsWith("/user/")) {
        const id = url.pathname.split("/")[2];
        return new Response(`User ${id}`);
      }
      if (url.pathname === "/query") {
        const name = url.searchParams.get("name");
        return new Response(`Hello ${name}`);
      }
      if (url.pathname === "/middleware") {
        // Simple middleware simulation
        const extendedReq = req as Request & { user: string };
        extendedReq.user = "fastro";
        return new Response(`Hello ${extendedReq.user}`);
      }
    }

    if (method === "POST" && url.pathname === "/json") {
      const body = await req.json();
      return Response.json(body);
    }

    return new Response("Not Found", { status: 404 });
  },
});
