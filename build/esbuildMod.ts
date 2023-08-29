import { PageComponent } from "../http/server.ts";
import { FunctionComponent } from "../mod.ts";
import { build } from "./build.ts";
import { esbuild } from "./deps.ts";

export class EsbuildMod {
  #elementName: string;
  #folder: string;

  constructor(c: PageComponent) {
    const fc = c.component as FunctionComponent;
    this.#elementName = fc.name;
    this.#folder = c.folder;
  }

  build = async () => {
    await build(this.#folder, this.#elementName);
  };

  stop = () => {
    esbuild.stop();
  };
}
