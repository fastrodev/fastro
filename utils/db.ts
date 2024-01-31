/**
 * Inspired by Deno Saaskit
 * See: https://github.com/denoland/saaskit/blob/main/utils/db.ts
 */
const DENO_KV_PATH_KEY = "DENO_KV_PATH";
let path = undefined;
if (
  /**
   * Resolves to the current status of a permission.
   */
  (await Deno.permissions.query({ name: "env", variable: DENO_KV_PATH_KEY }))
    .state === "granted"
) {
  path = Deno.env.get(DENO_KV_PATH_KEY);
}

/**
 * Create Deno.Kv Singleton
 */
let instance: Deno.Kv;
async function getKvInstance(path?: string): Promise<Deno.Kv> {
  if (!instance) {
    instance = await Deno.openKv(path);
  }
  return instance;
}

export const kv = await getKvInstance(path);
