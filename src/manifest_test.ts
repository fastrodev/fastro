import { assertEquals } from "jsr:@std/assert@^1.0.19";
import { generateManifest } from "./manifest.ts";
import { stdPath } from "./deps.ts";
const { join } = stdPath;

Deno.test("generateManifest test", async (t) => {
  const cwd = Deno.cwd();
  const modulesPath = join(cwd, "modules");

  // Setup directories
  await Deno.mkdir(modulesPath, { recursive: true });

  await t.step(
    "should generate manifest correctly with index and mod.ts",
    async () => {
      // These should be included
      await Deno.mkdir(join(modulesPath, "mod1"), { recursive: true });
      await Deno.writeTextFile(
        join(modulesPath, "mod1", "mod.ts"),
        "export const a = 1;",
      );

      await Deno.mkdir(join(modulesPath, "index"), { recursive: true });
      await Deno.writeTextFile(
        join(modulesPath, "index", "mod.ts"),
        "export const b = 2;",
      );

      // These should be ignored
      await Deno.mkdir(join(modulesPath, "manifest.ts"), { recursive: true });
      await Deno.mkdir(join(modulesPath, "test_prefix"), { recursive: true });
      await Deno.mkdir(join(modulesPath, "spa_test"), { recursive: true });
      // Folder with no mod.ts
      await Deno.mkdir(join(modulesPath, "empty"), { recursive: true });

      await generateManifest();

      const manifestContent = await Deno.readTextFile(join(cwd, "manifest.ts"));
      assertEquals(
        manifestContent.includes(
          'export * as index from "./modules/index/mod.ts";',
        ),
        true,
      );
      assertEquals(
        manifestContent.includes(
          'export * as mod1 from "./modules/mod1/mod.ts";',
        ),
        true,
      );
      assertEquals(manifestContent.includes("export * as test_prefix"), false);
      assertEquals(manifestContent.includes("export * as spa_test"), false);
      assertEquals(manifestContent.includes("export * as empty"), false);

      // Cleanup
      await Deno.remove(join(modulesPath, "mod1"), { recursive: true });
      await Deno.remove(join(modulesPath, "index"), { recursive: true });
      await Deno.remove(join(modulesPath, "manifest.ts"), { recursive: true });
      await Deno.remove(join(modulesPath, "test_prefix"), { recursive: true });
      await Deno.remove(join(modulesPath, "spa_test"), { recursive: true });
      await Deno.remove(join(modulesPath, "empty"), { recursive: true });
    },
  );

  await t.step(
    "should handle missing modules directory gracefully",
    async () => {
      const modulesBackup = join(cwd, "modules_tmp_bak_test");
      if (await Deno.stat(modulesPath).then(() => true).catch(() => false)) {
        await Deno.rename(modulesPath, modulesBackup);
      }

      await generateManifest();

      if (await Deno.stat(modulesBackup).then(() => true).catch(() => false)) {
        await Deno.rename(modulesBackup, modulesPath);
      }
    },
  );

  await t.step("should handle toIdentifier numeric check", async () => {
    await Deno.mkdir(join(modulesPath, "123mod"), { recursive: true });
    await Deno.writeTextFile(
      join(modulesPath, "123mod", "mod.ts"),
      "export const a = 1;",
    );

    await generateManifest();

    const manifestContent = await Deno.readTextFile(join(cwd, "manifest.ts"));
    assertEquals(manifestContent.includes("export * as m_123mod"), true);

    await Deno.remove(join(modulesPath, "123mod"), { recursive: true });
  });
});
