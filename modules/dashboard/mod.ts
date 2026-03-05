import { bodyParser, createRouter, kvMiddleware } from "../../deps.ts";
import type { Server } from "../../deps.ts";
import { dashboardHandler, signoutHandler } from "./handler.tsx";
import { getConfigHandler, updateConfigHandler } from "./config_handler.ts";

export default function register(app: Server) {
  const r = createRouter(app);

  r.get("/dashboard", dashboardHandler, kvMiddleware);
  // Support both POST and GET signout for compatibility with link-based signout
  r.post("/signout", dashboardHandler);
  r.get("/signout", signoutHandler);

  // Config API
  r.get("/api/config", getConfigHandler, kvMiddleware);
  r.put("/api/config", updateConfigHandler, bodyParser, kvMiddleware);
}
