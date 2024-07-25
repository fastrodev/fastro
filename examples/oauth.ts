import fastro from "@app/mod.ts";
import { authModule } from "@app/auth/mod.tsx";

const f = new fastro();
f.group(authModule);

await f.serve();
