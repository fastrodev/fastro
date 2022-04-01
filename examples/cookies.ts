import application, {
  Cookie,
  deleteCookie,
  getCookies,
  setCookie,
} from "../server/mod.ts";

const app = application();

app.post("/", () => {
  const headers = new Headers();
  const cookie: Cookie = { name: "Space", value: "Cat" };
  setCookie(headers, cookie);

  return new Response(JSON.stringify(cookie), { headers });
});

app.get("/", (req: Request) => {
  const headers = req.headers;
  const cookies = getCookies(headers);

  return new Response(JSON.stringify(cookies));
});

app.delete("/", () => {
  const headers = new Headers();
  deleteCookie(headers, "Space");
  const cookies = getCookies(headers);

  return new Response(JSON.stringify(cookies), {
    headers,
  });
});

console.log("Listening on: http://localhost:8000");

app.serve();
