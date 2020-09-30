import { serve } from "https://deno.land/std@0.71.0/http/server.ts";

const server = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080`);

for await (const request of server) {
  const res = {
    body: "Hello World",
    headers: new Headers(),
  };
  res.headers.set("Date", new Date().toUTCString());
  res.headers.set("Connection", "keep-alive");
  request.respond(res);
}
