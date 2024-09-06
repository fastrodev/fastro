import { ulid } from "jsr:@std/ulid";
import { kv } from "@app/utils/db.ts";
import { UserArgsType, UserType } from "@app/modules/user/user.type.ts";
import { combineObjects } from "@app/utils/general.ts";

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

export async function createUser(user: UserArgsType) {
    const userId = ulid();
    const u = {
        userId,
        active: true,
    };
    const newUser = combineObjects(u, user) as UserType;
    const primaryKey = ["users", userId];
    const byEmailKey = ["users_by_email", user.email];

    const atomic = kv.atomic()
        .check({ key: primaryKey, versionstamp: null })
        .check({ key: byEmailKey, versionstamp: null })
        .set(primaryKey, newUser)
        .set(byEmailKey, newUser);

    const res = await atomic.commit();
    if (!res.ok) throw new Error("Failed to create user");

    return newUser;
}

export async function updateUser(user: UserType) {
    const atomicOp = kv.atomic();

    const eu = await kv.get<UserArgsType>(["users", user.userId]);
    if (eu.value?.email) {
        atomicOp.check(eu)
            .delete(["users_by_email", eu.value?.email]);
    }

    const byEmailKey = ["users_by_email", user.email];
    atomicOp
        .set(["users", user.userId], user)
        .set(byEmailKey, user);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to update user");
    return res;
}

export async function deleteUser(id: string) {
    let res = { ok: false };
    while (!res.ok) {
        const getRes = await kv.get<UserArgsType>(["users", id]);
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
