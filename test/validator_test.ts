// Copyright 2021 the Fastro author. All rights reserved. MIT license.

import { assertEquals, assertThrows } from "../deps.ts";
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
  name: "VALIDATION - FAIL - EMPTY PROPERTIES FOR OBJECT TYPE",
  fn() {
    const params = 1.2;
    const schema: Schema = {
      type: "object",
    };
    assertThrows(
      () => validateObject(params, schema),
      Error,
      "schema property is missing",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - SINGLE - FAIL - INTEGER",
  fn() {
    const params = 1.2;
    const schema: Schema = {
      type: "integer",
    };
    assertThrows(
      () => validateObject(params, schema),
      Error,
      "1.2 type is not integer",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - SINGLE - FAIL - NOT STRING",
  fn() {
    const params = 0;
    const schema: Schema = {
      type: "string",
    };
    assertThrows(
      () => validateObject(params, schema),
      Error,
      "0 type is not string",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - SINGLE - FAIL - NOT BOOELAN",
  fn() {
    const params = 0;
    const schema: Schema = {
      type: "boolean",
    };
    assertThrows(
      () => validateObject(params, schema),
      Error,
      "0 type is not boolean",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - ARRAY - SUCCESS",
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
  name: "VALIDATION - ARRAY - FAIL",
  fn() {
    const params = ["oke", true, 2];
    const schema: Schema = {
      type: "array",
      items: [{ type: "string" }, { type: "boolean" }, { type: "boolean" }],
    };
    assertThrows(
      () => validateObject(params, schema),
      Error,
      "2 type is not boolean",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - ARRAY - FAIL - MISSING ITEMS",
  fn() {
    const params = ["oke", true, 2];
    const schema: Schema = {
      type: "array",
    };
    assertThrows(
      () => validateObject(params, schema),
      Error,
      "array items property is missing",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - ARRAY - FAIL - EMPTY",
  fn() {
    const payload = {
      name: "eko",
      address: { city: "surabaya", street: "darmo", number: 5 },
      numOfHouse: 1,
      child: [],
    };
    assertThrows(
      () => validateObject(payload, schema),
      Error,
      "array items empty",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - ARRAY - SUCCESS - TYPE OF OBJECT",
  fn() {
    const params = [{ name: "agus" }, { address: "tulungagung" }];
    const schema: Schema = {
      type: "array",
      items: [
        { type: "object", properties: { name: { type: "string" } } },
        { type: "object", properties: { address: { type: "string" } } },
      ],
    };
    const targetObject = validateObject(params, schema);
    assertEquals(targetObject, params);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - ARRAY - TYPE OF OBJECT - WRONG",
  fn() {
    const params = [{ name: 1 }, { address: "tulungagung" }];
    const schema: Schema = {
      type: "array",
      items: [
        { type: "object", properties: { name: { type: "string" } } },
        { type: "object", properties: { address: { type: "string" } } },
      ],
    };
    assertThrows(
      () => validateObject(params, schema),
      Error,
      "name is string",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - OBJECT - SUCCESS",
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
  name: "VALIDATION - OBJECT - FAIL",
  fn() {
    const payload = {
      name: "eko",
      address: { city: "surabaya", street: 4, number: 5 },
      numOfHouse: 5,
      child: ["toni", "budi"],
    };
    assertThrows(
      () => validateObject(payload, schema),
      Error,
      "street is string",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - OBJECT - FAIL - REQUIRED",
  fn() {
    const payload = {
      address: { city: "surabaya", street: "darmo", number: 5 },
      numOfHouse: 1,
      child: ["toni", "budi"],
    };

    assertThrows(
      () => validateObject(payload, schema),
      Error,
      "name is required",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - OBJECT - FAIL - WRONG TYPE",
  fn() {
    const payload = {
      name: 1,
      address: { city: "surabaya", street: "darmo", number: 5 },
      numOfHouse: 1,
      child: ["toni", "budi"],
    };
    assertThrows(
      () => validateObject(payload, schema),
      Error,
      "name is string",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "VALIDATION - OBJECT - FAIL - INTEGER",
  fn() {
    const payload = {
      name: "eko",
      address: { city: "surabaya", street: "darmo", number: 5 },
      numOfHouse: 1.2,
      child: ["toni", "budi"],
    };
    assertThrows(
      () => validateObject(payload, schema),
      Error,
      "numOfHouse type is integer",
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
