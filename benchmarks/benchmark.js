const path = require("path");
const { execSync } = require("child_process");

const cwd = process.cwd();

const express = `node express &`;
const fastify = `node fastify &`;
const oak = `deno run --allow-net oak.ts &`;
const abc = `deno run --allow-net abc.ts &`;
const fastro = `deno run --allow-net fastro.ts &`;
const deno_http = `deno run --allow-net deno_http.ts &`;
const kill_server = `
lsof -ti tcp:3000 | xargs kill &
lsof -ti tcp:3001 | xargs kill &
lsof -ti tcp:3002 | xargs kill &
lsof -ti tcp:3003 | xargs kill &
lsof -ti tcp:3004 | xargs kill &
lsof -ti tcp:3005 | xargs kill &
`;

const start = () => {
  execSync(express, { stdio: [0, 1, 2], cwd });
  execSync(fastify, { stdio: [0, 1, 2], cwd });
  execSync(oak, { stdio: [0, 1, 2], cwd });
  execSync(fastro, { stdio: [0, 1, 2], cwd });
  execSync(abc, { stdio: [0, 1, 2], cwd });
  execSync(deno_http, { stdio: [0, 1, 2], cwd });
};

const compare = () => {
  const autocannon = require("autocannon");

  autocannon({
    title: "fastro",
    url: "http://localhost:3000",
    connections: 50,
    pipelining: 1,
    duration: 10,
  }, console.log);

  autocannon({
    title: "express",
    url: "http://localhost:3001",
    connections: 50,
    pipelining: 1,
    duration: 10,
  }, console.log);

  autocannon({
    title: "fastify",
    url: "http://localhost:3002",
    connections: 50,
    pipelining: 1,
    duration: 10,
  }, console.log);

  autocannon({
    title: "oak",
    url: "http://localhost:3003",
    connections: 50,
    pipelining: 1,
    duration: 10,
  }, console.log);

  autocannon({
    title: "abc",
    url: "http://localhost:3004",
    connections: 50,
    pipelining: 1,
    duration: 10,
  }, console.log);

  autocannon({
    title: "deno_http",
    url: "http://localhost:3005",
    connections: 50,
    pipelining: 1,
    duration: 10,
  }, console.log);
};

const kill = () => {
  execSync(kill_server, { stdio: [0, 1, 2], cwd });
};

const [node, cmd, arg] = process.argv;

if (!arg) {
  console.log("benchmark");
}

if (arg === "start") start();
if (arg === "kill") kill();
if (arg === "compare") compare();
