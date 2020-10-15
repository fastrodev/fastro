import type { HandlerOptions, Request, ValidationSchema } from "../mod.ts";

const validationSchema: ValidationSchema = {
  body: { type: "object", properties: { addres: { type: "string" } } },
  headers: {
    type: "object",
    properties: {
      "x-foo": { type: "string" },
    },
    required: ["x-foo"],
  },
  querystring: {
    type: "object",
    properties: {
      name: { type: "string" },
    },
  },
  params: {
    type: "object",
    properties: {
      street: { type: "string" },
    },
  },
};

export const options: HandlerOptions = {
  params: true,
  prefix: "api",
  methods: ["GET", "POST", "PUT", "DELETE"],
  validationSchema,
};

export const handler = (request: Request) => {
  request.send("setup complete");
};
