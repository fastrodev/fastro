export const controller = `import  { Request } from "../deps.ts";
export default function(request: Request) {
  // request.view("hello.template.html", { greeting: "Hello", name: "World" });
  request.send(\`setup \${request.hello}\`);
};
`;
