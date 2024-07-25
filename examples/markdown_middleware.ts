import markdown from "@app/middleware/markdown/mod.tsx";
import fastro from "@app/mod.ts";

const f = new fastro();

// default page:
// http://localhost:8000/blog/hello
f.use(markdown());

await f.serve();
