// deno-lint-ignore-file
import type { Schema } from "./types.ts";

export function validateObject(target: any, schema: Schema) {
  const { required, properties, type, items } = schema;
  let message = "";
  if (required && required.length > 0) {
    const empty = required.filter((field) => !target[field]);
    if (empty.length > 0) {
      message = empty.length === 1
        ? `${empty.toString()} is required`
        : `[${empty.toString()}] are required`;
      return { message, error: true };
    }
  }

  const single = ["boolean", "string", "number", "null"];

  if (type === "integer" && !Number.isInteger(target)) {
    return { message: `${target} type is not ${type}`, error: true };
  }

  if (single.includes(type) && (typeof target !== type)) {
    return { message: `${target} type is not ${type}.`, error: true };
  }

  if (type === "array" && !items) {
    return { message: "array items property is missing.", error: true };
  }

  if (type === "array" && Array.isArray(items)) {
    const [result] = items
      .map((item, index) => {
        return { item, index };
      })
      .filter((val, index) => {
        let arrayItemSchema: Schema = {
          type: val.item.type,
        };

        if (val.item.properties) {
          arrayItemSchema = {
            type: val.item.type,
            properties: val.item.properties,
          };
        }
        const result = validateObject(target[index], arrayItemSchema);
        return result.error === true;
      });
    if (result) {
      const resType: any = result.item.type;
      const idx: number = result.index;
      return { message: `${target[idx]} is not ${resType}`, error: true };
    }
  }

  if (type === "object" && !properties) {
    return { message: "schema property is missing.", error: true };
  }

  for (const key in properties) {
    if (!target[key]) return { message: `${key} empty`, error: true };

    if (
      properties[key].type === "object" && (typeof target[key] === "object")
    ) {
      const objProperty = properties[key].properties;
      const schemaProperties: any = {};
      for (const objKey in objProperty) {
        schemaProperties[objKey] = objProperty[objKey];
      }
      const schema: Schema = { type: "object", properties: schemaProperties };
      const result = validateObject(target[key], schema);
      if (result.error) {
        const message: any = result.message;
        return { message, error: true };
      }
    }

    if (properties[key].type === "array" && !Array.isArray(target[key])) {
      message = `${key} type is ${properties[key].type}`;
      return { message, error: true };
    }

    if (properties[key].type === "integer" && !Number.isInteger(target[key])) {
      message = `${key} type is ${properties[key].type}`;
      return { message, error: true };
    }

    if (
      properties[key].type === "array" && Array.isArray(target[key]) &&
      target[key].length === 0
    ) {
      message = `array items empty`;
      return { message, error: true };
    }

    if (
      properties[key].type !== "integer" &&
      properties[key].type !== "array" &&
      (properties[key].type !== typeof target[key])
    ) {
      message = `${key} is ${properties[key].type}`;
      return { message, error: true };
    }
  }
  return target;
}
