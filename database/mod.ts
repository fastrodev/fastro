// deno-lint-ignore-file no-unused-vars
export type Key = Deno.KvKey;

interface Database {
  insert(key: Key, data: unknown): void;
  delete(key: number): void;
  update(key: Key, data: unknown): void;
  read(key: Key): void;
}

export class Db implements Database {
  constructor() {
  }

  insert(key: Deno.KvKey, data: unknown): void {
    throw new Error("Method not implemented.");
  }
  delete(key: number): void {
    throw new Error("Method not implemented.");
  }
  update(key: Deno.KvKey, data: unknown): void {
    throw new Error("Method not implemented.");
  }
  read(key: Deno.KvKey): void {
    throw new Error("Method not implemented.");
  }
}
