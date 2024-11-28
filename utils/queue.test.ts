import { assertEquals } from "@app/core/server/deps.ts";
import { createTaskQueue } from "@app/utils/queue.ts";

Deno.test("Queue: create message", async () => {
  const q = createTaskQueue();
  const x = await q.process(() => "x");
  const y = await q.process(() => 1);
  const z = await q.process(() => true);
  const o = await q.process(() => ({}));
  const v = await q.process(() => {});
  const p = await q.process(async () => {
    const r = new Promise<string>((resolve) => resolve("hello"));
    return await r;
  });
  assertEquals(x, "x");
  assertEquals(y, 1);
  assertEquals(z, true);
  assertEquals(o, {});
  assertEquals(v, undefined);
  assertEquals(p, "hello");
});
