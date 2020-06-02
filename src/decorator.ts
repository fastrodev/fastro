export function Get(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log(target);
    descriptor.enumerable = value;
  };
}

export function Controller(options?: any): ClassDecorator {
  return (target: any): any => {
    console.log(target);
  };
}
