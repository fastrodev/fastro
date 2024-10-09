import { assertEquals } from "@app/core/server/deps.ts";
import { createMessage } from "@app/modules/message/mod.ts";

Deno.test("Message: create message", async () => {
    const userId = "01J9GHHJB9JW2R13P6S24CH5B7";

    const res = await createMessage({
        userId,
        content: "Hello",
        title: "hi",
    });

    assertEquals(res?.userId, userId);
});
