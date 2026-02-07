import { autoRegisterModules } from "../core/loader.ts";

async function main() {
  const used: unknown[] = [];
  const app = {
    use(mw: unknown) {
      used.push(mw);
    },
  };

  console.log("Simulating Deno Deploy Classic: setting DENO_DEPLOYMENT_ID=1");
  Deno.env.set("DENO_DEPLOYMENT_ID", "1");

  await autoRegisterModules(app);

  console.log(`Registered middlewares: ${used.length}`);
  for (const [i, m] of used.entries()) {
    console.log(i + 1, typeof m);
  }
}

if (import.meta.main) main();
