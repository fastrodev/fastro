import fastro from "$fastro/mod.ts";
import { authModule } from "$fastro/modules/auth/auth.mod.tsx";

const f = new fastro();
f.group(authModule);

await f.serve();
