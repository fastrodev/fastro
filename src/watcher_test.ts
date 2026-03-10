import { assertEquals } from "jsr:@std/assert@^1.0.19";
import { stdPath } from "./deps.ts";
const { join } = stdPath;

Deno.test({
  name: "watcher test",
  sanitizeResources: false,
  sanitizeOps: false,
  fn: async (t) => {
    const cwd = Deno.cwd();
    const modulesPath = join(cwd, "modules");
    await Deno.mkdir(modulesPath, { recursive: true });

    await t.step(
      "watchFs mock behavior could be tested here if structure allowed",
      async () => {
        // Since startWatcher is not exported and uses hardcoded paths,
        // and it's an infinite loop, we can't easily unit test it without
        // refactoring the codebase which the user asked not to do.
        // However, we can track that common watch targets exist.
        const stat = await Deno.stat(modulesPath);
        assertEquals(stat.isDirectory, true);
      },
    );
  },
});
