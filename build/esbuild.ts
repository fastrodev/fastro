import { hydrateFolder } from "../http/server.ts";
import { build } from "./build.ts";
import { esbuild } from "./deps.ts";

export class Esbuild {
  #elementName: string;

  constructor(name: string) {
    this.#elementName = name;
  }

  build = async () => {
    await build(hydrateFolder, this.#elementName);
  };

  stop = () => {
    esbuild.stop();
  };
}
