import type { Context, Handler, Middleware, Next } from "./core/types.ts";
import { createRouter } from "./core/router.ts";
import { autoRegisterModules } from "./core/loader.ts";
export { autoRegisterModules, createRouter };
export type { Context, Handler, Middleware, Next };

import server from "./core/server.ts";
const modules = { ...server };
export default modules;
