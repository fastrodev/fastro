import { HttpRequest } from "../http/server.ts";

export function denoRunCheck(req: HttpRequest) {
  const regex = /^Deno\/(\d+\.\d+\.\d+)$/;
  const string = req.headers.get("user-agent");
  if (!string) return false;
  const match = regex.exec(string);
  if (!match) return false;
  return true;
}

export function init() {
  const basePath = Deno.env.get("DENO_DEPLOYMENT_ID")
    ? `https://raw.githubusercontent.com/fastrodev/fastro/main/static`
    : "http://localhost:8000/static";
  const code =
    `import init, { version } from "${basePath}/init.ts"; const name = Deno.args[0] ?? 'my-project'; await init(name, version);`;
  return new Response(code, {
    headers: {
      "content-type": "application/typescript; charset=utf-8",
    },
  });
}

export async function getVersion() {
  let git: Record<string, string>;
  try {
    const data = await fetch(
      "https://api.github.com/repos/fastrodev/fastro/releases/latest",
    );
    git = JSON.parse(await data.text());
  } catch {
    git = {};
    git["name"] = "local";
  }

  return git;
}

export async function getExamples() {
  const examples = [];
  for await (const f of Deno.readDir("./examples")) {
    const [name, ext] = f.name.split(".");
    examples.push({ name: name.split("_").join(" "), ext, file: f.name });
  }
  return examples;
}
