// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import type { FormFile } from "../deps.ts";

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
