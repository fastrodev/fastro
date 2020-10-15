// deno-lint-ignore-file
// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import type { FormFile } from "../deps.ts";

export const DOCKER_VERSION = "1.4.5";
export const FASTRO_VERSION = "0.30.8";
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
  service: any;
};

export type Query = {
  key: string;
  value: string;
};

export type Callback = (error?: Error) => void;

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type HandlerOptions = {
  params?: boolean;
  methods?: HttpMethod[];
  validationSchema?: ValidationSchema;
  prefix?: string;
};

export type SchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "null";

export type Schema = {
  type: SchemaType;
  properties?: {
    [key: string]: Schema;
  };
  required?: string[];
  // default?: any;
  // pattern?: string;
  // maxLength?: number;
  // minLength?: number;
  // minimum?: number;
  // maximum?: number;
  // multipleOf?: number;
  // maxItems?: number;
  // minItems?: number;
  // uniqueItems?: boolean;
  // contains?: { type: SchemaType };
  items?: Schema[];
  // not?: Schema[];
  // anyOf?: Schema[];
  // oneOf?: Schema[];
  // allOf?: Schema[];
  // enum?: any;
};

export type ValidationSchema = {
  body?: Schema;
  params?: Schema;
  headers?: Schema;
  querystring?: Schema;
};
