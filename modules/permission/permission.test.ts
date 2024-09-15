import { assertEquals } from "@app/core/server/deps.ts";
import {
    createPermission,
    deletePermission,
    getPermission,
    listPemissionByGroupId,
    listPemissionByModule,
    listPermissionByUserId,
    updatePermission,
} from "@app/modules/permission/permission.service.ts";
import { createUser } from "@app/modules/user/user.service.ts";
import { createGroup } from "@app/modules/group/group.service.ts";
import { collectValues, reset } from "@app/utils/db.ts";
import { UserType } from "@app/modules/user/user.type.ts";
import { GroupType } from "@app/modules/group/group.type.ts";
import { PermissionType } from "@app/modules/permission/permission.type.ts";

let u: UserType;
let g: GroupType;
let p: PermissionType;

Deno.test({
    name: "createPermission",
    async fn() {
        await reset();
        u = await createUser({
            username: "john",
            password: "password",
            email: "john@email.com",
        });
        g = await createGroup({ name: "admin" });
        createGroup({ name: "user" });

        if (u && g.groupId) {
            p = await createPermission({
                groupId: g.groupId,
                userId: u.userId,
                permission: [
                    "read",
                    "write",
                    "execute",
                ],
            });

            assertEquals(p.userId, u.userId);
            assertEquals(p.groupId, g.groupId);
            assertEquals(p.permission, [
                "read",
                "write",
                "execute",
            ]);
        }
    },
});

Deno.test({
    name: "createPermission user not found",
    async fn() {
        try {
            await createPermission(
                {
                    userId: "not exist",
                    groupId: "not exist",
                    permission: [
                        "read",
                        "write",
                        "execute",
                    ],
                },
            );
        } catch (error) {
            assertEquals(error.message, "User is not found");
        }
    },
});

Deno.test({
    name: "createPermission not valid",
    async fn() {
        try {
            await createPermission(
                {
                    userId: "not exist",
                    groupId: "not exist",
                    permission: [],
                },
            );
        } catch (error) {
            assertEquals(error.message, "Permission is not valid");
        }
    },
});

Deno.test({
    name: "getPermission",
    async fn() {
        const res = await getPermission(p.permissionId);
        assertEquals(res?.permission, ["read", "write", "execute"]);
        assertEquals(res?.permissionId, p.permissionId);
    },
});

Deno.test({
    name: "getPemissionByUserId",
    async fn() {
        const [res] = await collectValues(listPermissionByUserId(p.userId));
        assertEquals(res?.permission, ["read", "write", "execute"]);
        assertEquals(res?.permissionId, p.permissionId);
    },
});

Deno.test({
    name: "getPemissionByGroupId",
    async fn() {
        const [res] = await collectValues(
            listPemissionByGroupId(p.groupId),
        );
        assertEquals(res?.permission, ["read", "write", "execute"]);
        assertEquals(res?.permissionId, p.permissionId);
    },
});

Deno.test({
    name: "getPemissionByModule",
    async fn() {
        const [res] = await collectValues(listPemissionByModule("null"));
        assertEquals(res?.permission, ["read", "write", "execute"]);
        assertEquals(res?.permissionId, p.permissionId);
    },
});

Deno.test({
    name: "updatePermission",
    async fn() {
        p.active = false;
        p.permission = ["read"];
        const res = await updatePermission(p);
        assertEquals(res?.active, false);
        assertEquals(res?.permission, ["read"]);
    },
});

Deno.test({
    name: "deletePermission",
    async fn() {
        const res = await deletePermission(p.permissionId);
        assertEquals(res.ok, true);
    },
});
