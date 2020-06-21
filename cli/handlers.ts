import { Fastro, FastroError, Request, version } from "../mod.ts";

function errorHandler(err: Error) {
  if (err.name === "NotFound") {
    throw FastroError(
      "CREATE_SERVER_ERROR",
      new Error("file `fastro.json` not found"),
    );
  }
  if (err.name === "SyntaxError") {
    throw FastroError(
      "CREATE_SERVER_ERROR",
      new Error("file `fastro.json` invalid"),
    );
  }
  throw err;
}

async function createServer() {
  try {
    const server = new Fastro();
    const cwd = Deno.cwd();
    const config = await Deno.readTextFile("fastro.json");
    const { app, folder } = JSON.parse(config);
    const handlers: Handler[] = [];
    type Handler = { path: string; file: any };
    const function_list: any[] = [];
    server
      .function("/:prefix/:handler", async (req) => {
        try {
          console.log('v222')
          const { prefix, handler } = req.parameter;
          const fileImport = 'file://' + cwd + `/${folder}/${handler}.ts`;
          if (prefix !== app) return req.send("not found");
          if (
            prefix && handler && req.functionParameter.length < 1 &&
            !function_list.includes(fileImport)
          ) {
            const file = await import(fileImport);
            handlers.push({ path: fileImport, file });
            function_list.push(fileImport);
          }
          const [h] = handlers.filter((h) => h.path === fileImport);
          if (!h) return server.forward(req);
          h.file.handler(req);
        } catch (error) {
          console.log(error)
          server.forward(req);
        }
      });
    return server;
  } catch (error) {
    throw errorHandler(error);
  }
}

export async function serve() {
  const server = await createServer();
  const PORT = 3000;
  await server.listen({ port: PORT }, (err) => {
    if (err) throw err;
    const data = {
      port: PORT,
      version: version.fastro,
    };
    console.info(data);
  });
}

export async function init() {
  const encoder = new TextEncoder();
  const app = "app";
  const folder = "handler";
  const config = { app, folder };
  const data = encoder.encode(JSON.stringify(config));
  await Deno.mkdir(folder, { recursive: true });
  await Deno.writeFile("fastro.json", data);

  const handlerContent =
    `import { Request } from "https://raw.githubusercontent.com/fastrodev/fastro/v${version.fastro}/mod.ts";
export function handler(req: Request) {
  req.send("hello world");
}
`;
  const handler = encoder.encode(handlerContent);
  const handlerPath = `${folder}/hello.ts`;
  await Deno.writeFile(handlerPath, handler);
}

export async function getVersion() {
  const file = await import("../mod.ts");
  console.log(file.version);
}
