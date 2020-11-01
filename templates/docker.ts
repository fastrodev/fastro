import { DENO_VERSION, FASTRO_VERSION } from "../core/types.ts";

export const docker = `FROM fastro/deno:${DENO_VERSION}
WORKDIR /app
USER deno
COPY . ./
RUN deno cache https://raw.fastro.dev/v${FASTRO_VERSION}/mod.ts \\
    && deno cache https://raw.fastro.dev/v${FASTRO_VERSION}/deps.ts \\
    && deno cache main.ts \\
    && deno cache services/hello.controller.ts \\
    && deno cache middleware/support.ts
CMD ["run", "-A", "main.ts"]
`;
