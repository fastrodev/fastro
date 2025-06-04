// deno-lint-ignore-file no-explicit-any
import { extract, remark, render } from "./deps.ts";
import { createTocExtractor } from "./toc-extractor.ts";
import { default as remarkToc } from "npm:remark-toc@8.0.1";

function stringToJSXElement(content: string) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

const fileCache = new Map<string, string | null>();

function readMarkdownFile(folder: string, file: string) {
  const path = folder + "/" + file + ".md";
  console.log("Reading markdown file:", path);

  // Check cache first
  if (fileCache.has(path)) {
    return fileCache.get(path);
  }

  try {
    const md = Deno.readTextFileSync(path);
    fileCache.set(path, md);
    return md;
  } catch {
    fileCache.set(path, null);
    return null;
  }
}

const record: Record<string, unknown> = {};

export async function getMarkdownBody(
  folder: string,
  file: string,
  prefix: string,
  req?: Request,
) {
  async function g(): Promise<(any)[] | null> {
    const id = folder + file;
    if (record[id]) {
      return record[id] as any[];
    }
    // console.log("Processing markdown file:", folder, file);
    const filePath = prefix ? file.replace(`/${prefix}/`, "") : file;
    const pathname = prefix ? `/${prefix}/${filePath}` : file;

    if (req) {
      const pattern = new URLPattern({ pathname });
      const passed = pattern.test(req.url);
      if (!passed) return null;
    }

    const md = readMarkdownFile(folder, filePath);
    if (!md) return null;

    const m = extract(md);

    const tocExtractor = createTocExtractor();

    const f = await remark()
      .use(remarkToc, {
        heading: "contents|table[ -]of[ -]contents?",
        maxDepth: 6,
        tight: true,
      })
      .use(tocExtractor.plugin)
      .process(m.body);

    const rendered = render(String(f));
    const tocData = tocExtractor.getTocData();

    return record[id] = [rendered, m.attrs, tocData];
  }

  const resp = await g();
  // console.log("Markdown response:", resp);
  if (!resp) return null;
  const [r, attrs, toc] = resp;
  const markdown = stringToJSXElement(r);
  return [markdown, attrs, toc];
}
