import { renderMD_Content } from "./render_md.ts";
import { renderStatic } from "./render_static.ts";

/**
 * Renders the content of a source code file with syntax highlighting.
 *
 * @param path The relative path to the source file.
 * @param kv Optional Deno KV instance.
 * @returns A promise that resolves to a rendered HTML string.
 */
export async function renderCode(path: string, kv?: Deno.Kv) {
  try {
    const url = new URL(`../../${path}`, import.meta.url);
    const content = await Deno.readTextFile(url);
    const md = `\`\`\`typescript\n// ${path}\n\n${content}\n\`\`\``;
    return renderMD_Content(md, path, kv);
  } catch (_) {
    return renderStatic("public/index.html");
  }
}
