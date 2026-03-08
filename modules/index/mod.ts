import { createRouter } from "../../core/router.ts";
import type { Server } from "../../core/types.ts";
import { appHandler } from "./app.handler.tsx";
import { signinHandler } from "./signin.handler.ts";

export default function register(app: Server) {
  const r = createRouter(app);
  r.get("/", appHandler);
  r.post("/signin", signinHandler);
}
