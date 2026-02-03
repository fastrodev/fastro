import type App from "../../mod.ts";
import { renderCode } from "./render.ts";

/**
 * Registers routes for viewing core framework source code.
 *
 * @param app The main application instance.
 */
export function registerCodeRoutes(app: App) {
  app.get(
    "/middlewares/static/static.ts",
    () => renderCode("middlewares/static/static.ts"),
  );
  app.get(
    "/middlewares/logger/logger.ts",
    () => renderCode("middlewares/logger/logger.ts"),
  );
  app.get(
    "/native.ts",
    () => renderCode("native.ts"),
  );
  app.get(
    "/main.ts",
    () => renderCode("main.ts"),
  );
}
