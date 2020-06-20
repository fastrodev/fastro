import { Fastro } from "../../mod.ts";
import { loader } from "./loader.ts";
import {
  gatewayContainer,
  gatewayControllerContainer,
  controllerContainer,
  Controller,
  Gateway,
} from "./container.ts";

const createRoutes = (controller: Controller) => {
  // console.log(controller)
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
      const registeredController = gatewayControllerContainer
        .filter((item) =>
          item.controller.controllerName === controller.controllerName
        );
      // skip registered controller on route creation
      if (registeredController.length > 0) return;
      const routes = createRoutes(controller);
      if (controller.options) {
        fastro.register(controller.options.prefix, routes);
      } else fastro.register(routes);
    });
    done();
  };
}

function createGatewayController(gateway: Gateway) {
  const controllers = gatewayControllerContainer
    .filter((controller) => controller.className === gateway.gatewayName)
    .map((i) => i.controller);

  return (fastro: Fastro, done: Function) => {
    controllers.forEach((controller) => {
      const routes = createRoutes(controller);
      let ctrlPrefix = controller.options ? controller.options.prefix : "";
      if (!gateway.options) return fastro.register(ctrlPrefix, routes);
      let gatewayPrefix = ctrlPrefix !== ""
        ? `${gateway.options.prefix}/${ctrlPrefix}`
        : gateway.options.prefix;
      fastro.register(gatewayPrefix, routes);
    });
    done();
  };
}

function createGateways() {
  return (fastro: Fastro, done: Function) => {
    gatewayContainer.forEach((gateway) => {
      const gatewayController = createGatewayController(gateway);
      return fastro.register(gatewayController);
    });
    done();
  };
}

export async function createServer() {
  await loader();
  const server = new Fastro();
  const gateways = createGateways();
  const controllers = createControllers();
  server.register(gateways);
  server.register(controllers);
  return server;
}
