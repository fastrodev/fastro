import {
  createGitHubOAuthConfig,
  getSessionId,
  handleCallback,
  signIn,
  signOut,
} from "https://deno.land/x/deno_kv_oauth@v0.10.0/mod.ts";
import { Context, Fastro, HttpRequest } from "../../http/server/types.ts";
import { STATUS_CODE } from "../../http/server/deps.ts";

const redirectUri = Deno.env.get("REDIRECT_URI") ??
  "http://localhost:8000/callback";

const oauthConfig = createGitHubOAuthConfig(
  { redirectUri, scope: ["user"] },
);

export async function indexHandler(req: HttpRequest, ctx: Context) {
  const sessionId = await getSessionId(req);
  const hasSessionIdCookie = sessionId !== undefined;

  const jsx = (
    <html>
      <head>
        <title>Deno Kv OAuth Demo</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
      </head>
      <body>
        <div>
          <p>
            Authorization endpoint URI: {oauthConfig.authorizationEndpointUri}
          </p>
          <p>Token URI: {oauthConfig.tokenUri}</p>
          <p>Scope: {oauthConfig.defaults?.scope}</p>
          <p>Signed in: {JSON.stringify(hasSessionIdCookie)}</p>
          <p>
            {hasSessionIdCookie
              ? <a href="/signout">Sign out</a>
              : <a href="/signin">Sign in</a>}
          </p>

          <p>
            <a href="https://github.com/fastrodev/fastro/blob/main/modules/auth/auth.mod.tsx">
              Source code
            </a>
          </p>
        </div>
      </body>
    </html>
  );

  return ctx.render(jsx);
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
    kv.set([sessionId], user, { expireIn: 60 * 60 * 1000 });
    return response;
  } catch {
    return new Response(null, { status: STATUS_CODE.InternalServerError });
  }
};

export const signoutHandler = async (req: HttpRequest) => {
  const kv = req.record["kv"] as Deno.Kv;
  await kv.delete([req.sessionId]);
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
