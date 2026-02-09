import { Router } from "../../core/types.ts";
import { renderCode } from "./render.ts";

/**
 * Registers routes for viewing core framework source code.
 *
 * @param app The main application instance or router.
 */
export function registerCodeRoutes(app: Router) {
  const files = [
    "middlewares/static/static.ts",
    "middlewares/logger/logger.ts",
    "middlewares/bodyparser/bodyparser.ts",
    "middlewares/cookie/cookie.ts",
    "middlewares/render/render.ts",
    "middlewares/cors/cors.ts",
    "middlewares/kv/kv.ts",
    "middlewares/jwt/jwt.ts",
    "core/loader.ts",
    "native.ts",
    "main.ts",
  ];

  for (const path of files) {
    app.get(`/${path}`, () => renderCode(path));
  }
}
