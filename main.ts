import "https://deno.land/std@0.182.0/dotenv/load.ts";
import { createPage } from "./pages/pages.ts";
import fastro from "./server/mod.ts";

async function init() {
  const f = fastro();
  f.flash(false);
  createPage(f);
  await f.serve();
}

await init();
