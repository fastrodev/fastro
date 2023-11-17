// deno-lint-ignore-file no-explicit-any
import { HttpRequest } from "$fastro/http/server.ts";
import { extract } from "https://deno.land/std@0.201.0/front_matter/any.ts";

export function getPublishDate(dateStr?: string) {
  const currentDate = dateStr ? new Date(dateStr) : new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  const milliseconds = String(currentDate.getMilliseconds()).padStart(3, "0");

  const timezoneOffsetMinutes = currentDate.getTimezoneOffset();
  const timezoneOffsetHours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60);
  const timezoneOffsetMinutesRemainder = Math.abs(timezoneOffsetMinutes) % 60;
  const timezoneOffsetSign = timezoneOffsetMinutes < 0 ? "+" : "-";

  const iso8601String =
    `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetSign}${
      String(
        timezoneOffsetHours,
      ).padStart(2, "0")
    }:${String(timezoneOffsetMinutesRemainder).padStart(2, "0")}`;

  return iso8601String;
}

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
    `import init from "${basePath}/init.ts"; const name = Deno.args[0] ?? 'my-project'; await init(name);`;
  return new Response(code, {
    headers: {
      "content-type": "application/typescript; charset=utf-8",
    },
  });
}

export async function getExamples() {
  const examples = [];
  for await (const f of Deno.readDir("./examples")) {
    const [name, ext] = f.name.split(".");
    examples.push({ name: name.split("_").join(" "), ext, file: f.name });
  }
  return examples;
}

async function readContent(filePath: string) {
  try {
    const md = `./posts/${filePath}`;
    const txt = await Deno.readTextFile(md);
    const m = extract(txt);
    return m.attrs;
  } catch (error) {
    console.log(error);
  }
}

type PostType = {
  title: string;
  description: string;
  date: any;
  path: string;
};

export async function getPosts() {
  let p: PostType[] = [];
  for await (const f of Deno.readDir("./posts")) {
    const [name] = f.name.split(".");
    const r = await readContent(f.name);
    if (!r) continue;
    p.push({
      title: r.title as string,
      description: r.description as string,
      date: new Date(r.date as string),
      path: `/blog/${name}`,
    });
  }

  p = p.sort((a, b) => b.date - a.date);
  p.forEach((item: PostType, index: number) => {
    return item.date = p[index].date.toLocaleDateString();
  });

  return p;
}
