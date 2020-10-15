import type { Request } from "../../../mod.ts";
export const options = {
  params: true,
  methods: ["GET"],
};
export const handler = (request: Request) => {
  const params = request.getParams();
  request.send(params);
};
