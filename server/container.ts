import { CACHE, TIMEOUT } from "./constant.ts";
import { Container, Data, SetOptions } from "./types.ts";

export function createContainer(t?: number): Container {
  const SECOND = 1000;
  const objects = new Map<string, Data>();
  const timeout = t ?? TIMEOUT;
  const timeoutId = setInterval(() => {
    const object: Data = {
      key: CACHE,
      value: {},
      isExpired: false,
      expiryTime: 0,
    };
    objects.set(CACHE, object);
  }, timeout * SECOND);

  return {
    objects: () => objects,
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
        : TIMEOUT;

      const isExpired = options && options.isExpired
        ? options?.isExpired
        : false;

      if (isExpired) {
        const expiryTime = Date.now() + expirySeconds * 1000;
        const object: Data = { key, value, isExpired, expiryTime };
        const timeoutId = setTimeout(() => {
          removeExpiredObject(object);
        }, expirySeconds * SECOND);
        object.timeoutId = timeoutId;
        return objects.set(key, object);
      } else {
        objects.set(key, { key, value, isExpired, expiryTime: 0 });
      }
    },

    get: <T>(key: string) => {
      const object = objects.get(key);
      if (object && !object.isExpired) return <T> object.value;
      else if (object && object.isExpired && object.expiryTime > Date.now()) {
        return <T> object.value;
      }
      return null;
    },
    clearInterval: () => {
      return clearInterval(timeoutId);
    },
  };

  function removeExpiredObject(object: Data) {
    if (object.timeoutId) {
      clearTimeout(object.timeoutId);
    }
    objects.delete(object.key);
  }
}
