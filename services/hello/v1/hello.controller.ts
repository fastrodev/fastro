import type { Request } from "../../../mod.ts";
export const options = {
  methods: ["GET"],
};
export const handler = (request: Request) => {
  request.send("hello v1");
};
