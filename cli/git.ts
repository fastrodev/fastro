// Copyright 2020 the Fastro author. All rights reserved. MIT license.
// deno-lint-ignore-file

import { App, Appdb } from "../core/types.ts";
import { parseYml, stringify, v4 } from "../deps.ts";

const cwd = Deno.cwd() + "/.fastro";
const database = ".fastro/database.yml";
const appFile = ".fastro/app.yml";

async function gitAdd() {
  const p = Deno.run({
    cwd,
    cmd: [
      "git",
      "add",
      "database.yml",
    ],
  });

  const { code } = await p.status();
  if (code !== 0) throw new Error("Add app error");
}

async function gitDiscard() {
  const p = Deno.run({
    cwd,
    cmd: [
      "git",
      "checkout",
      "--",
      "app.yml",
    ],
  });

  const { code } = await p.status();
  if (code !== 0) throw new Error("Discard app error");
}

async function gitCommit() {
  const p = Deno.run({
    cwd,
    cmd: [
      "git",
      "commit",
      "-am",
      "update",
    ],
  });

  const { code } = await p.status();
  if (code !== 0) throw new Error("Commit app error");
}

async function gitPush() {
  const p = Deno.run({
    cwd,
    cmd: [
      "git",
      "push",
    ],
  });

  const { code } = await p.status();
  if (code !== 0) throw new Error("Push app error");
}

async function gitGetEmail() {
  const p = Deno.run({
    cmd: [
      "git",
      "config",
      "user.email",
    ],
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await p.status();
  if (code !== 0) throw new Error("Get email error");
  const rawOutput = await p.output();
  let str = new TextDecoder().decode(rawOutput);
  str = str.trim();
  return str;
}

async function getApp() {
  const apps = await Deno.readTextFile(database);
  const appList = parseYml(apps) as Appdb[];
  return appList;
}

function writeFile(data: string) {
  Deno.writeTextFile(database, data)
    .then(() => gitDiscard())
    .then(() => gitAdd())
    .then(() => gitCommit())
    .then(() => gitPush());
}

function sortApp(appList: Appdb[]) {
  const sorted = appList.sort((a: Appdb, b: Appdb) => {
    return ("" + a.n).localeCompare(b.n);
  });

  return sorted as any;
}

function validateApp(app: Appdb) {
  if (app.n === undefined || app.n === null) {
    throw new Error("Your app name is empty");
  }
  if (app.r === undefined || app.r === null) {
    throw new Error("Your app repository is empty");
  }
}

function isExist(newApp: Appdb, appList: Appdb[]) {
  const exist = appList.filter((regApp) => {
    return newApp.r === regApp.r || newApp.n === regApp.n;
  });

  return exist.length > 0;
}

async function addApp(app: Appdb) {
  try {
    validateApp(app);
    const appList = await getApp();
    if (isExist(app, appList)) {
      throw new Error(
        "The application already exists. Use a different name or repository.",
      );
    }
    if (appList) appList.push(app);
    const sorted = sortApp(appList);
    const yaml = stringify(sorted, { noCompatMode: true, condenseFlow: true });
    writeFile(yaml);
  } catch (error) {
    console.error(error.message);
  }
}

export async function handleAddApp() {
  const appYaml = Deno.readTextFileSync(appFile);
  const app = parseYml(appYaml) as App;
  app.email = await gitGetEmail();
  app.id = v4.generate();
  const appdb: Appdb = {
    n: app.name,
    d: app.description,
    r: app.repository,
    s: app.screenshot,
    e: app.email,
    i: app.id,
  };
  addApp(appdb);
}
