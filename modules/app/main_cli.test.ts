import { assertEquals } from "https://deno.land/std@0.210.0/assert/mod.ts";

Deno.test("main.ts - CLI execution", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      "modules/app/main.ts",
      "3338",
    ],
    stdout: "piped",
    stderr: "piped",
    env: {
      DENO_V8_COVERAGE: "coverage",
    },
  });

  const process = command.spawn();

  // Wait a bit for the server to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const res = await fetch("http://localhost:3338/");
    assertEquals(res.status, 200);
    await res.text(); // Consume body
  } finally {
    process.kill();
    await process.status;
    await process.stdout.cancel(); // Close streams
    await process.stderr.cancel();
  }
});
