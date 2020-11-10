import { FASTRO_VERSION } from "../core/constant.ts";

export const main =
  `import { Fastro } from "https://raw.fastro.dev/v${FASTRO_VERSION}/mod.ts";
new Fastro({ port: 8080 });
`;
