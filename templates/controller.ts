import { FASTRO_VERSION } from "../core/constant.ts";

export const controller =
  `import type { Request } from "https://deno.land/x/fastro@v${FASTRO_VERSION}/mod.ts";
export default (request: Request) => {
  // request.view("hello.template.html", { greeting: "Hello", name: "World" });
  request.send(\`setup \${request.hello}\`);
};
`;
