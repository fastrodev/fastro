// Copyright 2020 the Fastro author. All rights reserved. MIT license.

export * from "./validator.ts";

export function createError(name: string, error: Error) {
  error.name = name;
  return error;
}

export function getErrorTime() {
  const date = new Date();
  const time =
    `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.toLocaleTimeString()}`;
  return time;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function replaceAll(target: string, term: string, replacement: string) {
  return target.replace(new RegExp(escapeRegExp(term), "g"), replacement);
}
