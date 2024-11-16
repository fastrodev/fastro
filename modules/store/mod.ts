// deno-lint-ignore-file
import type { Fastro } from "@app/core/server/types.ts";
import { Store } from "@app/core/map/mod.ts";
import { reset } from "@app/utils/db.ts";

export async function createCollection(
    key: string,
    ...namespace: Array<string>
) {
    const store = new Store<string | number | symbol, any>({
        key,
        namespace,
    });

    await store.syncMap();
    return store;
}

export default async function storeModule(s: Fastro) {
    s.stores.set("core", await createCollection("core"));
    s.stores.set("users", await createCollection("users"));
    s.stores.set("rooms", await createCollection("rooms"));
    s.stores.set("connected", await createCollection("connected"));
    s.get("/api/store/reset", async (req) => {
        await reset();
        return Response.json([]);
    });
    return s;
}
