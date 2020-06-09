import { Controller, Get, Request, InjectService } from "../../mod.ts";
import { HelloService } from "./hello.service.ts";

@Controller({ prefix: "v1" })
export class Hello {
  @InjectService(HelloService)
  service!: HelloService;

  @Get()
  async hello(req: Request) {
    const msg = await this.service.hello();
    req.send(msg);
  }

  @Get({ url: "/hi" })
  hi(req: Request) {
    req.send("hi");
  }
}
