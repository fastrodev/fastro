// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import type { FormFile } from "../deps.ts";

export const FASTRO_VERSION = "0.30.6";
export const SERVICE_DIR = "services";
export const SERVICE_FILE = ".controller.ts";
export const STATIC_DIR = "public";
export const TEMPLATE_FILE = ".template.html";
export const TEMPLATE_DIR = "services";
export const MIDDLEWARE_DIR = "middleware";
export const MAX_MEMORY = 1024 * 1024;

export type ServerOptions = {
  cors?: boolean;
  prefix?: string;
  serviceDir?: string;
  staticDir?: string;
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

export type Query = {
  key: string;
  value: string;
};

export type Callback = (error?: Error) => void;
