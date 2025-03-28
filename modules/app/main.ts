import Server from "@app/mod.ts";
import waitModule from "@app/modules/wait/mod.ts";
import markdownDocs from "@app/modules/markdown/mod.tsx";
import tailwind from "@app/middleware/tailwind/mod.ts";
import blogLayout from "@app/modules/blog/blog.layout.tsx";

const s = new Server();

s.use(tailwind());

s.group(waitModule);
s.use(markdownDocs(blogLayout, "post", "blog"));

await s.serve();
