import type { Request } from "../../../mod.ts";
export const options = {
  params: true,
  methods: ["GET"],
};
export default (request: Request) => {
  const query = request.getQuery("name");
  request.send(query);
};
