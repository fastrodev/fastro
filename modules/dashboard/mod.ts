import { createRouter } from "../../core/router.ts";
import { dashboardHandler, signoutHandler } from "./handler.tsx";
import { kvMiddleware } from "../../middlewares/kv/mod.ts";

const r = createRouter();

r.get("/dashboard", dashboardHandler, kvMiddleware);
// Support both POST and GET signout for compatibility with link-based signout
r.post("/signout", dashboardHandler);
r.get("/signout", signoutHandler);

export default r.build();
