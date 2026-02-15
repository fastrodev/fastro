import { createRouter } from "../../core/router.ts";
import {
  gitAddHandler,
  gitBranchesHandler,
  gitCheckoutHandler,
  gitCommitHandler,
  gitLogHandler,
  gitPushHandler,
  gitStatusHandler,
  gitSyncHandler,
  gitUnstageHandler,
} from "./handler.ts";
import { kvMiddleware } from "../../middlewares/kv/mod.ts";

const r = createRouter();

r.get("/api/git/status", gitStatusHandler, kvMiddleware);
r.get("/api/git/log", gitLogHandler, kvMiddleware);
r.get("/api/git/branches", gitBranchesHandler, kvMiddleware);
r.post("/api/git/sync", gitSyncHandler, kvMiddleware);
r.post("/api/git/checkout", gitCheckoutHandler, kvMiddleware);
r.post("/api/git/add", gitAddHandler, kvMiddleware);
r.post("/api/git/commit", gitCommitHandler, kvMiddleware);
r.post("/api/git/push", gitPushHandler, kvMiddleware);
r.post("/api/git/unstage", gitUnstageHandler, kvMiddleware);

export default r.build();
