import { Controller, Get, Request } from "../../mod.ts";
@Controller()
class Root {
  @Get()
  hello(req: Request) {
    req.send("hello");
  }

  @Get({ url: "/hi" })
  hi(req: Request) {
    req.send("hi");
  }
}
