import type { Request } from "../../../mod.ts";
export const options = {
  params: true,
  methods: ["GET"],
};
export default (request: Request) => {
  const params = request.getParams();
  request.send(params);
};
