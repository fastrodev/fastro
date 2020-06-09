import { Controller, Get, Request } from "../../mod.ts";

@Controller()
export class Root {
  @Get()
  hello(req: Request) {
    req.send("root");
  }
}
