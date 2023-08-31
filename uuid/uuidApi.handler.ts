import { uuidService } from "./uuid.service.ts";

export function apiHandler(_req: Request) {
  return uuidService();
}
