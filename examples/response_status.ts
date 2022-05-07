import application, { response } from "../server/mod.ts";

const app = application();

app.get("/", () => {
  return response()
    .contentType("application/json")
    .authorization("Basic YWxhZGRpbjpvcGVuc2VzYW1l")
    .status(200)
    .send(JSON.stringify({ message: "Hello world" }));
});

console.log("Listening on: http://localhost:8000");

await app.serve();
