// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import type { FormFile } from "../deps.ts";

export const FASTRO_VERSION = "0.30.2";
export const SERVICE_DIR = "services";
export const SERVICE_FILE = "controller.ts";
export const MAX_MEMORY = 1024 * 1024;

export type ServerOptions = {
  prefix?: string;
  serviceDir?: string;
  cors?: boolean;
};

export type ListenOptions = {
  port?: number;
  hostname?: string;
};

export type MultiPartData = {
  key: string;
  value: string | FormFile | FormFile[] | undefined;
  filename?: string;
};

export type DynamicService = {
  url: string;
  // deno-lint-ignore no-explicit-any
  service: any;
};
