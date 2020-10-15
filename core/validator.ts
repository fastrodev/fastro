import type { Schema } from "./types.ts";

// deno-lint-ignore no-explicit-any
export function validateObject(target: any, schema: Schema) {
  const { required, properties } = schema;
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

  if (!properties) {
    return { message: "schema property is missing.", error: true };
  }

  for (const key in properties) {
    if (!target[key]) return { message: `${key} empty`, error: true };

    if (
      properties[key].type === "object" && (typeof target[key] === "object")
    ) {
      const objProperty = properties[key].properties;
      // deno-lint-ignore no-explicit-any
      const schemaProperties: any = {};
      for (const objKey in objProperty) {
        schemaProperties[objKey] = objProperty[objKey];
      }
      const schema: Schema = { type: "object", properties: schemaProperties };
      const result = validateObject(target[key], schema);
      if (result.error) {
        // deno-lint-ignore no-explicit-any
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
