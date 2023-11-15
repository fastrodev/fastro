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

const redirectUri = Deno.env.get("REDIRECT_URI")
  ? "https://fastro.dev/callback"
  : "http://localhost:8000/callback";

const oauthConfig = createGitHubOAuthConfig(
  { redirectUri },
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
        <a href="/signin">Sign in</a>
      </p>
      <p>
        <a href="/signout">Sign out</a>
      </p>
      <p>
        <a href="https://github.com/fastrodev/fastro/modules/auth.tsx">
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

export const callbackHandler = async (req: Request) => {
  try {
    const { response } = await handleCallback(req, oauthConfig);
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
 * see the example: https://github.com/fastrodev/fastro/blob/main/examples/register.ts
 * @param f: Fastro
 * @returns Fastro
 */
export const authModule = (f: Fastro) => {
  return f.get("/auth", indexHandler)
    .get("/signin", signinHandler)
    .get("/callback", callbackHandler)
    .get("/signout", signoutHandler);
};
