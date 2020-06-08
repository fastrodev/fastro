export const gatewayControllerContainer: any[] = [];
export const gatewayContainer = new Map<string | symbol | Object, any>();
export const controllerContainer = new Map<string, Controller>();
export const serviceContainer = new Map<string | symbol | Object, any>();
export const methodContainer: any[] = [];
export const hookContainer: any[] = [];
export const gatewayHookContainer: any[] = [];
export const pluginContainer: any[] = [];
export const token = Symbol("token");

export interface Controller {
  instance: any;
  options: any;
  methodList: any[];
}
