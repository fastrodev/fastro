---
description: You can validate headers, payload, URL params, or URL query by add validatationSchema on handler options
---

# Data validation

- You can validate headers, payload, URL params, or URL query by add `validatationSchema` on handler options
- Set `params` to `true` if you want to validate URL params or URL query
- Headers validation will always executed if headers validation schema is set
- Another validation will be executed if you call `getPayload()`, `getParams()`, or `getQuery()`


```ts
import type { HandlerOptions, Request, ValidationSchema } from "https://deno.land/x/fastro@v0.30.43/mod.ts";

const validationSchema: ValidationSchema = {
  body: { type: "object", properties: { addres: { type: "string" } } },
  headers: {
    type: "object",
    properties: {
      token: { type: "string" },
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
```


## What's next:
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
