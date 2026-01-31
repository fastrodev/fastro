Deno.serve({
  port: 8000,
  handler: () => new Response("Hello world!"),
});
