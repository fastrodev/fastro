const dev = Deno.env.get("DENO_DEPLOYMENT_ID") === undefined;

const ReactDOMServer = dev
  ? await import("https://esm.sh/react-dom@18.2.0/server?dev")
  : await import("https://esm.sh/react-dom@18.2.0/server");

const React = dev
  ? await import("https://esm.sh/react@18.2.0?dev")
  : await import("https://esm.sh/react@18.2.0");

const h = React.createElement;

export { h, React, ReactDOMServer };

export { toHashString } from "https://deno.land/std@0.198.0/crypto/to_hash_string.ts";
export {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.198.0/http/http_status.ts";
export * from "https://deno.land/std@0.198.0/media_types/mod.ts";
export * from "https://deno.land/std@0.198.0/path/mod.ts";

export { serve, Server } from "https://deno.land/std@0.198.0/http/server.ts";
export type {
  ConnInfo,
  Handler,
} from "https://deno.land/std@0.198.0/http/server.ts";
export {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.198.0/testing/asserts.ts";
