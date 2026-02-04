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
