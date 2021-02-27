import { Request } from "../mod.ts";

export default function (request: Request) {
  request
    .status(200)
    .type("text/html")
    .send("setup complete");
}
