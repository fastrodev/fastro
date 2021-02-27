import { Request } from "../../mod.ts";
export const options = {
  methods: ["POST"],
};
export default async function (request: Request) {
  const payload = await request.getPayload();
  request.send(payload);
}
