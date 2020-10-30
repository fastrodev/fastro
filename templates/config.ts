import { v4 } from "../deps.ts";

const uuid = v4.generate();
const appid = `${uuid}`;

export function config(email: string) {
  const yaml = `email: ${email}
appid: ${appid}
`;
  return yaml;
}
