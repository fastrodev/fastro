import { kv } from "@app/utils/db.ts";
import { createTaskQueue } from "../../utils/queue.ts";

type StoreOptions = {
  key: string;
  namespace?: Array<string>;
} | null;

export class Store<K extends string | number | symbol, V> {
  private map: Map<K, { value: V; expiry?: number }>;
  private options: StoreOptions;
  private intervalId: number | null = null;
  private taskQueue = createTaskQueue();

  constructor(options: StoreOptions = null) {
    this.map = new Map<K, { value: V; expiry?: number }>();
    this.options = options;
  }

  /**
   * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
   * @param key
   * @param value
   * @param ttl
   */
  set(key: K, value: V, ttl?: number) {
    const expiry = ttl ? Date.now() + ttl : undefined;
    this.map.set(key, { value, expiry });
    return this;
  }

  /**
   * @param key
   * @returns boolean indicating whether an element with the specified key exists or not.
   */
  check(key: K) {
    if (this.map.has(key)) {
      throw new Error(`Key ${String(key)} is already used`);
    }

    return this;
  }

  /**
   * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
   * @returns - Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
   */
  async get(key: K) {
    await this.syncMap();
    const entry = this.map.get(key);
    if (entry) {
      if (entry.expiry === undefined || Date.now() < entry.expiry) {
        return entry.value;
      } else {
        this.map.delete(key);
      }
    }
    return undefined;
  }

  /**
   * @param key
   * @returns boolean indicating whether an element with the specified key exists or not.
   */
  async has(key: K) {
    await this.syncMap();
    const entry = this.map.get(key);
    if (entry) {
      if (entry.expiry === undefined || Date.now() < entry.expiry) {
        return true;
      } else {
        this.map.delete(key);
      }
    }
    return false;
  }

  /**
   * @param key
   * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
   */
  delete(key: K): boolean {
    return this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
  }

  /**
   * @returns the number of elements in the Map.
   */
  size(): number {
    this.cleanUpExpiredEntries();
    return this.map.size;
  }

  /**
   * @returns an iterable of key, value pairs for every entry in the map.
   */
  entries() {
    this.cleanUpExpiredEntries();
    return this.map.entries();
  }

  /**
   * @returns an iterable of values in the map
   */
  values() {
    this.cleanUpExpiredEntries();
    return this.map.values();
  }

  /**
   * @returns an iterable of keys in the map
   */
  keys() {
    this.cleanUpExpiredEntries();
    return this.map.keys();
  }

  /**
   * Executes a provided function once per each key/value pair in the Map, in insertion order.
   * @param callback
   */
  forEach(callback: (value: V, key: K) => void): void {
    this.cleanUpExpiredEntries();
    this.map.forEach((entry, key) => {
      callback(entry.value, key);
    });
  }

  /**
   * Save to github with queue
   */
  commit = async () => {
    return await this.taskQueue.process(this.commiting, this.options);
  };

  private commiting = async (options?: StoreOptions) => {
    if (!options) return;
    this.cleanUpExpiredEntries();

    const key = options.namespace
      ? [options.key, ...options.namespace]
      : [options.key];
    return await kv.atomic()
      .set(key, this.map)
      .commit();
  };

  /**
   * Save the map to the repository periodically at intervals
   * @param interval
   * @returns intervalId
   */
  sync(interval: number = 5000) {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (this.map.size === 0) return;
      this.taskQueue.process(this.commiting, this.options);
    }, interval);
    return this.intervalId;
  }

  /**
   * Delete file from repository
   */
  destroy() {
    try {
      if (this.intervalId) clearInterval(this.intervalId);
      this.map.clear();
      return this;
    } catch (error) {
      throw error;
    }
  }

  public async syncMap() {
    if (this.map.size === 0 && this.options) {
      const key = this.options.namespace
        ? [this.options.key, ...this.options.namespace]
        : [this.options.key];
      const res = await kv.get(key);

      // deno-lint-ignore no-explicit-any
      const map = res.value as Map<any, any>;
      if (!map) return false;
      this.map = map;
      this.cleanUpExpiredEntries();
      await this.commit();
    }

    return true;
  }

  private cleanUpExpiredEntries(): void {
    let count = 0;
    for (const [key, entry] of this.map.entries()) {
      if (entry.expiry !== undefined && Date.now() >= entry.expiry) {
        this.map.delete(key);
        count++;
      }
    }
  }
}
