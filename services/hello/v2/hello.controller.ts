import type { Request } from "../../../mod.ts";
export const options = {
  methods: ["GET", "POST", "PUT", "DELETE"],
};
export default (request: Request) => {
  request.send("hello v2");
};
