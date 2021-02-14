import type { Request } from "../../../mod.ts";
export const options = {
  methods: ["GET"],
};
export default (request: Request) => {
  request.redirect("/hello");
};
