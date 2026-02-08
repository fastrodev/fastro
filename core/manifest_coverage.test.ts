Deno.test("include manifest in coverage", async () => {
  // Import manifest so coverage tooling has its transpiled source available
  // This test is intentionally minimal and only ensures the file is loaded
  const m = await import("../manifest.ts");
  if (!m) throw new Error("manifest did not load");
});
