// Copyright 2021 the Fastro author. All rights reserved. MIT license.
// deno-lint-ignore-file no-explicit-any

import {
  APPS,
  MIDDLEWARE_DIR,
  SERVICE_DIR,
  STATIC_DIR,
  VSCODE_DIR,
} from "../core/constant.ts";
import { App } from "../core/types.ts";
import { parseYml } from "../deps.ts";
import { controller } from "../templates/controller.ts";
import { docker } from "../templates/docker.ts";
import { favicon } from "../templates/favicon.ts";
import { gae } from "../templates/gae.ts";
import { gitignore } from "../templates/gitignore.ts";
import { html } from "../templates/html.ts";
import { main } from "../templates/main.ts";
import { middleware } from "../templates/middleware.ts";
import {
  component as comp,
  react as reactTemplate,
} from "../templates/react.ts";
import { render } from "../templates/render.ts";
import { setting } from "../templates/settings.ts";

function initHelp() {
  const message = `USAGE
  fastro init [OPTIONS]

OPTIONS:
  --app Application repository

EXAMPLE:
  fastro init --app fastrojs/admin
`;
  console.log(message);
}

async function cloneRepo(app: string) {
  const p = Deno.run({
    cmd: [
      "git",
      "clone",
      `https://github.com/${app}.git`,
      ".",
    ],
  });

  const { code } = await p.status();
  if (code !== 0) throw new Error("Clone app error");
}

async function removeGit() {
  const p = Deno.run({
    cmd: [
      "rm",
      "-rf",
      ".git",
    ],
  });

  const { code } = await p.status();
  if (code !== 0) throw new Error("Init app error");
}

function filterAppList(appList: App[], app: string) {
  const exist = appList.filter((val) => val.repository === app);
  if (exist.length < 1) throw new Error("App not found");
}

async function getApp() {
  const result = await fetch(APPS);
  const apps = await result.text();
  const appList = parseYml(apps) as App[];
  return appList;
}

function initApp(app: string) {
  getApp()
    .then((appList) => filterAppList(appList, app))
    .then(() => cloneRepo(app))
    .then(() => removeGit())
    .then(() => console.log("Init app done"))
    .catch((error) => console.error(error.message));
}

export async function init(args?: any) {
  if (args.help) return initHelp();
  if (args.app) return initApp(args.app);

  const encoder = new TextEncoder();

  const mainFile = encoder.encode(main);
  await Deno.writeFile("main.ts", mainFile);

  const gitFile = encoder.encode(gitignore);
  await Deno.writeFile(".gitignore", gitFile);

  const dockerFile = encoder.encode(docker);
  await Deno.writeFile("Dockerfile", dockerFile);

  const appyaml = encoder.encode(gae);
  await Deno.writeFile("app.yaml", appyaml);

  await Deno.mkdir(MIDDLEWARE_DIR, { recursive: true });
  const mid = encoder.encode(middleware);
  const midPath = `${MIDDLEWARE_DIR}/support.ts`;
  await Deno.writeFile(midPath, mid);

  await Deno.mkdir(SERVICE_DIR, { recursive: true });
  const ctrl = encoder.encode(controller);
  const ctrlPath = `${SERVICE_DIR}/hello.controller.ts`;
  await Deno.writeFile(ctrlPath, ctrl);

  const htmlTemplate = encoder.encode(render);
  const templatePath = `${SERVICE_DIR}/hello.template.html`;
  await Deno.writeFile(templatePath, htmlTemplate);

  const component = encoder.encode(comp);
  const componentPath = `${SERVICE_DIR}/react.page.tsx`;
  await Deno.writeFile(componentPath, component);

  const react = encoder.encode(reactTemplate);
  const reactPath = `${SERVICE_DIR}/react.template.html`;
  await Deno.writeFile(reactPath, react);

  await Deno.mkdir(STATIC_DIR, { recursive: true });
  const icon = new Uint8Array(favicon);
  const iconPath = `${STATIC_DIR}/favicon.ico`;
  await Deno.writeFile(iconPath, icon);

  const idx = encoder.encode(html);
  const idxPath = `${STATIC_DIR}/index.html`;
  await Deno.writeFile(idxPath, idx);

  await Deno.mkdir(`${VSCODE_DIR}`, { recursive: true });
  const settingJson = encoder.encode(setting);
  const settingPath = `${VSCODE_DIR}/settings.json`;
  await Deno.writeFile(settingPath, settingJson);
}
