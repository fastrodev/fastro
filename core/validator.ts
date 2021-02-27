// Copyright 2020 - 2021 the Fastro author. All rights reserved. MIT license.

import { Data, Schema } from "./types.ts";
import { createError } from "./utils.ts";

export function validateObject(target: Data | number, schema: Schema) {
  try {
    const { required, properties, type, items } = schema;
    if (typeof target !== "number" && required && required.length > 0) {
      const empty = required.filter((field) => !target[field]);
      if (empty.length > 0) {
        const message = empty.length === 1
          ? `${empty.toString()} is required`
          : `[${empty.toString()}] are required`;
        throw new Error(`${message}`);
      }
    }

    if (type === "integer" && !Number.isInteger(target)) {
      throw new Error(`${target} type is not ${type}`);
    }

    const single = ["boolean", "string", "number", "null"];
    if (single.includes(type) && (typeof target !== type)) {
      throw new Error(`${target} type is not ${type}`);
    }

    if (type === "array" && !items) {
      throw new Error(`array items property is missing`);
    }

    if (
      typeof target !== "number" && type === "array" && Array.isArray(items)
    ) {
      items.forEach((val, index) => {
        let arrayItemSchema: Schema = {
          type: val.type,
        };

        if (val.properties) {
          arrayItemSchema = {
            type: val.type,
            properties: val.properties,
          };
        }
        validateObject(target[index], arrayItemSchema);
      });
    }

    if (type === "object" && !properties) {
      throw new Error(`schema property is missing`);
    }

    for (const key in properties) {
      if (typeof target !== "number" && !target[key]) {
        throw new Error(`${key} empty`);
      }

      if (
        properties[key].type === "object" && typeof target !== "number" &&
        (typeof target[key] === "object")
      ) {
        const objProperty = properties[key].properties;
        const requiredProperty = properties[key].required;
        const schemaProperties: Data = {};

        for (const objKey in objProperty) {
          schemaProperties[objKey] = objProperty[objKey];
        }

        let schema: Schema = { type: "object", properties: schemaProperties };
        if (requiredProperty) {
          schema = { type: "object", required: requiredProperty };
        }

        validateObject(target[key], schema);
      }

      if (
        properties[key].type === "array" && typeof target !== "number" &&
        !Array.isArray(target[key])
      ) {
        throw new Error(`${key} type is ${properties[key].type}`);
      }

      if (
        properties[key].type === "integer" && typeof target !== "number" &&
        !Number.isInteger(target[key])
      ) {
        throw new Error(`${key} type is ${properties[key].type}`);
      }

      if (
        properties[key].type === "array" && typeof target !== "number" &&
        Array.isArray(target[key]) && target[key].length === 0
      ) {
        throw new Error(`array items empty`);
      }

      if (
        typeof target !== "number" &&
        properties[key].type !== "integer" &&
        properties[key].type !== "array" &&
        (properties[key].type !== typeof target[key])
      ) {
        throw new Error(`${key} is ${properties[key].type}`);
      }
    }
    return target;
  } catch (error) {
    throw createError("VALIDATE_OBJECT_ERROR", error);
  }
}
