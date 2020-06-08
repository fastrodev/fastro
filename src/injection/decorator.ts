import {
  methodContainer,
  controllerContainer,
  Controller,
} from "./container.ts";

function pushMethod(options: any): Function {
  return (target: any, functionName: string): any => {
    const className = target.constructor.name;
    const method = options.url
      ? { className, functionName, options }
      : { className, functionName, options: { ...options, url: "/" } };
    methodContainer.push(method);
  };
}

export const Get = (options?: { url: string }): Function =>
  pushMethod({ method: "GET", ...options });

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
