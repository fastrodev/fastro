import {
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.177.0/http/http_status.ts";
import fastro from "../server/mod.ts";

const f = fastro();

f.use(
  (req, res, next) => {
    if (req.method === "POST") {
      return res
        .status(Status.Forbidden)
        .json({
          status: Status.Forbidden,
          text: STATUS_TEXT[Status.Forbidden],
        });
    }
    next();
  },
);
f.get("/", () => "Hello world");

await f.serve();
