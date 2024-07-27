import Server from "@app/mod.ts";
import { adminModule } from "@app/modules/admin/mod.ts";

const s = new Server();
s.group(adminModule);
s.serve();
