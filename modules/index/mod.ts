import { createRouter } from "../../core/router.ts";
import type { Server } from "../../core/types.ts";

export default function register(app: Server) {
  const r = createRouter(app);
  r.get("/", () => new Response("Hello from modules/root"));
}
