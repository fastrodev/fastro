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
import { Request } from "../../mod.ts";

const key = "secret";

export function createJwt() {
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

export const jwtMiddleware = function (req: Request, done: Function) {
  if (req.method === "POST" && req.url === "/token") return;
  const token = req.headers.get("token");
  if (!token) return req.send("token not found");
  const valid = validateJwt(token, key, { isThrowing: false });
  valid.then((v) => {
    if (!v) return req.send("token invalid");
  });
  done();
};
