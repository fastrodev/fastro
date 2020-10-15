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
  name: "VALIDATION - SCHEMA",
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
  name: "VALIDATION - REQUIRED",
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
  name: "VALIDATION - TYPE",
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
  name: "VALIDATION - EMPTY ARRAY",
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
  name: "VALIDATION - INTEGER",
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
