export const middleware = `import  { Callback, Request } from "../deps.ts";
export const options = {
  methods: ["GET", "POST"],
};
export default function(request: Request, next: Callback) {
  request.hello = "with middleware";
  next();
};
`;
