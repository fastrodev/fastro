// Copyright 2020 the Fastro author. All rights reserved. MIT license.
// deno-lint-ignore-file no-explicit-any

import {
  MIDDLEWARE_DIR,
  SERVICE_DIR,
  STATIC_DIR,
  VSCODE_DIR,
} from "../core/constant.ts";
import { main } from "../templates/main.ts";
import { favicon } from "../templates/favicon.ts";
import { render } from "../templates/render.ts";
import { docker } from "../templates/docker.ts";
import { html } from "../templates/html.ts";
import { middleware } from "../templates/middleware.ts";
import { controller } from "../templates/controller.ts";
import { setting } from "../templates/settings.ts";
import { gitignore } from "../templates/gitignore.ts";

function initHelp() {
  console.log("init help");
}

async function getApp(app: string) {
  const result = await fetch(
    "https://raw.githubusercontent.com/fastrojs/app/main/app.yml",
  );
  const text = await result.text();
}

async function cloneRepo(app: string) {
  const p = Deno.run({
    cmd: [
      "git",
      "clone",
      `https://github.com/fastroapp/${app}.git`,
      ".",
    ],
  });

  const { code } = await p.status();
  if (code !== 0) console.error({ message: "Clone app error" });
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
  if (code !== 0) console.error({ message: "Init app error" });
}

function initApp(app: string) {
  getApp(app)
    .then(() => cloneRepo(app))
    .then(() => removeGit())
    .then(() => console.log("Init app done"));
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
