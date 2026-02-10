import { createRouter } from "../../core/router.ts";
import { userHandler } from "./handler.tsx";
import { kvMiddleware } from "../../middlewares/kv/mod.ts";

const r = createRouter();

r.get("/u/:username", userHandler, kvMiddleware);

export default r.build();
