export const controller = `import type { Request } from "../deps.ts";
export default (request: Request) => {
  // request.view("hello.template.html", { greeting: "Hello", name: "World" });
  request.send(\`setup \${request.hello}\`);
};
`;
