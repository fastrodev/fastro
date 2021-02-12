// Copyright 2021 the Fastro author. All rights reserved. MIT license.
// deno-lint-ignore-file no-explicit-any

import type { FormFile } from "../deps.ts";

export type ServerOptions = {
  port?: number;
  hostname?: string;
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

export type DynamicPage = {
  url: string;
  page: {
    props: any;
    options: any;
    default: any;
  };
};

export type Data = {
  [key: string]: any;
};

export type Args = {
  [key: string]: any;
};

export type Query = {
  [key: string]: string;
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

export type App = {
  name: string;
  description: string;
  repository: string;
  screenshot: string;
  email: string;
  id: string;
};

export type Appdb = {
  n: string;
  d: string;
  r: string;
  s: string;
  e: string;
  i: string;
};

export type Page = { default: any; props: any; options: any };

export type Service = { default: any; options: any };

export type Middleware = { default: any; options: any };
