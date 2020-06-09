import { Gateway, InjectController } from "../../mod.ts";
import { Hello } from "./hello.controller.ts";
import { Root } from "./root.controller.ts";

@Gateway({ prefix: "mobile" })
export class Mobile {
  @InjectController(Hello)
  hello!: Hello;

  @InjectController(Root)
  root!: Root;
}
