import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
} from "https://deno.land/x/djwt/create.ts";
import { Fastro, FastroRequest } from "../mod.ts";

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

const plugin = function validateToken(req: FastroRequest) {
  const token = req.headers.get("token");
  if (token) {
    const valid = validateJwt(token, key, { isThrowing: false });
    req.valid = valid;
  }
};

const server = new Fastro();

server
  .use(plugin)
  .post("/", (req) => {
    const jwt = createJwt();
    req.send({ token: jwt });
  })
  .get("/", async (req) => {
    const valid = await req.valid;
    if (!valid) return req.send("invalid", 401);
    return req.send(valid);
  });

await server.listen({ port: 8000 });
