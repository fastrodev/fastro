import { createRouter } from "../../core/router.ts";
import { profileHandler } from "./handler.tsx";
import { bodyParser } from "../../middlewares/bodyparser/mod.ts";
import { kvMiddleware } from "../../middlewares/kv/mod.ts";

const r = createRouter();

r.get("/profile", profileHandler, kvMiddleware);
r.post("/profile", profileHandler, bodyParser, kvMiddleware);

export default r.build();
