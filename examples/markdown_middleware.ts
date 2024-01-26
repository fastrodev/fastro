import markdown from "$fastro/middleware/markdown/mod.tsx";
import fastro from "$fastro/mod.ts";

const f = new fastro();

// default page:
// http://localhost:8000/blog/hello
f.use(markdown());

await f.serve();
