import { Request } from "../../../mod.ts";
export const options = {
  methods: ["GET"],
};
export default function (request: Request) {
  request.redirect("/hello");
}
