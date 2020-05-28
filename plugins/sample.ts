import { Request } from "../mod.ts";

export const support = (req: Request) => {
  req.somesupport = "somesupport";
};

export const sendOk = (req: Request) => {
  const token = new Date().getTime().toString();
  req.sendOk = (payload: string) => {
    const headers = new Headers();
    headers.set("X-token", token);
    return req.send(payload, 200, headers);
  };
};
