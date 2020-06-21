import { Request } from "../mod.ts";

export const support = (req: Request, done: Function) => {
  req.somesupport = "somesupport";
  done();
};

export const sendOk = (req: Request, done: Function) => {
  const token = new Date().getTime().toString();
  req.sendOk = (payload: string) => {
    const headers = new Headers();
    headers.set("X-token", token);
    req.send(payload, 200, headers);
  };
  done();
};
