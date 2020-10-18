import type { Request } from "../../mod.ts";
const validationSchema = {
  body: {
    type: "object",
    required: ["name", "age"],
    properties: {
      name: { type: "string" },
      age: { type: "number" },
    },
  },
};
export const options = {
  validationSchema,
};
export const handler = async (request: Request) => {
  const payload = await request.getPayload();
  request.send(payload);
};
