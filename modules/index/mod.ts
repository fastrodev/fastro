import { Fastro, HttpRequest } from "@app/mod.ts";
import indexApp from "../index/index.page.tsx";
import { index } from "../index/index.layout.tsx";

function init() {
    const basePath = Deno.env.get("DENO_DEPLOYMENT_ID")
        ? `https://raw.githubusercontent.com/fastrodev/fastro/main/static`
        : "http://localhost:8000/static";
    const code =
        `import init from "${basePath}/init.ts"; const name = Deno.args[0] ?? 'project'; await init(name);`;
    return new Response(code, {
        headers: {
            "content-type": "application/typescript; charset=utf-8",
        },
    });
}

function denoRunCheck(req: HttpRequest) {
    const regex = /^Deno\/(\d+\.\d+\.\d+)$/;
    const string = req.headers.get("user-agent");
    if (!string) return false;
    const match = regex.exec(string);
    if (!match) return false;
    return true;
}

export default function (s: Fastro) {
    /** setup SSR */
    s.page("/", {
        component: indexApp,
        layout: index,
        folder: "modules/index",
        handler: (req, ctx) => {
            const res = denoRunCheck(req);
            if (res) return init();
            return ctx.render({
                title: "Fast & Modular Web Framework",
                description:
                    "Build SSR web applications with a flat modular architecture",
                image: "https://fastro.dev/fastro.png",
                start: Deno.env.get("ENV") === "DEVELOPMENT"
                    ? "http://localhost:8000/docs/start"
                    : "https://fastro.dev/docs/start",
                baseUrl: Deno.env.get("ENV") === "DEVELOPMENT"
                    ? "http://localhost:8000"
                    : "https://fastro.dev",
                new: "Collaboration and Profit Sharing",
                destination: "blog/collaboration",
            });
        },
    });
    return s;
}
