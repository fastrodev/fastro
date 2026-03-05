import { renderMD_Content } from "./render_md.ts";
import { renderStatic } from "./render_static.ts";
import { RAW_URL } from "../../deps.ts";

/**
 * Renders the content of a source code file with syntax highlighting.
 *
 * @param path The relative path to the source file.
 * @param kv Optional Deno KV instance.
 * @param canonical Optional canonical URL for the page.
 * @returns A promise that resolves to a rendered HTML string.
 */
export async function renderCode(
  path: string,
  kv?: Deno.Kv,
  canonical?: string,
) {
  try {
    const response = await fetch(`${RAW_URL}${path}`);
    if (!response.ok) throw new Error("Failed to fetch");
    const content = await response.text();
    const md = `\`\`\`typescript\n// ${path}\n\n${content}\n\`\`\``;
    return renderMD_Content(md, path, kv, canonical);
  } catch (_) {
    return renderStatic("public/index.html");
  }
}
