import { Container, Data, SetOptions } from "./types.ts";

export function createContainer(): Container {
  const objects = new Map<string, Data>();

  return {
    size: () => objects.size,
    clear: () => objects.clear(),
    delete: (key: string) => objects.delete(key),
    set: <T>(
      key: string,
      value: T,
      options?: SetOptions,
    ) => {
      const expirySeconds = options && options.expirySeconds
        ? options.expirySeconds
        : 10;

      const isExpired = options && options.isExpired
        ? options?.isExpired
        : false;

      const expiryTime = Date.now() + expirySeconds * 1000;
      const object: Data = { key, value, isExpired, expiryTime };

      if (isExpired) {
        const timeoutId = setTimeout(() => {
          removeExpiredObject(object);
        }, expirySeconds * 1000);
        object.timeoutId = timeoutId;
      }

      objects.set(key, object);
    },

    get: <T>(key: string) => {
      const object = objects.get(key);
      if (object && !object.isExpired) return <T> object.value;
      else if (object && object.isExpired && object.expiryTime > Date.now()) {
        return <T> object.value;
      }
      return null;
    },
  };

  function removeExpiredObject(object: Data) {
    if (object.timeoutId) {
      clearTimeout(object.timeoutId);
    }
    objects.delete(object.key);
  }
}
