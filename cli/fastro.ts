import { serve, getVersion, init } from "./handlers.ts";
const [command] = Deno.args;
if (command === "serve") serve();
if (command === "init") init();
if (command === "version") getVersion();