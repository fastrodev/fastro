import { Fastro, FastroError } from "../mod.ts";

const server = new Fastro();
server
  // handle simple message using route shorthand declaration
  .get("/", (req) => req.send("hello"))
  // handle json object
  .get("/json", (req) => req.send({ message: "hello" }))
  // handle basic url parameter & send respond with custom status & header
  .get(
    "/:hello",
    (req) => {
      const status = 200;
      const headers = new Headers();
      headers.set("X-Made-In", "Cirebon, ID");
      headers.set("X-Author", "ynwd");
      req.send(`Hello, ${req.parameter.hello}`, status, headers);
    },
  )
  // handle multiple url parameter
  .get("/hello/:user/:id", (req) => {
    const data = {
      user: req.parameter.user,
      id: req.parameter.id,
    };
    req.send(data);
  })
  // handle post & get the payload
  .post("/hello", (req) => {
    const payload = req.payload;
    req.send(payload);
  });
// add optional callback
await server.listen({ port: 8000 }, (err, addr) => {
  if (err) throw FastroError("SERVER_ERROR", err);
  console.log("Server running on:", addr);
});
