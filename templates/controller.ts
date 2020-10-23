import { FASTRO_VERSION } from "../core/types.ts";

export const controller =
  `import type { Request } from "https://raw.fastro.dev/v${FASTRO_VERSION}/mod.ts";
export const handler = (request: Request) => {
// request.view("hello.template.html", { greeting: "Hello", name: "World" });
request.send(\`setup \${request.hello}\`);
};
`;
