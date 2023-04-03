import { delay } from "https://deno.land/std@0.147.0/async/mod.ts";
import { markdownTable } from "https://esm.sh/markdown-table@3.0.2";

async function oha(url?: string) {
  const u = url ?? "http://localhost:9000";
  const args = [
    "-j",
    "--no-tui",
    "-z",
    "3m",
    u,
  ];
  console.log(`oha ${args.join().replaceAll(",", " ")}`);
  const command = new Deno.Command("oha", {
    args,
  });
  const { code, stdout, stderr } = await command.output();
  const err = new TextDecoder().decode(stderr);
  if (!err && code === 0) {
    const output = new TextDecoder().decode(stdout);
    return JSON.parse(output);
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

async function bench(server: string) {
  await delay(4000);
  Deno.run({
    cmd: ["deno", "task", `${server}`],
  });
  await delay(5000);
  let res;
  if (server === "params") {
    res = await oha("http://localhost:9000/agus?title=lead");
  } else {
    res = await oha();
  }

  await killServer();
  return {
    "module": server,
    "requestsPerSec": <number> res.summary.requestsPerSec,
  };
}

const server: string[] = [];

for await (const f of Deno.readDir("./examples")) {
  const [n] = f.name.split(".");
  server.push(n);
}

const res = [];
for (const file of server) {
  const r = await bench(file);
  res.push(r);
}

const table = res.sort((a, b) => b.requestsPerSec - a.requestsPerSec);
const max = table[0];

const t = table.map((v) => {
  const relative = (v.requestsPerSec / max.requestsPerSec) * 100;
  return [v.module, v.requestsPerSec.toFixed(2), relative.toFixed(0) + "%"];
});

let markdown = "";
markdown += `\n${
  markdownTable([
    ["module", "rps", "relative"],
    ...t,
  ])
}`;

await Deno.writeTextFile("bench/result.json", JSON.stringify(table));
await Deno.writeTextFile("bench/result.md", markdown);
