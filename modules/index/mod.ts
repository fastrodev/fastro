import { Fastro } from "@app/mod.ts";
import indexApp from "@app/modules/index/index.page.tsx";
import index from "@app/modules/index/index.layout.tsx";
import { handler } from "@app/modules/index/index.handler.ts";

export default function (s: Fastro) {
    s.page("/", {
        component: indexApp,
        layout: index,
        folder: "modules/index",
        handler,
    });
    return s;
}
