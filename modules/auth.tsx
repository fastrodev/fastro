import { Fastro } from "$fastro/mod.ts";

import {
  createGitHubOAuthConfig,
  getSessionId,
  handleCallback,
  signIn,
  signOut,
} from "https://deno.land/x/deno_kv_oauth@v0.10.0/mod.ts";

import { Status } from "$fastro/http/deps.ts";
import { Context, HttpRequest } from "$fastro/mod.ts";

const redirectUri = Deno.env.get("REDIRECT_URI") ??
  "http://localhost:8000/callback";

const oauthConfig = createGitHubOAuthConfig(
  { redirectUri, scope: ["user"] },
);

export async function indexHandler(req: HttpRequest, ctx: Context) {
  const sessionId = await getSessionId(req);
  const hasSessionIdCookie = sessionId !== undefined;

  const jsx = (
    <>
      <p>Authorization endpoint URI: {oauthConfig.authorizationEndpointUri}</p>
      <p>Token URI: {oauthConfig.tokenUri}</p>
      <p>Scope: {oauthConfig.defaults?.scope}</p>
      <p>Signed in: {JSON.stringify(hasSessionIdCookie)}</p>
      <p>
        {hasSessionIdCookie
          ? <a href="/signout">Sign out</a>
          : <a href="/signin">Sign in</a>}
      </p>

      <p>
        <a href="https://github.com/fastrodev/fastro/blob/main/modules/auth.tsx">
          Source code
        </a>
      </p>
    </>
  );

  return ctx.send(jsx, 200);
}

export const signinHandler = async (req: Request) => {
  return await signIn(req, oauthConfig);
};

async function getUser(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

export const callbackHandler = async (req: HttpRequest) => {
  try {
    const { response, sessionId, tokens } = await handleCallback(
      req,
      oauthConfig,
    );
    const user = await getUser(tokens.accessToken);
    const kv = req.record["kv"] as Deno.Kv;
    kv.set([sessionId], user, { expireIn: 5 * 60 * 1000 });
    return response;
  } catch {
    return new Response(null, { status: Status.InternalServerError });
  }
};

export const signoutHandler = async (req: Request) => {
  return await signOut(req);
};

/**
 * To use this module,
 * see the example: https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts
 * @param f: Fastro
 * @returns Fastro
 */
export const authModule = (f: Fastro) => {
  return f.get("/auth", indexHandler)
    .get("/signin", signinHandler)
    .get("/callback", callbackHandler)
    .get("/signout", signoutHandler);
};
