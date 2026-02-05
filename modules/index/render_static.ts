/**
 * Serving the static public main html file.
 *
 * @param path The path to the index.html file.
 * @returns A promise that resolves to a Response object with HTML content.
 */
export async function renderStatic(path: string) {
  try {
    const url = new URL(`../../${path}`, import.meta.url);
    const content = await Deno.readTextFile(url);
    return new Response(content, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (_) {
    return new Response("Not found", { status: 404 });
  }
}
