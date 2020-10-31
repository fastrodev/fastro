import { v4 } from "../deps.ts";

const uuid = v4.generate();
const regid = `${uuid}`;

export function config(email: string) {
  const yaml = `email: ${email}
regid: ${regid}
`;
  return yaml;
}
