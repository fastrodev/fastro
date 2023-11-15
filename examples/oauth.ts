import fastro from "$fastro/mod.ts";
import { authModule } from "$fastro/modules/auth.tsx";

const f = new fastro();
f.register(authModule);

await f.serve();
