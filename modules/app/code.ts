import type App from "../../mod.ts";
import { renderCode } from "./render.ts";

export function registerCodeRoutes(app: App) {
  app.get(
    "/middlewares/static/static.ts",
    () => renderCode("middlewares/static/static.ts"),
  );
  app.get(
    "/middlewares/logger/logger.ts",
    () => renderCode("middlewares/logger/logger.ts"),
  );
}
