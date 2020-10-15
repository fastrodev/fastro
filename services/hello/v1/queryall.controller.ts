import type { Request } from "../../../mod.ts";
export const options = {
  params: true,
  methods: ["GET"],
};
export const handler = async (request: Request) => {
  const query = await request.getQuery();
  request.send(query);
};
