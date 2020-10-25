import { FASTRO_VERSION } from "../core/types.ts";

export const main =
  `import { Fastro } from "https://raw.fastro.dev/v${FASTRO_VERSION}/mod.ts";
new Fastro().listen({ port: 8080 });
`;
