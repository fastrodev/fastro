import { bodyParser, createRouter, kvMiddleware } from "../../deps.ts";
import type { Server } from "../../deps.ts";
import { signupHandler } from "./handler.tsx";

export default function register(app: Server) {
  const r = createRouter(app);
  r.get("/signup", signupHandler);
  r.post("/signup", signupHandler, bodyParser, kvMiddleware);
}
