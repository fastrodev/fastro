// deno-lint-ignore-file
import type { Fastro } from "@app/core/server/types.ts";
import { Store } from "@app/core/map/mod.ts";

export async function createCollection(
    collection: string,
    namespace?: string,
    filename?: string,
) {
    const dir = namespace ? `${namespace}/` : "";
    let path = filename ?? "records.json";
    path = `collections/${collection}/${dir}${path}`;

    const store = new Store<string | number | symbol, any>({
        owner: Deno.env.get("GITHUB_OWNER") || "fastrodev",
        repo: Deno.env.get("GITHUB_REPO") || "store",
        branch: Deno.env.get("GITHUB_BRANCH") || "main",
        token: Deno.env.get("GITHUB_TOKEN"),
        path,
    });
    await store.syncMap();
    return store;
}

export default async function storeModule(s: Fastro) {
    const core = await createCollection("core");
    core.set("connections", new Map<string, Set<WebSocket>>());
    s.stores.set("core", core);
    s.stores.set("users", await createCollection("users"));
    s.stores.set("rooms", await createCollection("rooms"));
    return s;
}
