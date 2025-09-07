import Server from "@app/mod.ts";

const s = new Server();

await s.serve({
  port: 3000,
});
