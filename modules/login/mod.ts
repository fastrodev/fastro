import { createRouter } from "../../core/mod.ts";
import { Server } from "../../core/types.ts";
import { createRenderMiddleware } from "../../middlewares/render/mod.ts";
import { appHandler } from "./App.handler.tsx";

export default function register(app: Server) {
  app.use(createRenderMiddleware());
  const r = createRouter(app);
  r.get("/login", appHandler);
}
