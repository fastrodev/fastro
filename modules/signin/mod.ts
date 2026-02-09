import { createRouter } from "../../core/router.ts";
import { signinHandler } from "./handler.tsx";
import { bodyParser } from "../../middlewares/bodyparser/mod.ts";
import { kvMiddleware } from "../../middlewares/kv/mod.ts";

const r = createRouter();

r.get("/signin", signinHandler);
r.post("/signin", signinHandler, bodyParser, kvMiddleware);

export default r.build();
