import { Controller, Get, Request } from "../../mod.ts";
@Controller()
class Greet {
  @Get()
  hello(req: Request) {
    req.send('hello')
  }
}
