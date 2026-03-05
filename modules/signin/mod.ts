import { bodyParser, createRouter, kvMiddleware } from "../../deps.ts";
import type { Server } from "../../deps.ts";
import { signinHandler } from "./handler.tsx";

export default function register(app: Server) {
  const r = createRouter(app);
  r.get("/signin", signinHandler);
  r.post("/signin", signinHandler, bodyParser, kvMiddleware);
}
