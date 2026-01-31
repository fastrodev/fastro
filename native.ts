Deno.serve({
  port: 3000,
  handler: () => new Response("Hello world!"),
});
