import { assert, assertEquals } from "../server/deps.ts";
import { Store } from "./map.ts";

Deno.test("ExpiringMap: should set and get a value", async () => {
    const expiringMap = new Store<string, string>(1000); // 1 second TTL
    expiringMap.set("key1", "value1");
    assertEquals(await expiringMap.get("key1"), "value1");
});

Deno.test("ExpiringMap: should return undefined for expired keys", async () => {
    const expiringMap = new Store<string, string>(100);
    expiringMap.set("key1", "value1");
    await new Promise((resolve) => setTimeout(resolve, 200));
    assertEquals(await expiringMap.get("key1"), undefined);
});

Deno.test("ExpiringMap: should check if a key exists", async () => {
    const expiringMap = new Store<string, string>(100);
    expiringMap.set("key1", "value1");
    assert(expiringMap.has("key1"));
    await new Promise((resolve) => setTimeout(resolve, 200));
    assert(!expiringMap.has("key1"));
});

Deno.test("ExpiringMap: should delete a key", async () => {
    const expiringMap = new Store<string, string>();
    expiringMap.set("key1", "value1");
    assert(expiringMap.delete("key1"));
    assertEquals(await expiringMap.get("key1"), undefined);
});

Deno.test("ExpiringMap: should clear all entries", () => {
    const expiringMap = new Store<string, string>();
    expiringMap.set("key1", "value1");
    expiringMap.set("key2", "value2");
    expiringMap.clear();
    assertEquals(expiringMap.size(), 0);
});

Deno.test("ExpiringMap: should get the size of the map", () => {
    const expiringMap = new Store<string, string>();
    expiringMap.set("key1", "value1");
    expiringMap.set("key2", "value2");
    assertEquals(expiringMap.size(), 2);
});

Deno.test("ExpiringMap: should iterate over valid entries using forEach", () => {
    const expiringMap = new Store<string, string>(1000);
    expiringMap.set("key1", "value1");
    expiringMap.set("key2", "value2");

    const entries: [string, string][] = [];
    expiringMap.forEach((value, key) => {
        entries.push([key, value]);
    });

    assertEquals(entries.length, 2);
    assertEquals(entries, [["key1", "value1"], ["key2", "value2"]]);
});

Deno.test("ExpiringMap: should set a key with custom TTL", async () => {
    const expiringMap = new Store<string, string>(2000);
    expiringMap.set("key1", "value1", 1000);
    assertEquals(await expiringMap.get("key1"), "value1");
    await new Promise((resolve) => setTimeout(resolve, 1100));
    assertEquals(await expiringMap.get("key1"), undefined);
});

Deno.test("ExpiringMap: save it to github", async () => {
    const token = Deno.env.get("GITHUB_TOKEN");
    if (!token) return;
    const expiringMap = new Store<string, number>(2000, {
        owner: "fastrodev",
        repo: "fastro",
        path: "modules/store/records.json",
        branch: "store",
        token,
    });
    const d = new Date();
    expiringMap.set("key1", d.getTime(), 1000);
    const c = await expiringMap.commit();
    assertEquals(c?.data.content?.name, "records.json");
});
