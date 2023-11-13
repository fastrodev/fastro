import { createElement as ceDev } from "https://esm.sh/v133/react@18.2.0?dev";
import { createElement as ceProd } from "https://esm.sh/v133/react@18.2.0";
import {
  renderToReadableStream as rtrsProd,
} from "https://esm.sh/v133/react-dom@18.2.0/server?no-dts";
import {
  renderToReadableStream as rtrsDev,
} from "https://esm.sh/v133/react-dom@18.2.0/server?dev&no-dts";
const createElement = Deno.env.get("ENV") === "DEVELOPMENT" ? ceDev : ceProd;
const renderToReadableStream = Deno.env.get("ENV") === "DEVELOPMENT"
  ? rtrsDev
  : rtrsProd;

export { createElement, renderToReadableStream };

export { encodeHex } from "https://deno.land/std@0.206.0/encoding/hex.ts";

export {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.206.0/http/status.ts";

export * from "https://deno.land/std@0.206.0/media_types/mod.ts";
export * from "https://deno.land/std@0.206.0/path/mod.ts";
