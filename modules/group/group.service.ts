import { kv } from "@app/utils/db.ts";
import { GroupType, PermissionType } from "@app/modules/group/group.type.ts";
import { ulid } from "jsr:@std/ulid";

export async function createGroup(group: GroupType) {
    const atomicOp = kv.atomic();
    group.id = group.id ? group.id : ulid();
    group.status = true;

    const primaryKey = ["groups", group.id];
    const groupByNameKey = ["groups_by_name", group.name, group.id];

    atomicOp
        .check({ key: primaryKey, versionstamp: null })
        .set(primaryKey, group)
        .set(groupByNameKey, group);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to create group");
    return group;
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

export async function updateGroup(group: GroupType) {
    if (!group.id) throw new Error("group.id must not be null");

    const atomicOp = kv.atomic();
    const groupKey = ["groups", group.id];

    const ug = await kv.get<GroupType>(groupKey);
    if (ug.value?.id) {
        atomicOp.check(ug)
            .delete(["groups_by_name", ug.value.name, ug.value.id])
            .set(["groups_by_name", group.name, group.id], group);
    }

    atomicOp.set(groupKey, group);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to create group");

    const g = await kv.get<GroupType>(groupKey);
    return g.value;
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

export async function createUserPermission(
    groupId: string,
    userId: string,
    permission: PermissionType[],
) {
    const atomicOp = kv.atomic();
    const key = ["groups_permission", groupId, userId];
    atomicOp.set(key, permission);
    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to create permission");
    return res;
}

export function findUserGroupPermission(
    groupId: string,
    userId: string,
    options?: Deno.KvListOptions,
) {
    return kv.list(
        { prefix: ["groups_permission", groupId, userId] },
        options,
    );
}

export function fingdUserGroupMember(
    groupId: string,
    options?: Deno.KvListOptions,
) {
    return kv.list(
        { prefix: ["groups_permission", groupId] },
        options,
    );
}
