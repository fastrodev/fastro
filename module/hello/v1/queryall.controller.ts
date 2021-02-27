import { Request } from "../../../mod.ts";
export const options = {
  params: true,
  methods: ["GET"],
};
export default function (request: Request) {
  const query = request.getQuery();
  request.send(query);
}
