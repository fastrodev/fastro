import type { Request } from "../../mod.ts";
export const options = {
  methods: ["POST"],
};
export default async (request: Request) => {
  const payload = await request.getPayload();
  request.send(payload);
};
