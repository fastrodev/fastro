export {
  autoRegisterModules,
  createRouter,
  default as Fastro,
} from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/core/mod.ts";
export * from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/core/types.ts";
export * from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/core/router.ts";
export * from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/core/loader.ts";

export { createRenderMiddleware } from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/middlewares/render/mod.ts";
export { staticFiles } from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/middlewares/static/static.ts";
export { tailwind } from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/middlewares/tailwind/tailwind.ts";
export { cookieMiddleware } from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/middlewares/cookie/mod.ts";
export { logger } from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/middlewares/logger/mod.ts";
export {
  createToken,
  jwt,
  verifyToken,
} from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/middlewares/jwt/mod.ts";
export { kvMiddleware } from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/middlewares/kv/mod.ts";
export { bodyParser } from "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/middlewares/bodyparser/mod.ts";

export const RAW_URL =
  "https://raw.githubusercontent.com/fastrodev/fastro/refs/heads/main/";
