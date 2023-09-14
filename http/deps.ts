import { renderToString as rtsProd } from "react-dom/server";
import { renderToString as rtsDev } from "react-dom/server?dev";
const renderToString = Deno.env.get("ENV") === "DEVELOPMENT" ? rtsDev : rtsProd;
export { renderToString };

export { toHashString } from "https://deno.land/std@0.201.0/crypto/to_hash_string.ts";
export {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.201.0/http/http_status.ts";
export * from "https://deno.land/std@0.201.0/media_types/mod.ts";
export * from "https://deno.land/std@0.201.0/path/mod.ts";

export type {
  ConnInfo,
  Handler,
} from "https://deno.land/std@0.201.0/http/server.ts";
