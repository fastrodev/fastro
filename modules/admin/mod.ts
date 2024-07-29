import { Fastro } from "@app/mod.ts";
import adminPage from "./admin.page.tsx";
import adminLayout from "./admin.layout.tsx";
import adminHandler from "./admin.handler.tsx";

export default function adminModule(s: Fastro) {
    s.page("/admin", {
        component: adminPage,
        layout: adminLayout,
        handler: adminHandler,
        folder: "modules/admin",
    });
    return s;
}
