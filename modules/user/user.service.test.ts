import { assertEquals } from "@app/http/server/deps.ts";
import {
    createUser,
    deleteUser,
    getUser,
    getUserByEmail,
    listUsers,
    listUsersByEmail,
    updateUser,
} from "@app/modules/user/user.service.ts";
import UserType from "@app/modules/user/user.type.ts";
import { collectValues, reset } from "@app/utils/db.ts";

Deno.test({
    name: "createUser",
    async fn() {
        const res = await createUser({
            username: "john",
            password: "password",
            email: "john@email.com",
        });
        await createUser({
            username: "john1",
            password: "password",
            email: "john1@email.com",
        });
        await createUser({
            username: "john3",
            password: "password",
            email: "john3@email.com",
        });
        await createUser({
            username: "john4",
            password: "password",
            email: "john4@email.com",
        });

        assertEquals(res.username, "john");
    },
});

let user: UserType | null;
Deno.test({
    name: "getUserByEmail",
    async fn() {
        user = await getUserByEmail("john@email.com");
        assertEquals(user?.email, "john@email.com");
    },
});

Deno.test({
    name: "updateUser",
    async fn() {
        if (!user) return;
        user.email = "john2@email.com";
        if (user.id) {
            const res = await updateUser(user);
            assertEquals(res?.ok, true);
        }
    },
});

Deno.test({
    name: "getUser",
    async fn() {
        if (user?.id) {
            user = await getUser(user?.id);
        }
        assertEquals(user?.email, "john2@email.com");
    },
});

Deno.test({
    name: "updateUser 2",
    async fn() {
        if (!user) return;
        user.email = "john2@email.com";
        if (user.id) {
            const res = await updateUser(user);
            assertEquals(res.ok, true);
        }
    },
});

Deno.test({
    name: "listUsers",
    async fn() {
        const res = await collectValues(listUsers());
        assertEquals(res.length, 4);
    },
});

Deno.test({
    name: "listUsers",
    async fn() {
        const iterator = listUsers({ limit: 1 });
        const res = await collectValues(iterator);
        assertEquals(res.length, 1);

        const iter2 = listUsers({ limit: 1, cursor: iterator.cursor });
        const res2 = await collectValues(iter2);
        assertEquals(res2.length, 1);

        const iter3 = listUsers({ limit: 1, cursor: iterator.cursor });
        const res3 = await collectValues(iter3);
        assertEquals(res3.length, 1);
    },
});

Deno.test({
    name: "listUsersByEmail",
    async fn() {
        const res = await collectValues(listUsersByEmail());
        assertEquals(res.length, 4);
    },
});

Deno.test({
    name: "deleteUser",
    async fn() {
        if (user?.id) {
            const res = await deleteUser(user.id);
            assertEquals(res?.ok, true);
            await reset();
        }
    },
});
