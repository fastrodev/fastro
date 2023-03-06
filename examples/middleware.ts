import { Status, STATUS_TEXT } from "../server/deps.ts";
import fastro, { HttpRequest, HttpResponse, Next } from "../server/mod.ts";

const f = fastro();

const appMiddleware = (
  req: HttpRequest,
  res: HttpResponse,
  next: Next,
) => {
  if (req.method === "POST") {
    return res
      .status(Status.Forbidden)
      .json({
        status: Status.Forbidden,
        text: STATUS_TEXT[Status.Forbidden],
      });
  }
  next();
};

const getMiddleware = (_req: HttpRequest, res: HttpResponse, _next: Next) => {
  console.log("getMiddleware");
  return res.status(Status.Forbidden)
    .json({
      status: Status.Forbidden,
      text: STATUS_TEXT[Status.Forbidden],
    });
};

const putMiddleware = (_req: HttpRequest, _res: HttpResponse, next: Next) => {
  console.log("putMiddleware");
  next();
};

const deleteMiddleware = (
  _req: HttpRequest,
  _res: HttpResponse,
  next: Next,
) => {
  console.log("deleteMiddleware");
  next();
};

const optionsMiddleware = (
  _req: HttpRequest,
  _res: HttpResponse,
  next: Next,
) => {
  console.log("optionsMiddleware");
  next();
};

f.use(appMiddleware);
f.get(
  "/",
  putMiddleware,
  deleteMiddleware,
  optionsMiddleware,
  getMiddleware,
  () => "Hello world",
);

await f.serve();
