import { kv, reset } from "@app/utils/db.ts";

const args = Deno.args[0];
if (args === "reset") {
    await reset();
}

const key = args ? [args] : [];
const entries = kv.list({ prefix: key });

for await (const entry of entries) {
    console.log(`[${entry.key}]:`, entry.value);
}
