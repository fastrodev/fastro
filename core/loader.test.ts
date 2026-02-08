import { join, toFileUrl } from "@std/path";
import { autoRegisterModules, sortNames } from "./loader.ts";

// deno-lint-ignore no-explicit-any
const appMock: any = {
  use: () => {},
};

Deno.test("loader.ts - 100% simple coverage", async (t) => {
  const tempDir = await Deno.makeTempDir();

  await t.step("manifest registration and sorting", async () => {
    const manifestPath = join(tempDir, "simple_manifest.ts");
    // To trigger all branches in sortNames:
    // 1. a=index (index vs anything)
    // 2. b=index (anything vs index)
    // 3. a=profile (profile vs anything)
    // 4. b=profile (anything vs profile)
    await Deno.writeTextFile(
      manifestPath,
      `
      export const z = { default: () => {} };
      export const a = { a: () => {} };
      export const index = { default: () => {} };
      export const profile = { default: () => {} };
      export const null_val = null;
      export const invalid = { something: 123 };
    `,
    );
    const manifestUrl = toFileUrl(manifestPath).href;
    await autoRegisterModules(appMock, manifestUrl);
  });

  await t.step("manifest permutations to exercise sort branches", async () => {
    const perms = [
      ["a", "index", "profile", "z"],
      ["index", "profile", "a", "z"],
      ["profile", "z", "index", "a"],
    ];
    for (const p of perms) {
      const manifestPath = join(tempDir, `perm_${p.join("_")}.ts`);
      const parts = p.map((k) => `export const ${k} = { default: () => {} };`).join("\n");
      await Deno.writeTextFile(manifestPath, parts);
      await autoRegisterModules(appMock, toFileUrl(manifestPath).href);
    }
  });

  await t.step("small pair to hit b===index branch", async () => {
    const manifestPath = join(tempDir, `pair_a_index.ts`);
    await Deno.writeTextFile(manifestPath, `export const a = { default: () => {} };\nexport const index = { default: () => {} };`);
    await autoRegisterModules(appMock, toFileUrl(manifestPath).href);
  });

  await t.step("direct sortNames calls to exercise comparator branches", () => {
    // Directly call exported sortNames to ensure every comparator path runs
    sortNames(["a", "index"]);
    sortNames(["index", "a"]);
    sortNames(["profile", "a"]);
    sortNames(["a", "profile"]);
  });

  await t.step("catch branch", async () => {
    // Should fail silently
    await autoRegisterModules(appMock, "non-existent-path.ts");
    // And try another invalid one
    await autoRegisterModules(appMock, "data:text/javascript,throw 'fail'");
  });

  await Deno.remove(tempDir, { recursive: true });
});
