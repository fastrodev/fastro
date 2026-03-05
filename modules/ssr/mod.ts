import { createRouter } from "../../deps.ts";
import type { Server } from "../../deps.ts";
import { ssrHandler } from "./handler.tsx";

export default function register(app: Server) {
  const r = createRouter(app);
  r.get("/ssr", ssrHandler);
}
