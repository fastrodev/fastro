import type { Request } from "../mod.ts";
export const handler = (request: Request) => {
  request
    .status(200)
    .type("text/html")
    .send("setup complete");
};
