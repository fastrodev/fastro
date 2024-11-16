import { kv, reset } from "@app/utils/db.ts";

const args = Deno.args[0];
if (args === "reset") {
    await reset();
}

if (args === "deploy") {
    const kd = await Deno.openKv(
        "https://api.deno.com/databases/8ce5f998-0c99-465e-971b-b8911d896fed/connect",
    );

    getAll(kd);
} else {
    getAll(kv);
}

async function getAll(kv: Deno.Kv) {
    const key = args ? [args] : [];
    const entries = kv.list({ prefix: key });

    for await (const entry of entries) {
        console.log(`[${entry.key}]:`, entry.value);
    }
}
