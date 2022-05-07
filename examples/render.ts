import application from "../server/mod.ts";
import { render } from "https://deno.land/x/eta@v1.12.3/mod.ts";

const app = application();

const headers = new Headers();
headers.set("Content-Type", "text/html; charset=UTF-8");

app.get("/", () => {
  const html = <string> render(
    "<h4>The answer to everything is <%= it.answer %></h4>",
    {
      answer: 42,
    },
  );

  return new Response(html, { headers });
});

console.log("Listening on: http://localhost:8000");

app.serve();
