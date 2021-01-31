import type { Request } from "../mod.ts";

export default (request: Request) => {
  request
    .status(200)
    .type("text/html")
    .send("setup complete");
};
