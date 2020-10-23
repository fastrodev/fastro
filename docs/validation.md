# Data validation

- You can validate headers, payload, URL params, or URL query by add `validatationSchema` on handler options
- Set `params` to `true` if you want to validate `URL params` or `URL query`
- Payload, params, and query validation will be executed if you call `getPayload()`, `getParams()`, or `getQuery()`
- Headers validation will always executed if `headers` validation schema is set

    ```ts
    import type { HandlerOptions, Request, ValidationSchema } from "https://raw.fastro.dev/master/mod.ts";

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
        type: "array",
        items: [
          { type: "object", properties: { name: { type: "string" } } },
          { type: "object", properties: { address: { type: "string" } } },
        ],
      },
      params: {
        type: "array",
        items: [{ type: "string" }, { type: "string" }, { type: "string" }],
      },
    };

    export const options: HandlerOptions = {
      params: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      validationSchema,
    };

    export const handler = async (request: Request) => {
      const x = request.getQuery();
      const y = request.getParams();
      const z = await request.getPayload();
      const data = { x, y, z }
      request.send(data);
    };
    ```


## What's next:
- [Publishing and Deployment](deployment.md)
- [Fastro API](api.md)