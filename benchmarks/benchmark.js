const path = require("path");
const { execSync } = require("child_process");

const oak_version = "4.0.0";
const express_version = "4.17.1";
const fastro_version = "0.7.0";
const abc_version = "1.0.0-rc10";
const deno_version = "1.0.5";
const node_version = "14.3.0";
const fastify_version = "2.14.1";
const php_version = "7.3.11";
const flask_version = "1.1.2";

const cwd = process.cwd();

const start = () => {
  const express = `node express &`;
  const fastify = `node fastify &`;
  const node = `node node_http &`;
  const oak = `deno run --allow-net oak.ts &`;
  const abc = `deno run --allow-net abc.ts &`;
  const fastro = `deno run --allow-net fastro.ts &`;
  const deno_http = `deno run --allow-net deno_http.ts &`;

  execSync(express, { stdio: [0, 1, 2], cwd });
  execSync(fastify, { stdio: [0, 1, 2], cwd });
  execSync(oak, { stdio: [0, 1, 2], cwd });
  execSync(fastro, { stdio: [0, 1, 2], cwd });
  execSync(abc, { stdio: [0, 1, 2], cwd });
  execSync(deno_http, { stdio: [0, 1, 2], cwd });
  execSync(node, { stdio: [0, 1, 2], cwd });
};

const compare = async () => {
  const abc = `npx autocannon -c100 -j localhost:3004 > benchmark_abc.json`;
  const deno = `npx autocannon -c100 -j localhost:3005 > benchmark_deno.json`;
  const express =
    `npx autocannon -c100 -j localhost:3001 > benchmark_express.json`;
  const fastify =
    `npx autocannon -c100 -j localhost:3002 > benchmark_fastify.json`;
  const fastro =
    `npx autocannon -c100 -j localhost:3000 > benchmark_fastro.json`;
  const oak = `npx autocannon -c100 -j localhost:3003 > benchmark_oak.json`;
  const node = `npx autocannon -c100 -j localhost:3006 > benchmark_node.json`;
  const php =
    `npx autocannon -c100 -j localhost:80/index.php > benchmark_php.json`;
  const flask = `npx autocannon -c100 -j localhost:5000 > benchmark_flask.json`;

  await execSync(php, { stdio: [0, 1, 2], cwd });
  await execSync(flask, { stdio: [0, 1, 2], cwd });
  await execSync(abc, { stdio: [0, 1, 2], cwd });
  await execSync(deno, { stdio: [0, 1, 2], cwd });
  await execSync(express, { stdio: [0, 1, 2], cwd });
  await execSync(fastify, { stdio: [0, 1, 2], cwd });
  await execSync(fastro, { stdio: [0, 1, 2], cwd });
  await execSync(oak, { stdio: [0, 1, 2], cwd });
  await execSync(node, { stdio: [0, 1, 2], cwd });
};

const kill = () => {
  const kill_server = `
lsof -ti tcp:3000 | xargs kill &
lsof -ti tcp:3001 | xargs kill &
lsof -ti tcp:3002 | xargs kill &
lsof -ti tcp:3003 | xargs kill &
lsof -ti tcp:3004 | xargs kill &
lsof -ti tcp:3005 | xargs kill &
lsof -ti tcp:3006 | xargs kill &
lsof -ti tcp:5000 | xargs kill &
`;
  execSync(kill_server, { stdio: [0, 1, 2], cwd });
};

/** compile benchmark data and display them to readme */
const compile = () => {
  const { requests: { average: abc } } = require("./benchmark_abc.json");
  const { requests: { average: deno } } = require("./benchmark_deno.json");
  const { requests: { average: fastify } } = require(
    "./benchmark_fastify.json",
  );
  const { requests: { average: express } } = require(
    "./benchmark_express.json",
  );
  const { requests: { average: fastro } } = require("./benchmark_fastro.json");
  const { requests: { average: oak } } = require("./benchmark_oak.json");
  const { requests: { average: node } } = require("./benchmark_node.json");
  const { requests: { average: php } } = require("./benchmark_php.json");
  const { requests: { average: flask } } = require("./benchmark_flask.json");

  const abc_item = {
    text: "| [Abc](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/abc.ts) | ${abc_version} | &#10003; | ${abc} |",
    value: abc
  }
  const deno_item = {
    text: "| [Deno http](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/deno_http.ts) | ${deno_version} | &#10007; | ${deno_http} |",
    value: deno
  }
  const express_item = {
    text: "| [Express](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/express.js) | ${express_version} | &#10003; | ${express} |",
    value: express
  }
  const fastify_item = {
    text: "| [Fastify](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/fastify.js) | ${fastify_version} | &#10003; | ${fastify} |",
    value: fastify
  }
  const fastro_item = {
    text: "| [**Fastro**](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/fastro.ts) | **${fastro_version}** | **&#10003;** | **${fastro}**  |",
    value: fastro
  }
  const node_item = {
    text: "| [Node http](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/node_http.js) | ${node_version} | &#10007; | ${node} |",
    value: node
  }
  const oak_item = {
    text: "| [Oak](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/oak.ts) | ${oak_version} | &#10003; | ${oak} |",
    value: oak
  }
  const php_item = {
    text: "| [PHP](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/index.php) | ${php_version} | &#10007; | ${php} |",
    value: php
  }
  const flask_item = {
    text: "| [Python Flask](https://github.com/fastrojs/fastro-server/blob/master/benchmarks/flask_app.py) | ${flask_version} | &#10003; | ${flask} |",
    value: flask
  }
  const dataList = [express_item, abc_item, flask_item, deno_item, fastify_item, fastro_item, node_item, oak_item, php_item]
  let text = ''
  dataList.sort((a, b)=>{
    return b.value - a.value
  }).forEach(item => {
    text = text
      .concat(item.text)
      .concat("\n")
  })

  const fs = require("fs");

  const data = fs.readFileSync(
    "./_template.md",
    { encoding: "utf8", flag: "r" },
  );

  const final = data.replace("${text}", text)
    .replace("${abc}", abc)
    .replace("${deno_http}", deno)
    .replace("${express}", express)
    .replace("${fastify}", fastify)
    .replace("${fastro}", fastro)
    .replace("${oak}", oak)
    .replace("${node}", node)
    .replace("${php}", php)
    .replace("${flask}", flask)
    .replace("${oak_version}", oak_version)
    .replace("${express_version}", express_version)
    .replace("${abc_version}", abc_version)
    .replace("${deno_version}", deno_version)
    .replace("${node_version}", node_version)
    .replace("${fastify_version}", fastify_version)
    .replace("${php_version}", php_version)
    .replace("${fastro_version}", fastro_version)
    .replace("${fastro_version}", fastro_version)
    .replace("${fastro_version}", fastro_version)
    .replace("${fastro_version}", fastro_version)
    .replace("${flask_version}", flask_version);

  fs.writeFile("../readme.md", final, function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
};

const [node, cmd, arg] = process.argv;

if (!arg) {
  console.log("benchmark");
}

if (arg === "start") start();
if (arg === "kill") kill();
if (arg === "compare") compare();
if (arg === "compile") compile();
