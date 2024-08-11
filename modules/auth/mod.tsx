import { Context, Fastro, HttpRequest } from "@app/http/server/types.ts";
import { STATUS_CODE } from "@app/http/server/deps.ts";
import { kv } from "@app/utils/db.ts";
import {
  createGitHubOAuthConfig,
  createHelpers,
} from "jsr:@deno/kv-oauth@0.11.0";

const redirectUri = Deno.env.get("REDIRECT_URI") ??
  "http://localhost:8000/callback";

const GITHUB_CLIENT_ID = Deno.env.get("GITHUB_CLIENT_ID");
const GITHUB_CLIENT_SECRET = Deno.env.get("GITHUB_CLIENT_SECRET");

if (!GITHUB_CLIENT_ID) {
  throw new Error("GITHUB_CLIENT_ID environment variable must be set");
}

if (!GITHUB_CLIENT_SECRET) {
  throw new Error("GITHUB_CLIENT_SECRET environment variable must be set");
}

const oauthConfig = createGitHubOAuthConfig(
  { redirectUri, scope: ["user"] },
);
const {
  signIn,
  handleCallback,
  getSessionId,
  signOut,
} = createHelpers(oauthConfig);

export { getSessionId, handleCallback, signIn, signOut };

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
            <a href="https://github.com/fastrodev/fastro/blob/main/modules/auth/mod.tsx">
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
  return await signIn(req);
};

async function getUser(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  const data = await response.json();
  kv.set([data.id], data);
  return data;
}

export const callbackHandler = async (req: HttpRequest) => {
  try {
    const { response, sessionId, tokens } = await handleCallback(
      req,
    );
    const user = await getUser(tokens.accessToken);
    kv.set([sessionId], user, { expireIn: 60 * 60 * 1000 });
    return response;
  } catch {
    return new Response(null, { status: STATUS_CODE.InternalServerError });
  }
};

export const signoutHandler = async (req: HttpRequest) => {
  const sessionId = await getSessionId(req);
  if (!sessionId) throw new Error("session ID is undefined");
  await kv.delete([sessionId]);
  return await signOut(req);
};

/**
 * To use this module,
 * see the example: https://github.com/fastrodev/fastro/blob/main/examples/oauth.ts
 * @param f: Fastro
 * @returns Fastro
 */
export default function authModule(f: Fastro) {
  return f.get("/auth", indexHandler)
    .get("/signin", signinHandler)
    .get("/callback", callbackHandler)
    .get("/signout", signoutHandler);
}
