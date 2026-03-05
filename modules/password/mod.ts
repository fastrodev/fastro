import { bodyParser, createRouter, jwt, kvMiddleware } from "../../deps.ts";
import type { Server } from "../../deps.ts";
import { passwordHandler } from "./handler.tsx";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "fastro-secret";

export default function register(app: Server) {
  const r = createRouter(app);

  // Require authentication via JWT for password updates
  r.get("/password", passwordHandler, jwt({ secret: JWT_SECRET }));
  r.post(
    "/password",
    passwordHandler,
    bodyParser,
    kvMiddleware,
    jwt({ secret: JWT_SECRET }),
  );
}
