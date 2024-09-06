import { assertEquals } from "@app/http/server/deps.ts";
import {
    createGroup,
    deleteGroup,
    getGroup,
    listGroups,
    listGroupsByName,
    updateGroup,
} from "@app/modules/group/group.service.ts";
import { collectValues, reset } from "@app/utils/db.ts";
import { GroupType } from "@app/modules/group/group.type.ts";

await reset();

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
        if (!group.groupId) return;
        const res = await getGroup(group.groupId);
        assertEquals(res?.name, "admin");
    },
});

Deno.test({
    name: "updateGroup",
    async fn() {
        if (!group.groupId) return;
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
        if (!group.groupId) throw new Error("group.id must be defined");
        const res = await deleteGroup(group.groupId);
        assertEquals(res.ok, true);
    },
});
