import { Controller, Get } from "../../src/decorator.ts";
@Controller()
class Greet {
  @Get(true)
  hello(name: string) {
    // request.send("hello");
  }
}
