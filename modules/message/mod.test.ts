import { assertEquals } from "@app/core/server/deps.ts";
import { createMessage } from "@app/modules/message/mod.ts";
import { ulid } from "jsr:@std/ulid";

Deno.test("Message: create message", async () => {
    const userId = ulid();

    const res = await createMessage({
        userId,
        content: "Hello",
        title: "hi",
    });

    assertEquals(res?.userId, userId);
});
