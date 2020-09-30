// Copyright 2020 the Fastro author. All rights reserved. MIT license.

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
