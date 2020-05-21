import { Application } from "https://deno.land/x/abc@v1.0.0-rc6/mod.ts";

const app = new Application();
const port = 3004;
app.get("/", (c) => "Hello!")
  .start({ port });
console.log("abc listening on port:", port);
