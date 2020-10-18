import type { HandlerOptions, Request, ValidationSchema } from "../mod.ts";
const validationSchema: ValidationSchema = {
  body: { type: "object", properties: { addres: { type: "string" } } },
  headers: {
    type: "object",
    properties: {
      "token": { type: "string" },
    },
    required: ["token"],
  },
  querystring: {
    type: "object",
    properties: {
      name: { type: "string" },
      address: { type: "string" },
    },
    required: ["name"],
  },
  params: {
    type: "array",
    items: [{ type: "string" }, { type: "string" }, { type: "string" }],
  },
};
export const options: HandlerOptions = {
  params: true,
  prefix: "api",
  methods: ["GET", "POST", "PUT", "DELETE"],
  validationSchema,
};

export const handler = async (request: Request) => {
  const x = request.getQuery();
  const y = request.getParams();
  const z = await request.getPayload();
  const data = { x, y, z };
  request.send(data);
};
