import { Request } from "../../../mod.ts";
export const options = {
  params: true,
  methods: ["GET"],
};
export default function (request: Request) {
  const params = request.getParams();
  request.send(params);
}
