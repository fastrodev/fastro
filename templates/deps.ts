import { FASTRO_VERSION } from "../core/constant.ts";

export const depsTemplate = `// Define container type
// You can customize this type according to your needs
export type Container = {
  db: any;
};

// Dependency injection: https://en.wikipedia.org/wiki/Dependency_injection#Other_types
// You can put all your dependencies to this variable
const container: Container = {
  db: new Promise((resolve) => resolve("connected!")),
};


export default () => container;

// Define your external dependencies here
export { Request } from "https://deno.land/x/fastro@v${FASTRO_VERSION}/mod.ts";
export { React };
import * as React from "https://esm.sh/react";

`;
