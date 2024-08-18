import { kv } from "@app/utils/db.ts";

function replacer(_key: unknown, value: unknown) {
    return typeof value === "bigint" ? value.toString() : value;
}

const items = await Array.fromAsync(
    kv.list({ prefix: [] }),
    ({ key, value }) => ({ key, value }),
);
console.log(JSON.stringify(items, replacer, 2));

kv.close();
