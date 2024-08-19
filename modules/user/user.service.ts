import { ulid } from "jsr:@std/ulid";
import { kv } from "@app/utils/db.ts";
import UserType from "@app/modules/user/user.type.ts";

export async function getUserByEmail(email: string) {
    const res = await kv.get<UserType>(["users_by_email", email]);
    return res.value;
}

export async function getUser(id: string): Promise<UserType | null> {
    const res = await kv.get<UserType>(["users", id]);
    return res.value;
}

export function listUsers(
    options?: Deno.KvListOptions,
) {
    return kv.list<UserType>({ prefix: ["users"] }, options);
}

export function listUsersByEmail(
    options?: Deno.KvListOptions,
) {
    return kv.list<UserType>({ prefix: ["users_by_email"] }, options);
}

export function listUsersByGroup(
    userGroup: string,
    options?: Deno.KvListOptions,
) {
    return kv.list<UserType>(
        { prefix: ["users_by_group", userGroup] },
        options,
    );
}

export async function createUser(user: UserType) {
    user.id = user.id ? user.id : ulid();
    const primaryKey = ["users", user.id];
    const byEmailKey = ["users_by_email", user.email];

    const atomic = kv.atomic()
        .check({ key: primaryKey, versionstamp: null })
        .check({ key: byEmailKey, versionstamp: null })
        .set(primaryKey, user)
        .set(byEmailKey, user);

    if (user.group) {
        const byGroupKey = ["users_by_group", user.group, user.id];
        atomic.set(byGroupKey, user);
    }

    const res = await atomic.commit();
    if (!res.ok) throw new Error("Failed to create user");

    return res;
}

export async function updateUser(id: string, user: UserType) {
    if (!id) return;
    const existingUser = await kv.get<UserType>(["users", id]);
    if (!existingUser.value?.email) return;

    const byEmailKey = ["users_by_email", user.email];
    const atomicOp = kv.atomic()
        .check(existingUser)
        .delete(["users_by_email", existingUser.value?.email])
        .set(["users", id], user)
        .check({ key: byEmailKey, versionstamp: null })
        .set(byEmailKey, user);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to update user");
    return res;
}

export async function deleteUser(id: string) {
    let res = { ok: false };
    while (!res.ok) {
        const getRes = await kv.get<UserType>(["users", id]);
        if (getRes && getRes.value) {
            res = await kv.atomic()
                .check(getRes)
                .delete(["users", id])
                .delete(["users_by_email", getRes.value.email])
                .commit();
        }
    }
    return res;
}
