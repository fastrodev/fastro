import { DENO_VERSION, FASTRO_VERSION } from "../core/constant.ts";

export const docker = `FROM fastro/deno:${DENO_VERSION}
WORKDIR /app
USER deno
COPY . ./
RUN deno cache https://deno.land/x/fastro@v${FASTRO_VERSION}/mod.ts \\
    && deno cache https://deno.land/x/fastro@v${FASTRO_VERSION}/deps.ts \\
    && deno cache main.ts \\
    && deno cache services/hello.controller.ts \\
    && deno cache middleware/support.ts
CMD ["run", "-A", "--no-check", "main.ts"]
`;
