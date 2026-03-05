import {
  autoRegisterModules,
  cookieMiddleware,
  createRenderMiddleware,
  Fastro as App,
  logger,
  staticFiles,
  tailwind,
} from "./deps.ts";

const app = new App();
app.use(createRenderMiddleware());
app.use(logger);
app.use(cookieMiddleware);
app.use(tailwind("/css/app.css"));

app.use(
  staticFiles("/", "./public", { indexFile: "" }),
);
const dep = Deno.env.get?.("DENO_DEPLOYMENT_ID");
if (dep) {
  const manifest = await import("./manifest.ts");
  await autoRegisterModules(app, {
    manifest: manifest as unknown as Record<string, unknown>,
    requireExplicitGlobals: true,
  });
} else {
  await autoRegisterModules(app, { requireExplicitGlobals: true });
}

export default app;
