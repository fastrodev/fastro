import { createRouter } from "../../core/router.ts";
import { dashboardHandler, signoutHandler } from "./handler.tsx";
import { getConfigHandler, updateConfigHandler } from "./config_handler.ts";
import { kvMiddleware } from "../../middlewares/kv/mod.ts";
import { bodyParser } from "../../middlewares/bodyparser/mod.ts";

const r = createRouter();

r.get("/dashboard", dashboardHandler, kvMiddleware);
// Support both POST and GET signout for compatibility with link-based signout
r.post("/signout", dashboardHandler);
r.get("/signout", signoutHandler);

// Config API
r.get("/api/config", getConfigHandler, kvMiddleware);
r.put("/api/config", updateConfigHandler, bodyParser, kvMiddleware);

export default r.build();
