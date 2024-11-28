// deno-lint-ignore-file no-explicit-any
import { kv, reset } from "@app/utils/db.ts";
import { parseArgs } from "jsr:@std/cli/parse-args";

const flags = parseArgs(Deno.args, {
  boolean: ["deploy"],
});

let k: Deno.Kv;
if (flags.deploy) {
  k = await Deno.openKv(
    `https://api.deno.com/databases/${Deno.env.get("DATABASE_ID")}/connect`,
  );
} else {
  k = kv;
}

const cmd = Deno.args[0];
if (cmd === "reset") {
  await reset();
}

if (cmd === "list") {
  if (flags.deploy) {
    const args = Deno.args[2];
    const key = args ? [args] : [];
    getAll(k, key);
  } else {
    const args = Deno.args[1];
    const key = args ? [args] : [];
    getAll(k, key);
  }
}

if (cmd === "delete") {
  if (flags.deploy) {
    const args = Deno.args[2];
    const key = args ? [args] : [];
    del(k, key);
  } else {
    const args = Deno.args[1];
    const key = args ? [args] : [];
    del(k, key);
  }
}

async function getAll(kv: Deno.Kv, key: any) {
  console.log("key", key);
  const entries = kv.list({ prefix: key });
  for await (const entry of entries) {
    console.log(`[${entry.key}]:`, entry.value);
  }
}

async function del(k: Deno.Kv, key: any) {
  const iter = k.list({ prefix: key });
  const promises = [];
  for await (const res of iter) promises.push(kv.delete(res.key));
  await Promise.all(promises);
}
