import { bodyParser, createRouter, kvMiddleware, Server } from "../../deps.ts";
import { profileHandler } from "./handler.tsx";

export default function register(app: Server) {
  const r = createRouter(app);
  r.get("/profile", profileHandler, kvMiddleware);
  r.post("/profile", profileHandler, bodyParser, kvMiddleware);
}
