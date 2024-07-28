import Server from "@app/mod.ts";
import markdown from "@app/middleware/markdown/mod.tsx";
import blogLayout from "@app/modules/blog/blog.layout.tsx";
import docsLayout from "@app/modules/docs/docs.layout.tsx";
import blog from "@app/modules/blog/mod.ts";
import docs from "@app/modules/docs/mod.ts";
import index from "@app/modules/index/mod.ts";
import { tailwind } from "@app/middleware/tailwind/mod.ts";
import { authModule } from "@app/auth/mod.tsx";
import { adminModule } from "@app/modules/admin/mod.ts";

const s = new Server();

/** markdown with default folder and prefix */
s.use(markdown(blogLayout));

/** markdown with 'docs' folder and prefix */
s.use(markdown(docsLayout, "docs", "docs"));

/** setup tailwind */
s.use(tailwind());

/** proxy for github repo */
s.use(async (_req, ctx) => {
    if (
        ctx.url.pathname.endsWith(".ts") ||
        ctx.url.pathname.endsWith(".tsx")
    ) {
        const version = ctx.url.pathname.startsWith("/v")
            ? ""
            : ctx.url.pathname.startsWith("/canary")
            ? "/canary"
            : "/main";

        const path =
            `https://raw.githubusercontent.com/fastrodev/fastro${version}${ctx.url.pathname}`;
        const res = await fetch(path);
        const content = await res.text();
        return new Response(content);
    }
    return ctx.next();
});

s.group(index);
s.group(blog);
s.group(docs);
s.group(authModule);
s.group(adminModule);

s.serve();
