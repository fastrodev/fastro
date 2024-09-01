import { kv } from "@app/utils/db.ts";
import {
    PermissionArgsType,
    PermissionOpType,
    PermissionType,
} from "@app/modules/permission/permission.type.ts";
import UserType from "@app/modules/user/user.type.ts";
import { GroupType } from "@app/modules/group/group.type.ts";
import { combineObjects } from "@app/utils/general.ts";
import { ulid } from "jsr:@std/ulid";

const PRIMARY_KEY = "permissions";
const PERMISSION_BY_USER_KEY = "permissions_by_user";
const PERMISSION_BY_GROUP_KEY = "permissions_by_group";
const PERMISSION_BY_MODULE_KEY = "permissions_by_module";

function isValidPermissionsArray(permissions: PermissionOpType[]): boolean {
    const expectedPermissions: Set<string> = new Set([
        "read",
        "write",
        "execute",
    ]);

    if (permissions.length === 0) {
        return false;
    }

    const uniquePermissions = new Set(permissions);

    const isValid = [...uniquePermissions].every((permission) =>
        expectedPermissions.has(permission)
    );

    return isValid && uniquePermissions.size <= expectedPermissions.size;
}

export async function createPermission(permissionArgs: PermissionArgsType) {
    if (!isValidPermissionsArray(permissionArgs.permission)) {
        throw new Error("Permission is not valid");
    }

    const userId = permissionArgs.userId;
    const user = await kv.get<UserType>(["users", userId]);
    if (!user.value) throw new Error("User is not found");

    const groupId = permissionArgs.groupId;
    const group = await kv.get<GroupType>(["groups", groupId]);
    if (!group.value) throw new Error("Group is not found");

    const module = permissionArgs.module || "null";

    const permissionId = ulid();
    const permissionWithId = {
        permissionId,
        active: true,
    };
    const permission = combineObjects(
        permissionWithId,
        permissionArgs,
    ) as PermissionType;

    const primaryKey = [PRIMARY_KEY, permissionId];
    const userKey = [PERMISSION_BY_USER_KEY, userId, permissionId];
    const groupKey = [PERMISSION_BY_GROUP_KEY, groupId, permissionId];
    const moduleKey = [PERMISSION_BY_MODULE_KEY, module, permissionId];

    const atomicOp = kv.atomic();
    atomicOp
        .check({ key: primaryKey, versionstamp: null })
        .set(primaryKey, permission)
        .set(groupKey, permission)
        .set(userKey, permission)
        .set(moduleKey, permission);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to create the permission");
    return permission;
}

export async function updatePermission(p: PermissionType) {
    const atomicOp = kv.atomic();

    const primaryKey = [PRIMARY_KEY, p.permissionId];
    const res = await kv.get<PermissionType>(primaryKey);

    atomicOp
        .check(res)
        .set(primaryKey, p);

    if (res.value?.userId) {
        atomicOp
            .delete([
                PERMISSION_BY_USER_KEY,
                res.value?.userId,
                res.value.permissionId,
            ])
            .set([PERMISSION_BY_USER_KEY, p.userId, p.permissionId], p);
    }
    if (res.value?.groupId) {
        atomicOp
            .delete([
                PERMISSION_BY_GROUP_KEY,
                res.value?.groupId,
                res.value.permissionId,
            ])
            .set([PERMISSION_BY_GROUP_KEY, p.groupId, p.permissionId], p);
    }
    if (res.value?.module) {
        atomicOp
            .delete([
                PERMISSION_BY_MODULE_KEY,
                res.value?.module,
                res.value.permissionId,
            ])
            .set(
                [PERMISSION_BY_GROUP_KEY, p.module || "null", p.permissionId],
                p,
            );
    }

    const r = await atomicOp.commit();
    if (!r.ok) throw new Error("Failed to create the permission");
    return p;
}

export async function getPermission(permissionId: string) {
    const res = await kv.get<PermissionType>([PRIMARY_KEY, permissionId]);
    return res.value;
}

export function getPemissionByUserId(
    userId: string,
    options?: Deno.KvListOptions,
) {
    return kv.list<PermissionType>(
        { prefix: [PERMISSION_BY_USER_KEY, userId] },
        options,
    );
}

export function getPemissionByGroupId(
    groupId: string,
    options?: Deno.KvListOptions,
) {
    return kv.list<PermissionType>({
        prefix: [PERMISSION_BY_GROUP_KEY, groupId],
    }, options);
}

export function getPemissionByModule(
    module: string,
    options?: Deno.KvListOptions,
) {
    return kv.list<PermissionType>({
        prefix: [PERMISSION_BY_MODULE_KEY, module],
    }, options);
}

export async function deletePermission(permissionId: string) {
    const atomicOp = kv.atomic();
    let res = { ok: false };
    while (!res.ok) {
        const k = [
            PRIMARY_KEY,
            permissionId,
        ];
        const r = await kv.get<PermissionType>(k);
        if (r) {
            atomicOp
                .check(r)
                .delete(k);
        }

        if (r.value?.userId) {
            atomicOp.delete([PERMISSION_BY_USER_KEY, permissionId]);
        }

        if (r.value?.groupId) {
            atomicOp.delete([PERMISSION_BY_GROUP_KEY, permissionId]);
        }

        if (r.value?.module) {
            atomicOp.delete([PERMISSION_BY_MODULE_KEY, permissionId]);
        }

        res = await atomicOp.commit();
    }

    return res;
}
