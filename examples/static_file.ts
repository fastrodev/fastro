import application from "../server/mod.ts";

const app = application();

/**
 * Place your files in the static folder
 *
 * ```ts
 * app.static("/static");
 * ```
 *
 * Place your files in the app root folder
 *
 * ```ts
 * app.static("/");
 * ```
 *
 * Place your files in the app root folder with 30s maxAge cache expiration time
 *
 * ```ts
 * app.static("/", 30);
 * ```
 */
app.static("/public");

await app.serve();
