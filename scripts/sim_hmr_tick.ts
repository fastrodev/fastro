#!/usr/bin/env -S deno run -A
import {
  _setLastMtimeForTests,
  _watchTickForTests,
} from "../middlewares/render/render.ts";

const buildFile = ".build_done";

async function touchBuildDone() {
  const now = Date.now().toString();
  try {
    await Deno.writeTextFile(buildFile, now);
  } catch (e) {
    console.error("Failed to write .build_done:", e);
    Deno.exit(2);
  }
}

async function main() {
  try {
    // Read current mtime and set it so watcher can detect a change
    try {
      const st = await Deno.stat(buildFile);
      const m = st.mtime?.getTime() || 0;
      _setLastMtimeForTests(m);
      console.log("Existing .build_done mtime set to", m);
    } catch (_) {
      _setLastMtimeForTests(0);
      console.log("No existing .build_done file; starting from 0");
    }

    // Update the file to simulate a build completion
    await touchBuildDone();
    console.log("Touched .build_done");

    // Small delay to ensure filesystem updates settle
    await new Promise((r) => setTimeout(r, 50));

    console.log("Invoking _watchTickForTests()...");
    await _watchTickForTests();
    console.log("_watchTickForTests complete");
  } catch (e) {
    console.error(e);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
