import { Fastro } from "@app/mod.ts";
import indexPage from "@app/modules/admin/index.page.tsx";
import { indexLayout } from "@app/modules/admin/index.layout.tsx";
import { indexHandler } from "@app/modules/admin/index.handler.tsx";
import { tailwind } from "@app/middleware/tailwind/mod.ts";

export function adminModule(s: Fastro) {
    s.use(tailwind());
    s.page("/", {
        component: indexPage,
        layout: indexLayout,
        handler: indexHandler,
        folder: "modules/admin",
    });
    return s;
}
