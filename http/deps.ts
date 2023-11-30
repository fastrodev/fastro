import { createElement } from "react";
import { renderToReadableStream as rtrsProd } from "react-dom/server?no-dts";
import { renderToReadableStream as rtrsDev } from "react-dom/server?dev&no-dts";
const renderToReadableStream = Deno.env.get("ENV") === "DEVELOPMENT"
  ? rtrsDev
  : rtrsProd;

export { createElement, renderToReadableStream };

export { encodeHex } from "https://deno.land/std@0.208.0/encoding/hex.ts";

export {
  STATUS_CODE,
  STATUS_TEXT,
} from "https://deno.land/std@0.208.0/http/status.ts";

export * from "https://deno.land/std@0.208.0/media_types/mod.ts";
export * from "https://deno.land/std@0.208.0/path/mod.ts";
