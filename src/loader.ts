import { glob } from "./modules/glob.ts";

export const loader = () => {
  const target = Deno.cwd();
  glob("controller,service", target)
    .then((files) => {
      files.forEach((file) => {
        import(file);
      });
    });
};

// export const pluginsLoader = async (): Promise<any[]> => {
//   return moduleLoader('**/*.plugin.*s')
// }
