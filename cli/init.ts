// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import {
  MIDDLEWARE_DIR,
  SERVICE_DIR,
  STATIC_DIR,
  VSCODE_DIR,
} from "../core/types.ts";
import { favicon } from "../templates/favicon.ts";
import { render } from "../templates/render.ts";
import { docker } from "../templates/docker.ts";
import { html } from "../templates/html.ts";
import { svg } from "../templates/svg.ts";
import { middleware } from "../templates/middleware.ts";
import { controller } from "../templates/controller.ts";
import { setting } from "../templates/settings.ts";

function initHelp() {
  console.log("init help");
}

// deno-lint-ignore no-explicit-any
export async function init(args?: any) {
  if (args.help) return initHelp();
  const encoder = new TextEncoder();

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
  const logo = encoder.encode(svg);
  const logoPath = `${STATIC_DIR}/logo.svg`;
  await Deno.writeFile(logoPath, logo);

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
