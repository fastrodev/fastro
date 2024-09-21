import { assertEquals } from "../server/deps.ts";
import { Store } from "./map.ts";

Deno.test("Store: set and get value without expiry", async () => {
    const store = new Store<string, number>();
    store.set("key1", 100);
    const value = await store.get("key1");
    assertEquals(value, 100);
});

Deno.test("Store: set and get value with expiry", async () => {
    const store = new Store<string, number>();
    store.set("key2", 200, 1000); // Set with 1 second expiry
    const value = await store.get("key2");
    assertEquals(value, 200);

    // Wait for 1.1 seconds to let it expire
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const expiredValue = await store.get("key2");
    assertEquals(expiredValue, undefined);
});

Deno.test("Store: has method returns true for existing key", async () => {
    const store = new Store<string, number>();
    store.set("key3", 300);
    assertEquals(await store.has("key3"), true);
});

Deno.test("Store: has method returns false for expired key", async () => {
    const store = new Store<string, number>();
    store.set("key4", 400, 500); // Set with 0.5 seconds expiry
    await new Promise((resolve) => setTimeout(resolve, 600)); // Wait for it to expire
    assertEquals(await store.has("key4"), false);
});

Deno.test("Store: delete method removes key", async () => {
    const store = new Store<string, number>();
    store.set("key5", 500);
    assertEquals(store.delete("key5"), true);
    assertEquals(await store.has("key5"), false);
});

Deno.test("Store: clear method removes all keys", () => {
    const store = new Store<string, number>();
    store.set("key6", 600);
    store.set("key7", 700);
    store.clear();
    assertEquals(store.size(), 0);
});

Deno.test("Store: size method returns correct count", () => {
    const store = new Store<string, number>();
    store.set("key8", 800);
    store.set("key9", 900);
    assertEquals(store.size(), 2);
});

Deno.test("Store: commit without options is error", async () => {
    try {
        const store = new Store<string, number>();
        await store.set("key6", 600).commit();
    } catch (error) {
        assertEquals(error, new Error("Options are needed to commit"));
    }
});

Deno.test("Store: set with check", () => {
    try {
        const store = new Store<string, number>();
        store.set("key6", 600);
        store.check("key6").set("key6", 700);
    } catch (error) {
        assertEquals(error, new Error("Key key6 is already used"));
    }
});

const d = new Date();
const time = d.getTime();
const token = Deno.env.get("GITHUB_TOKEN");
const store = new Store<string, number>({
    owner: "fastrodev",
    repo: "fastro",
    path: "modules/store/records.json",
    branch: "store",
    token,
});
Deno.test("Store: save it to github", async () => {
    store.set("key1", time);
    const r = await store.commit();
    assertEquals(r?.data.content?.name, "records.json");
});

Deno.test("Store: get value from github", async () => {
    const g = await store.get("key1");
    assertEquals(g, time);
});

Deno.test("Store: sync with github periodically", async () => {
    const i = await store.sync(5000);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    assertEquals(typeof i, "number");
    if (i) clearInterval(i);
});

Deno.test("Store: destroy map", async () => {
    await store.destroy();
    const g = await store.get("key1");
    assertEquals(g, undefined);
});
