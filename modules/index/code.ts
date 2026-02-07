import { Router } from "../../core/types.ts";
import { renderCode } from "./render.ts";

/**
 * Registers routes for viewing core framework source code.
 *
 * @param app The main application instance or router.
 */
export function registerCodeRoutes(app: Router) {
  app.get(
    "/middlewares/static/static.ts",
    () => renderCode("middlewares/static/static.ts"),
  );
  app.get(
    "/middlewares/logger/logger.ts",
    () => renderCode("middlewares/logger/logger.ts"),
  );
  app.get(
    "/middlewares/bodyparser/bodyparser.ts",
    () => renderCode("middlewares/bodyparser/bodyparser.ts"),
  );
  app.get(
    "/middlewares/cors/cors.ts",
    () => renderCode("middlewares/cors/cors.ts"),
  );
  app.get(
    "/middlewares/kv/kv.ts",
    () => renderCode("middlewares/kv/kv.ts"),
  );
  app.get(
    "/middlewares/jwt/jwt.ts",
    () => renderCode("middlewares/jwt/jwt.ts"),
  );
  app.get(
    "/core/loader.ts",
    () => renderCode("core/loader.ts"),
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
