import { getSessionId } from "@app/modules/auth/mod.tsx";
import { Context, HttpRequest } from "@app/mod.ts";
import { kv } from "@app/utils/db.ts";

export async function getSession(req: HttpRequest, _ctx: Context) {
  const sessionId = await getSessionId(req);
  if (!sessionId) return undefined;
  // deno-lint-ignore no-explicit-any
  const r = (await kv.get(["session", sessionId])).value as any;
  // console.log("r", {
  //   sessionId,
  //   login: r.login,
  // });
  if (!r) return;
  const avatar_url = r.avatar_url;
  const html_url = r.html_url;
  const isLogin = true;
  const username = r.login;
  return { isLogin, avatar_url, html_url, username };
}
