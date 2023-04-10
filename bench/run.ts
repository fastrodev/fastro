import { delay } from "https://deno.land/std@0.147.0/async/mod.ts";
import { markdownTable } from "https://esm.sh/markdown-table@3.0.2";

async function oha(url?: string) {
  const u = url ?? "http://localhost:9000";
  const args = [
    "-j",
    "--no-tui",
    "-z",
    "10s",
    u,
  ];
  const oh = `oha ${args.join().replaceAll(",", " ")}`;
  console.log(oh);
  const command = new Deno.Command("oha", {
    args,
  });
  const { code, stdout, stderr } = await command.output();
  const err = new TextDecoder().decode(stderr);
  if (!err && code === 0) {
    const output = new TextDecoder().decode(stdout);
    const o = JSON.parse(output);
    o["oha"] = oh;
    return o;
  }
}

async function killServer() {
  const l = Deno.run({
    cmd: [`lsof`, `-t`, `-i:9000`],
    stdout: "piped",
    stderr: "piped",
    stdin: "null",
  });

  const pid = JSON.parse(new TextDecoder().decode(await l.output()));
  const c = Deno.run({ cmd: ["kill", "-9", `${pid}`] });
  await c.status();
  await delay(1000);
}

async function bench(server: string, ext: string) {
  await delay(500);
  Deno.run({
    cmd: ["deno", "task", `${server}`],
  });
  await delay(500);
  let res;
  if (server === "params") {
    const url = "http://localhost:9000/agus?title=lead";
    res = await oha(url);
  } else {
    res = await oha();
  }

  await killServer();
  return {
    ext,
    module: server,
    requestsPerSec: <number> res.summary.requestsPerSec,
    oha: res.oha,
  };
}

await delay(60 * 1000);

const server: { name: string; ext: string }[] = [];

for await (const f of Deno.readDir("./examples")) {
  const [name, ext] = f.name.split(".");
  server.push({ name, ext });
}

const res = [];
for (const f of server) {
  const r = await bench(f.name, f.ext);
  res.push(r);
}

const table = res.sort((a, b) => b.requestsPerSec - a.requestsPerSec);
const max = table[0];

const t = table.map((v) => {
  const relative = (v.requestsPerSec / max.requestsPerSec) * 100;
  const m = `[${v.module}](/examples/${v.module}.${v.ext})`;
  return [
    m,
    v.requestsPerSec.toFixed(2),
    relative.toFixed(0) + "%",
    `\`${v.oha}\``,
  ];
});

let markdown = `# Benchmarks`;
markdown += `\n${
  markdownTable([
    ["module", "rps", "relative", "cmd"],
    ...t,
  ])
}`;

await Deno.writeTextFile("bench/result.json", JSON.stringify(table));
await Deno.writeTextFile("bench/result.md", markdown);
