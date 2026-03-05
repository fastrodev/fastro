import { createRouter, kvMiddleware } from "../../deps.ts";
import type { Server } from "../../deps.ts";
import { userHandler } from "./handler.tsx";

export default function register(app: Server) {
  const r = createRouter(app);
  r.get("/u/:username", userHandler, kvMiddleware);
}
