import { FunctionComponent, Page } from "../server/types.ts";
import { build } from "./build.ts";
import { esbuild } from "./deps.ts";

export class EsbuildMod {
  #elementName: string;

  constructor(c: Page) {
    const fc = c.component as FunctionComponent;
    this.#elementName = fc.name;
  }

  build = async () => {
    return await build(this.#elementName);
  };

  stop = () => {
    esbuild.stop();
  };
}
