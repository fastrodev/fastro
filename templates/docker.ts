import { DOCKER_VERSION, FASTRO_VERSION } from "../core/types.ts";

export const docker = `FROM hayd/alpine-deno:${DOCKER_VERSION}

# This command will download all the necessary files and cache them 
# so they are not downloaded again when the application is restarted.
RUN deno cache https://raw.fastro.dev/v${FASTRO_VERSION}/deps.ts
RUN deno cache https://raw.fastro.dev/v${FASTRO_VERSION}/mod.ts
RUN deno cache https://raw.fastro.dev/v${FASTRO_VERSION}/core/server.ts
RUN deno cache https://raw.fastro.dev/v${FASTRO_VERSION}/core/request.ts
RUN deno cache https://raw.fastro.dev/v${FASTRO_VERSION}/core/cookie.ts
RUN deno cache https://raw.fastro.dev/v${FASTRO_VERSION}/core/types.ts
RUN deno cache https://raw.fastro.dev/v${FASTRO_VERSION}/core/utils.ts
RUN deno cache https://raw.fastro.dev/v${FASTRO_VERSION}/core/validator.ts
RUN deno cache https://raw.fastro.dev/v${FASTRO_VERSION}/cli/fastro.ts

WORKDIR /app

COPY . ./

CMD ["run", "--no-check", "-A", "https://raw.fastro.dev/v${FASTRO_VERSION}/cli/fastro.ts", "serve", "--port", "8080", "--production"]
`;
