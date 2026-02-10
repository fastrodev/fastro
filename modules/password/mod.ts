import { createRouter } from "../../core/router.ts";
import { passwordHandler } from "./handler.tsx";
import { bodyParser } from "../../middlewares/bodyparser/mod.ts";
import { kvMiddleware } from "../../middlewares/kv/mod.ts";
import { jwt } from "../../middlewares/jwt/jwt.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "fastro-secret";

const r = createRouter();

// Require authentication via JWT for password updates
r.get("/password", passwordHandler, jwt({ secret: JWT_SECRET }));
r.post(
  "/password",
  passwordHandler,
  bodyParser,
  kvMiddleware,
  jwt({ secret: JWT_SECRET }),
);

export default r.build();
