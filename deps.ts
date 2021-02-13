// deno-lint-ignore-file no-explicit-any
export {
  decode as decodeBase64,
  encode as encodeBase64,
} from "https://deno.land/std@0.86.0/encoding/base64.ts";
export { decode } from "https://deno.land/std@0.86.0/encoding/utf8.ts";
export {
  parse as parseYml,
  stringify,
} from "https://deno.land/std@0.86.0/encoding/yaml.ts";
export { parse } from "https://deno.land/std@0.86.0/flags/mod.ts";
export { green, red, yellow } from "https://deno.land/std@0.86.0/fmt/colors.ts";
export * from "https://deno.land/std@0.86.0/http/cookie.ts";
export * from "https://deno.land/std@0.86.0/http/server.ts";
export * from "https://deno.land/std@0.86.0/mime/mod.ts";
export {
  assertEquals,
  assertStringIncludes,
  assertThrows,
} from "https://deno.land/std@0.86.0/testing/asserts.ts";
export { v4 } from "https://deno.land/std@0.86.0/uuid/mod.ts";
export { createElement } from "https://esm.sh/react";
export { renderToString } from "https://esm.sh/react-dom/server";
const container: { db: any } = {
  db: new Promise((resolve) => resolve("connected!")),
};
export default () => container;
