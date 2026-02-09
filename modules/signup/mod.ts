import { createRouter } from "../../core/router.ts";
import { signupHandler } from "./handler.tsx";
import { bodyParser } from "../../middlewares/bodyparser/mod.ts";
import { kvMiddleware } from "../../middlewares/kv/mod.ts";

const r = createRouter();

r.get("/signup", signupHandler);
r.post("/signup", signupHandler, bodyParser, kvMiddleware);

export default r.build();
