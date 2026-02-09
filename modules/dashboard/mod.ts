import { createRouter } from "../../core/router.ts";
import { dashboardHandler } from "./handler.tsx";

const r = createRouter();

r.get("/dashboard", dashboardHandler);
r.post("/signout", dashboardHandler);

export default r.build();
