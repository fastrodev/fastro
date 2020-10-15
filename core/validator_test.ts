import { assertEquals } from "../deps.ts";
import type { Schema } from "../mod.ts";
import { validateObject } from "../mod.ts";

const schema: Schema = {
  type: "object",
  required: ["name"],
  properties: {
    address: {
      type: "object",
      properties: {
        city: { type: "string" },
        street: { type: "string" },
        number: { type: "number" },
      },
    },
    child: {
      type: "array",
      items: [{ type: "string" }, { type: "string" }],
    },
    numOfHouse: { type: "integer" },
    name: { type: "string" },
  },
};

Deno.test({
  name: "VALIDATION - SINGLE - INTEGER",
  fn() {
    const params = 1.2;
    const schema: Schema = {
      type: "integer",
    };
    const targetObject = validateObject(params, schema);
    assertEquals(
      targetObject,
      { message: "1.2 type is not integer", error: true },
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - SINGLE - FALSE - NOT STRING",
  fn() {
    const params = 0;
    const schema: Schema = {
      type: "string",
    };
    const targetObject = validateObject(params, schema);
    assertEquals(
      targetObject,
      { message: "0 type is not string.", error: true },
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - SINGLE - FALSE - NOT BOOELAN",
  fn() {
    const params = 0;
    const schema: Schema = {
      type: "boolean",
    };
    const targetObject = validateObject(params, schema);
    assertEquals(
      targetObject,
      { message: "0 type is not boolean.", error: true },
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - ARRAY",
  fn() {
    const params = ["oke", true, true];
    const schema: Schema = {
      type: "array",
      items: [{ type: "string" }, { type: "boolean" }, { type: "boolean" }],
    };
    const targetObject = validateObject(params, schema);
    assertEquals(targetObject, params);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - ARRAY - FALSE",
  fn() {
    const params = ["oke", true, 2];
    const schema: Schema = {
      type: "array",
      items: [{ type: "string" }, { type: "boolean" }, { type: "boolean" }],
    };
    const targetObject = validateObject(params, schema);
    assertEquals(targetObject, { message: "2 is not boolean", error: true });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - ARRAY - MISSING ITEMS",
  fn() {
    const params = ["oke", true, 2];
    const schema: Schema = {
      type: "array",
    };
    const targetObject = validateObject(params, schema);
    assertEquals(
      targetObject,
      { message: "array items property is missing.", error: true },
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - ARRAY - EMPTY",
  fn() {
    const payload = {
      name: "eko",
      address: { city: "surabaya", street: "darmo", number: 5 },
      numOfHouse: 1,
      child: [],
    };
    const targetObject = validateObject(payload, schema);
    assertEquals(targetObject, { message: "array items empty", error: true });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - OBJECT",
  fn() {
    const payload = {
      name: "eko",
      address: { city: "surabaya", street: "darmo", number: 5 },
      numOfHouse: 1,
      child: ["toni", "budi"],
    };
    const targetObject = validateObject(payload, schema);
    assertEquals(targetObject, payload);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - OBJECT - REQUIRED",
  fn() {
    const payload = {
      address: { city: "surabaya", street: "darmo", number: 5 },
      numOfHouse: 1,
      child: ["toni", "budi"],
    };
    const targetObject = validateObject(payload, schema);
    assertEquals(targetObject, { message: "name is required", error: true });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - OBJECT - WRONG TYPE",
  fn() {
    const payload = {
      name: 1,
      address: { city: "surabaya", street: "darmo", number: 5 },
      numOfHouse: 1,
      child: ["toni", "budi"],
    };
    const targetObject = validateObject(payload, schema);
    assertEquals(targetObject, { message: "name is string", error: true });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - OBJECT - INTEGER",
  fn() {
    const payload = {
      name: "eko",
      address: { city: "surabaya", street: "darmo", number: 5 },
      numOfHouse: 1.2,
      child: ["toni", "budi"],
    };
    const targetObject = validateObject(payload, schema);
    assertEquals(
      targetObject,
      { message: "numOfHouse type is integer", error: true },
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
