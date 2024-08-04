import Server from "@app/mod.ts";
import markdownDocs from "@app/modules/markdown/mod.tsx";
import blogLayout from "@app/modules/blog/blog.layout.tsx";
import docsLayout from "@app/modules/docs/docs.layout.tsx";
import blog from "@app/modules/blog/mod.ts";
import docs from "@app/modules/docs/mod.ts";
import index from "@app/modules/index/mod.ts";
import tailwind from "@app/middleware/tailwind/mod.ts";
import authModule from "@app/modules/auth/mod.tsx";
import adminModule from "@app/modules/admin/mod.ts";
import github from "@app/middleware/github/mod.ts";

const s = new Server();

/** markdown with default folder and prefix */
s.use(markdownDocs(blogLayout, "post", "blog"));

/** markdown with 'docs' folder and prefix */
s.use(markdownDocs(docsLayout, "docs", "docs"));

/** setup tailwind */
s.use(tailwind());

/** proxy for github repo */
s.use(github);

s.group(index);
s.group(blog);
s.group(docs);
s.group(authModule);
s.group(adminModule);

s.serve();
