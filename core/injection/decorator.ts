import {
  methodContainer,
  controllerContainer,
  gatewayContainer,
  Controller,
  gatewayControllerContainer,
  serviceContainer,
} from "./container.ts";

export function InjectService(service: Function) {
  return (prototype: any, propertyName: string): any => {
    Object.defineProperty(prototype, propertyName, {
      get(): any {
        return serviceContainer.get(service.name);
      },
      enumerable: true,
      configurable: true,
    });
  };
}

export function Service(): ClassDecorator {
  return (target: any): any => {
    const serviceInstance = new target();
    serviceContainer.set(target.name, serviceInstance);
  };
}

export function Gateway(options?: { prefix: string }): ClassDecorator {
  return (target: any): any => {
    const instance = new target();
    const gatewayName = target.name;
    const gatewayInstance = { gatewayName, instance, options };
    gatewayContainer.set(gatewayName, gatewayInstance);
  };
}

export function InjectController(controller: Function) {
  return (prototype: any, propertyName: string): any => {
    const className = prototype.constructor.name;
    const existingController = controllerContainer.get(controller.name);
    const gatewayController = { className, controller: existingController };
    gatewayControllerContainer.push(gatewayController);
  };
}

export function Controller(options?: { prefix: string }): ClassDecorator {
  return (target: any): any => {
    const instance: Controller = new target();
    const controllerName = target.name;
    const methodList = methodContainer.filter((method) =>
      method.className === controllerName
    );
    const controllerInstance = {
      instance,
      options,
      methodList,
      controllerName,
    };
    controllerContainer.set(controllerName, controllerInstance);
  };
}

function pushMethod(options: any): Function {
  return (target: any, functionName: string): any => {
    const className = target.constructor.name;
    const method = options.url
      ? { className, functionName, options }
      : { className, functionName, options: { ...options, url: "/" } };
    methodContainer.push(method);
  };
}

export const Get = (options?: { url: string }) =>
  pushMethod({ method: "GET", ...options });

export const Post = (options?: { url: string }) =>
  pushMethod({ method: "POST", ...options });

export const Delete = (options?: { url: string }) =>
  pushMethod({ method: "DELETE", ...options });

export const Head = (options?: { url: string }) =>
  pushMethod({ method: "HEAD", ...options });

export const Patch = (options?: { url: string }) =>
  pushMethod({ method: "PATCH", ...options });

export const Put = (options?: { url: string }) =>
  pushMethod({ method: "PUT", ...options });

export const Options = (options?: { url: string }) =>
  pushMethod({ method: "OPTIONS", ...options });
