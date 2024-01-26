---
title: "Deno KV OAuth Implementation"
description: "Implementing a modular codebase for Deno KV OAuth in Fastro"
image: https://fastro.dev/static/image.png
author: Yanu Widodo
date: 11/15/2023
---

A modular codebase is important because it makes code easier to understand,
maintain, and test. It also makes it easier to reuse code in other projects.

We will create the implementation of Deno KV OAuth in Fastro.

# Create Client ID and Client Secret

In this step, we will create Github Client ID and Client Secret.

- Navigate to
  [GitHub Developer Settings: OAuth Apps](https://github.com/settings/developers#oauth-apps)
  and login to your Github account.
- Click the 'New Oauth App' button and fill in all the required fields.
- Save the client id and client secret
- We will use it as ENV:
  `GITHUB_CLIENT_ID=xxx GITHUB_CLIENT_SECRET=yyy deno task start`

# Create OAauth Config

In this step, we will create `oauthConfig` with custom `redirectUri` and
`scope`.

```tsx
import { createGitHubOAuthConfig } from "https://deno.land/x/deno_kv_oauth@v0.10.0/mod.ts";

const redirectUri = Deno.env.get("REDIRECT_URI") ??
  : "http://localhost:8000/callback";

const oauthConfig = createGitHubOAuthConfig(
  { redirectUri, scope: ["user"] },
);
```

# Create index handler

In this step, we will create an index handler. This is the interface for the
user to sign in and sign out.

```tsx
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
            <a href="https://github.com/fastrodev/fastro/blob/preact/modules/auth.tsx">
              Source code
            </a>
          </p>
        </div>
      </body>
    </html>
  );

  return ctx.render(jsx);
}
```

# Create signin, signout, and callback handler

In this step, we will create handlers for sign-in, sign-out, and callbacks,
which are imported from the `deno_kv_oauth` module.

```tsx
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
```

# Group all paths and handlers into a single module

You can define custom paths and call each handler within a module in the
following manner:

```tsx
export const authModule = (f: Fastro) => {
  return f.get("/auth", indexHandler)
    .get("/signin", signinHandler)
    .get("/callback", callbackHandler)
    .get("/signout", signoutHandler);
};
```

# Call the module

```ts
import fastro from "$fastro/mod.ts";
import { authModule } from "$fastro/modules/auth.tsx";

const f = new fastro();
f.group(authModule);

await f.serve();
```

Setup your `deno.json`:

```json
{
  "tasks": {
    "start": "deno run -A --unstable examples/auth.tsx"
  }
}
```

# Run the app

And let's run the app with clientID and secret in the above step:

```bash
GITHUB_CLIENT_ID=xxx GITHUB_CLIENT_SECRET=xxx deno task start
```

You can view the complete source code and demo of this module on this page:
[https://fastro.deno.dev/auth](https://fastro.deno.dev/auth)
