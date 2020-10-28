// Copyright 2020 the Fastro author. All rights reserved. MIT license.

export abstract class Collection<T> {
  constructor(name: string) {
    this.name = name;
  }
  private name!: string;
  private collection: T[] = [];

  public async write() {
    const d = JSON.stringify(this.collection);
    const file = `${this.name}.json`;
    await Deno.writeTextFile(file, d);
  }

  create(item: T): Promise<boolean> {
    const before = this.collection.length;
    const after = this.collection.push(item);
    return Promise.resolve(before < after);
  }

  // deno-lint-ignore no-explicit-any
  update(condition: any, item: T): Promise<T> {
    const [data] = this.collection
      .map((v, i) => {
        return { v, i };
      })
      .filter((data) => this.compare(condition, data.v));
    this.collection[data.i] = item;
    return Promise.resolve(this.collection[data.i]);
  }

  // deno-lint-ignore no-explicit-any
  delete(condition: any): Promise<T[]> {
    const data = this.collection
      .map((v, i) => {
        return { v, i };
      })
      .filter((data) => {
        return this.compare(condition, data.v);
      });
    data.forEach((item) => {
      this.collection.splice(item.i, 1);
    });
    return Promise.resolve(this.collection);
  }

  // deno-lint-ignore no-explicit-any
  findOne(condition: any): Promise<T> {
    const item = this.collection.filter((v) => {
      return this.compare(condition, v);
    });
    const [r] = item;
    return Promise.resolve(r);
  }

  // deno-lint-ignore no-explicit-any
  find(condition?: any): Promise<T[]> {
    const item = this.collection.filter((v) => {
      return this.compare(condition, v);
    });
    return Promise.resolve(item);
  }

  // deno-lint-ignore no-explicit-any
  private comparable(value: any) {
    const compare = [
      "$lt",
      "$lte",
      "$gt",
      "$gte",
      "$in",
      "$nin",
      "$ne",
      "$exists",
      "$regex",
    ];
    const [key] = Object.keys(value);
    return compare.includes(key);
  }

  private queryHandler(result: boolean, target?: string, regex?: RegExp) {
    if (target && regex) return result && regex.test(target);
    return result;
  }

  // deno-lint-ignore no-explicit-any
  private nextCompare(comparator: any, target: any) {
    const [operator, regex] = Object.keys(comparator);
    const value = comparator[operator];
    const regexValue = comparator[regex];
    if (operator === "$gt") {
      return this.queryHandler(target > value, target, regexValue);
    }
    if (operator === "$gte") {
      return this.queryHandler(target >= value, target, regexValue);
    }
    if (operator === "$lt") {
      return this.queryHandler(target < value, target, regexValue);
    }
    if (operator === "$lte") {
      return this.queryHandler(target <= value, target, regexValue);
    }
    if (operator === "$ne") {
      return this.queryHandler(target !== value, target, regexValue);
    }
    if (operator === "$exists") {
      return this.queryHandler(target && value, target, regexValue);
    }
    if (operator === "$in") {
      // deno-lint-ignore no-explicit-any
      const valueArray = value as any[];
      const result = valueArray.includes(target);
      return this.queryHandler(result, target, regexValue);
    }
    if (operator === "$nin") {
      // deno-lint-ignore no-explicit-any
      const valueArray = value as any[];
      const result = !valueArray.includes(target);
      return this.queryHandler(result, target, regexValue);
    }

    if (operator === "$regex") {
      const regex = new RegExp(value);
      regex.test(target);
      return this.queryHandler(regex.test(target));
    }
    return false;
  }

  // deno-lint-ignore no-explicit-any
  private contain(target: any, condition: any) {
    const keys = Object.keys(condition);
    for (const key of keys) {
      const ckey = condition[key];
      if (this.comparable(ckey)) return this.nextCompare(ckey, target[key]);
      if (ckey !== target[key]) {
        if (
          typeof ckey == "object" && typeof target[key] == "object"
        ) {
          if (!this.contain(ckey, target[key])) return false;
        } else return false;
      }
    }

    return true;
  }

  // deno-lint-ignore no-explicit-any
  private compare(condition: any, target: any) {
    return this.contain(target, condition);
  }
}
