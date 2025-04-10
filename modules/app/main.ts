import Server from "@app/mod.ts";
import waitModule from "@app/modules/wait/mod.ts";
import markdownDocs from "@app/modules/markdown/mod.tsx";
import tailwind from "@app/middleware/tailwind/mod.ts";
import blogLayout from "@app/modules/blog/blog.layout.tsx";
import docsLayout from "@app/modules/docs/docs.layout.tsx";
import blog from "@app/modules/blog/mod.ts";
import docs from "@app/modules/docs/mod.ts";
import authModule from "@app/modules/auth/mod.tsx";
import homeModule from "@app/modules/home/mod.ts";

const s = new Server();

s.use(tailwind());

s.use(markdownDocs(blogLayout, "post", "blog"));
s.use(markdownDocs(docsLayout, "docs", "docs"));

s.group(waitModule);
s.group(blog);
s.group(docs);
s.group(authModule);
s.group(homeModule);

await s.serve();
