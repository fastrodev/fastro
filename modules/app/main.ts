import Server from "@app/mod.ts";
import waitModule from "@app/modules/wait/mod.ts";
import tailwind from "@app/middleware/tailwind/mod.ts";
import storeModule from "@app/modules/store/mod.ts";

const s = new Server();
// Add tailwind middleware
s.use(tailwind());

// Add store and wait modules
s.group(storeModule);
s.group(waitModule);

await s.serve();
