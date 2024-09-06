import { kv } from "@app/utils/db.ts";
import { GroupArgType, GroupType } from "@app/modules/group/group.type.ts";
import { ulid } from "jsr:@std/ulid";
import { combineObjects } from "@app/utils/general.ts";

export async function createGroup(group: GroupArgType) {
    const groupId = ulid();
    const newGroup = {
        groupId,
        active: true,
    };
    const g = combineObjects(newGroup, group) as GroupType;
    const primaryKey = ["groups", groupId];
    const groupByNameKey = ["groups_by_name", group.name, groupId];

    const atomicOp = kv.atomic();
    atomicOp
        .check({ key: primaryKey, versionstamp: null })
        .set(primaryKey, g)
        .set(groupByNameKey, g);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to create group");
    return g;
}

export async function updateGroup(group: GroupType) {
    if (!group.groupId) throw new Error("group.id must not be null");

    const atomicOp = kv.atomic();
    const groupKey = ["groups", group.groupId];

    const ug = await kv.get<GroupType>(groupKey);
    if (ug.value?.groupId) {
        atomicOp.check(ug)
            .delete(["groups_by_name", ug.value.name, ug.value.groupId])
            .set(["groups_by_name", group.name, group.groupId], group);
    }

    atomicOp.set(groupKey, group);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to create group");

    const g = await kv.get<GroupType>(groupKey);
    return g.value;
}

export async function getGroup(groupId: string): Promise<GroupType | null> {
    const res = await kv.get<GroupType>(["groups", groupId]);
    return res.value;
}

export function listGroups(
    options?: Deno.KvListOptions,
) {
    return kv.list<GroupType>({ prefix: ["groups"] }, options);
}

export function listGroupsByName(
    name?: string,
    options?: Deno.KvListOptions,
) {
    if (name) {
        return kv.list<GroupType>(
            { prefix: ["groups_by_name", name] },
            options,
        );
    }
    return kv.list<GroupType>({ prefix: ["groups_by_name"] }, options);
}

export async function deleteGroup(id: string) {
    let res = { ok: false };
    while (!res.ok) {
        const getRes = await kv.get<GroupType>(["groups", id]);
        if (getRes && getRes.value) {
            res = await kv.atomic()
                .check(getRes)
                .delete(["groups", id])
                .delete(["groups_by_name", getRes.value.name, id])
                .commit();
        }
    }
    return res;
}
