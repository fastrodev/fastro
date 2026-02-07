import { createRouter } from "../../core/router.ts";
import { ssrHandler } from "./handler.tsx";

const r = createRouter();

r.get("/ssr", ssrHandler);

export default r.build();
