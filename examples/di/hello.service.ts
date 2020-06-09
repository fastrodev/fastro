import { Service } from "../../mod.ts";

@Service()
export class HelloService {
  async hello(): Promise<string> {
    return "Hello from service";
  }
}
