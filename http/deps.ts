// deno-lint-ignore no-deprecated-deno-api
const ReactDOMServer = Deno.run === undefined
  ? await import("https://esm.sh/react-dom@18.2.0/server")
  : await import("https://esm.sh/react-dom@18.2.0/server?dev");

// deno-lint-ignore no-deprecated-deno-api
const React = Deno.run === undefined
  ? await import("https://esm.sh/react@18.2.0")
  : await import("https://esm.sh/react@18.2.0?dev");

const h = React.createElement;

export { h, React, ReactDOMServer };

export { toHashString } from "https://deno.land/std@0.194.0/crypto/to_hash_string.ts";
export {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.194.0/http/http_status.ts";
export * from "https://deno.land/std@0.194.0/media_types/mod.ts";
export * from "https://deno.land/std@0.194.0/path/mod.ts";

export { serve, Server } from "https://deno.land/std@0.194.0/http/server.ts";
export type {
  ConnInfo,
  Handler,
} from "https://deno.land/std@0.194.0/http/server.ts";
export { assertEquals } from "https://deno.land/std@0.194.0/testing/asserts.ts";
