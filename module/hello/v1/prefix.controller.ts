import { Request } from "../../../mod.ts";
export const options = {
  prefix: "api",
};
export default function (request: Request) {
  request.send("prefix");
}
