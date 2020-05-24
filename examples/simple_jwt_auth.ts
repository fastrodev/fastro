import {
  validateJwt,
  validateJwtObject,
} from "https://deno.land/x/djwt/validate.ts";
import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
} from "https://deno.land/x/djwt/create.ts";
import { Fastro, Request } from "../mod.ts";

const key = "secret";

function createJwt() {
  const payload: Payload = {
    iss: "joe",
    exp: setExpiration(new Date().getTime() + 60000 * 100),
  };
  const header: Jose = {
    alg: "HS256",
    typ: "JWT",
  };
  return makeJwt({ header, payload, key });
}

const plugin = function (req: Request) {
  if (req.method === "GET") {
    const token = req.headers.get("token");
    if (!token) return req.send("token not found");
    const valid = validateJwt(token, key, { isThrowing: false });
    valid.then((v) => {
      if (!v) return req.send("token invalid");
    });
  }
};

const server = new Fastro();

server
  .use(plugin)
  .post("/", (req) => {
    const jwt = createJwt();
    req.send({ token: jwt });
  })
  .get("/", (req) => {
    req.send("hello");
  });

await server.listen({ port: 8000 });
