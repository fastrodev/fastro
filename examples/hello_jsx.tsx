import application from "../server/mod.ts";

const app = application();

app.get("/", () => <h1>Hello jsx</h1>);

await app.serve();
