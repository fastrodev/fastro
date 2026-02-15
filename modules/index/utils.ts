// Fetch the latest version from local version.json
let cachedVersion: string | null = null;

export function _resetVersionCacheForTests() {
  cachedVersion = null;
}

export async function getVersion() {
  if (cachedVersion) return cachedVersion;
  try {
    const url = new URL("../../version.json", import.meta.url);
    const content = await Deno.readTextFile(url);
    const { version } = JSON.parse(content);
    if (version) {
      cachedVersion = version;
      return cachedVersion;
    }
  } catch (_) {
    // Fallback in case of error
  }
  return "v1.0.0";
}

export async function getHeaderPages(kv?: Deno.Kv): Promise<string[]> {
  try {
    const k = kv ||
      (typeof Deno.openKv === "function" ? await Deno.openKv() : null);
    if (!k) return ["SHOWCASE.md", "MIDDLEWARES.md", "BENCHMARK.md", "DOCS.md"];
    const res = await k.get<string[]>(["config", "headerPages"]);

    // If we opened a temporary KV, close it
    if (!kv && k && typeof k.close === "function") {
      try {
        await k.close();
      } catch (_) { /* ignore */ }
    }

    if (res.value) return res.value;
  } catch (_) {
    // ignore
  }
  return ["SHOWCASE.md", "MIDDLEWARES.md", "BENCHMARK.md", "DOCS.md"];
}
