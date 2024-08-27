import { assertEquals } from "@app/http/server/deps.ts";
import {
    createGroup,
    deleteGroup,
    getGroup,
    listGroups,
    listGroupsByName,
    updateGroup,
} from "@app/modules/group/group.service.ts";
import { collectValues, kv } from "@app/utils/db.ts";
import { GroupType } from "@app/modules/group/group.type.ts";

let group: GroupType;
Deno.test({
    name: "createUserGroup",
    async fn() {
        const res = await createGroup({ name: "admin" });
        group = res;
        assertEquals(res.name, "admin");
    },
});

Deno.test({
    name: "getGroup",
    async fn() {
        if (!group.id) return;
        const res = await getGroup(group.id);
        assertEquals(res?.name, "admin");
    },
});

Deno.test({
    name: "updateGroup",
    async fn() {
        if (!group.id) return;
        group.name = "sales";
        const res = await updateGroup(group);
        assertEquals(res?.name, "sales");
    },
});

Deno.test({
    name: "listGroups",
    async fn() {
        const res = await collectValues(listGroups());
        assertEquals(res.length, 1);
    },
});

Deno.test({
    name: "listGroupsByName",
    async fn() {
        const res = await collectValues(listGroupsByName());
        assertEquals(res.length, 1);
    },
});

Deno.test({
    name: "listGroupsByName with name",
    async fn() {
        const res = await collectValues(listGroupsByName("sales"));
        assertEquals(res.length, 1);
    },
});

Deno.test({
    name: "listGroupsByName with wrong name",
    async fn() {
        const res = await collectValues(listGroupsByName("admin"));
        assertEquals(res.length, 0);
    },
});

Deno.test({
    name: "deleteGroup",
    async fn() {
        if (!group.id) throw new Error("group.id must be defined");
        const res = await deleteGroup(group.id);
        assertEquals(res.ok, true);
    },
});

Deno.test({
    name: "reset",
    async fn() {
        const iter = kv.list({ prefix: [] });
        const promises = [];
        for await (const res of iter) promises.push(kv.delete(res.key));
        await Promise.all(promises);
    },
});
