import { FASTRO_VERSION } from "../core/constant.ts";

export const depsTemplate =
  `export * from "https://deno.land/x/fastro@v${FASTRO_VERSION}/mod.ts";
export { React };
import * as React from "https://esm.sh/react@17.0.1";

`;
