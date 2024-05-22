import { delay } from "jsr:@std/async@0.210.0";
import { markdownTable } from "https://esm.sh/markdown-table@3.0.2";
const time = 10;

async function oha(url?: string) {
  const u = url ?? "http://localhost:8000";
  const args = [
    "-j",
    "--no-tui",
    "-z",
    `${time}s`,
    u,
  ];
  const oh = `oha ${args.join().replaceAll(",", " ")}`;
  const command = new Deno.Command("oha", { args });
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
  const l = new Deno.Command("lsof", {
    args: [
      "-t",
      "-i:8000",
    ],
    stdin: "null",
    stdout: "piped",
    stderr: "piped",
  });

  try {
    const o = await l.output();
    if (o && o.success) {
      const pid = JSON.parse(new TextDecoder().decode(o.stdout));

      const c = new Deno.Command("kill", {
        args: [
          "-9",
          `${pid}`,
        ],
      });

      await c.output();
      await delay(1000);
    }
  } catch (error) {
    console.log(error);
  }
}

async function bench(server: string, ext: string) {
  await delay(1000);

  const d = new Deno.Command("deno", {
    args: [
      "task",
      `${server}`,
    ],
  });

  d.spawn();

  let res;
  if (server === "group") {
    const url = "http://localhost:8000/api/user";
    res = await oha(url);
  } else if (server === "markdown_middleware") {
    const url = "http://localhost:8000/blog/hello";
    res = await oha(url);
  } else if (server === "deno_kv") {
    const url = "http://localhost:8000/user\?name\=john";
    res = await oha(url);
  } else if (server === "static_file_string") {
    const url = "http://localhost:8000/static/tailwind.css";
    res = await oha(url);
  } else if (server === "static_file_image") {
    const url = "http://localhost:8000/static/favicon.ico";
    res = await oha(url);
  } else if (server === "params_query") {
    const url = "http://localhost:8000/agus\?title\=lead";
    res = await oha(url);
  } else {
    res = await oha();
  }

  await killServer();
  return {
    ext,
    module: server,
    requestsPerSec: <number> res.summary.requestsPerSec,
    oha: `\`${res.oha}\``,
  };
}

const server: { name: string; ext: string }[] = [];

for await (const f of Deno.readDir("./examples")) {
  const [name, ext] = f.name.split(".");
  server.push({ name, ext });
}

const res = [];
for (const f of server) {
  console.log(f);
  const r = await bench(f.name, f.ext);
  res.push(r);
}

const table = res.sort((a, b) => b.requestsPerSec - a.requestsPerSec);
const max = table[0];

const t = table.map((v) => {
  const relative = (v.requestsPerSec / max.requestsPerSec) * 100;
  const m =
    `[${v.module}](https://github.com/fastrodev/fastro/blob/main/examples/${v.module}.${v.ext})`;
  return [
    m,
    v.requestsPerSec.toFixed(0),
    relative.toFixed(0) + "%",
    v.oha,
  ];
});

let markdown = `---
title: "Benchmarks"
description: This is the final output of an internal benchmark run in github action
image: https://fastro.dev/fastro.png
---

This is the final output of an internal benchmark run in [github action](https://github.com/fastrodev/fastro/actions) on \`${
  new Date().toLocaleString()
}\`. It consists of several simple applications for [specific purpose](https://github.com/fastrodev/fastro/blob/main/deno.json). Each is then accessed by the [OHA](https://github.com/hatoo/oha) within ${time}s. The results are then sorted by the fastest.

You can find the benchmark script in this code: [run.ts](https://github.com/fastrodev/fastro/blob/main/bench/run.ts)

## Benchmark results

`;
markdown += `\n${
  markdownTable([
    ["module", "rps", "%", "oha cmd"],
    ...t,
  ], { align: ["l", "r", "r", "l"] })
}`;

await Deno.writeTextFile("docs/benchmarks.md", markdown);
