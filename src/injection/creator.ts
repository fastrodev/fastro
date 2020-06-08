import { Fastro } from "../../mod.ts";
import { loader } from "./loader.ts";
import {
  methodContainer,
  controllerContainer,
  Controller,
} from "./container.ts";

const createRoutes = (controller: Controller) => {
  const { instance, methodList } = controller;
  return (fastro: Fastro, done: Function) => {
    methodList.forEach((method) => {
      const { functionName, options } = method;
      const handler: any = async (...args: any) =>
        instance[functionName](...args);
      const routeOptions = { ...options, handler };
      fastro.route(routeOptions);
    });
    done();
  };
};

function createControllers() {
  return (fastro: Fastro, done: Function) => {
    controllerContainer.forEach((controller) => {
      const routes = createRoutes(controller);
      if (controller.options) {
        fastro.register(controller.options.prefix, routes);
      } else fastro.register(routes);
    });
    done();
  };
}

export async function createServer() {
  await loader();
  const server = new Fastro();
  const controllers = createControllers();
  server.register(controllers);
  return server;
}
