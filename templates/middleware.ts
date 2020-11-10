import { FASTRO_VERSION } from "../core/constant.ts";

export const middleware =
  `import type { Callback, Request } from "https://raw.fastro.dev/v${FASTRO_VERSION}/mod.ts";
export const options = {
  methods: ["GET", "POST"],
};
export const handler = (request: Request, next: Callback) => {
  request.hello = "with middleware";
  next();
};
`;
