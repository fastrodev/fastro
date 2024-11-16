import { kv } from "@app/utils/db.ts";

const key = Deno.args[0] ? [Deno.args[0]] : [];
const entries = kv.list({ prefix: key });
for await (const entry of entries) {
    console.log(`[${entry.key}]:`, entry.value);
}
