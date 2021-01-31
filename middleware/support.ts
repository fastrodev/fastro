import type { Callback, Request } from "../mod.ts";
// You can add middleware options
// export const options = {
//   methods: ["GET", "POST"],
//   validationSchema: {
//     headers: {
//       type: "object",
//       properties: {
//         "token": { type: "string" },
//       },
//       required: ["token"],
//     },
//   },
// };
export default (request: Request, next: Callback) => {
  if (request.url === "/middleware") request.hello = "middleware";
  next();
};
