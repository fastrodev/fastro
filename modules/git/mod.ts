import { createRouter } from "../../core/router.ts";
import {
  gitBranchesHandler,
  gitCheckoutHandler,
  gitStatusHandler,
  gitSyncHandler,
} from "./handler.ts";
import { kvMiddleware } from "../../middlewares/kv/mod.ts";

const r = createRouter();

r.get("/api/git/status", gitStatusHandler, kvMiddleware);
r.get("/api/git/branches", gitBranchesHandler, kvMiddleware);
r.post("/api/git/sync", gitSyncHandler, kvMiddleware);
r.post("/api/git/checkout", gitCheckoutHandler, kvMiddleware);

export default r.build();
