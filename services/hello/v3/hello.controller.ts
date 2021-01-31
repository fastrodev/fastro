import type { Request } from "../../../mod.ts";
export const options = {
  methods: ["GET"],
};
export default (request: Request) => {
  request.view("hello.template.html", { title: "Hello", name: "World" });
};
