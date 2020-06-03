import { methodContainer, controllerContainer } from "./container.ts";

function pushMethod(options: any): Function {
  // console.log(methodContainer)
  return (target: any, functionName: string): any => {
    const className = target.constructor.name;
    const method = options.url
      ? { className, functionName, options }
      : { className, functionName, options: { ...options, url: "/" } };
    methodContainer.push(method);
    // console.log(methodContainer)
  };
}

export const Get = (options?: any): Function =>
  pushMethod({ method: "GET", ...options });

export function Controller(options?: any): ClassDecorator {
  return (target: any): any => {
    const instance = new target();
    const controllerName = target.name;
    const methodList = methodContainer.filter((method) =>
      method.className === controllerName
    );
    const controllerInstance = options
      ? { instance, options, methodList, controllerName }
      : { instance, options: { prefix: "/" }, methodList, controllerName };
    controllerContainer.set(controllerName, controllerInstance);
  };
}
