import { Handler } from "../../core/types.ts";
import { verifyToken } from "../../middlewares/jwt/mod.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "fastro-secret";

async function checkAuth(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const payload = await verifyToken<{ user: string }>(token, JWT_SECRET);
    return payload ? payload.user : null;
  } catch {
    return null;
  }
}

async function runGit(args: string[]) {
  const command = new Deno.Command("git", {
    args,
    stdout: "piped",
    stderr: "piped",
  });
  const { code, stdout, stderr } = await command.output();
  const output = new TextDecoder().decode(stdout);
  const error = new TextDecoder().decode(stderr);
  return { code, output, error };
}

export const gitStatusHandler: Handler = async (_req, ctx) => {
  const user = await checkAuth(ctx.cookies?.token as string);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const branchResult = await runGit(["branch", "--show-current"]);
  const statusResult = await runGit(["status", "--short"]);

  return Response.json({
    branch: branchResult.output.trim(),
    status: statusResult.output.trim(),
  });
};

export const gitBranchesHandler: Handler = async (_req, ctx) => {
  const user = await checkAuth(ctx.cookies?.token as string);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { output } = await runGit(["branch", "--format=%(refname:short)"]);
  const branches = output.split("\n")
    .map((b) => b.trim())
    .filter((b) => b !== "");

  return Response.json({ branches });
};

export const gitSyncHandler: Handler = async (req, ctx) => {
  const user = await checkAuth(ctx.cookies?.token as string);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const message = body.message || `sync from dashboard by ${user}`;

  await runGit(["add", "."]);
  const commitResult = await runGit(["commit", "-m", message]);

  const branchResult = await runGit(["branch", "--show-current"]);
  const branch = branchResult.output.trim();

  const pushResult = await runGit(["push", "origin", branch]);

  return Response.json({
    commit: commitResult.output || commitResult.error,
    push: pushResult.output || pushResult.error,
    code: pushResult.code,
  });
};

export const gitCheckoutHandler: Handler = async (req, ctx) => {
  const user = await checkAuth(ctx.cookies?.token as string);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const branch = body.branch;
  if (!branch) return new Response("Branch required", { status: 400 });

  const result = await runGit(["checkout", branch]);

  return Response.json({
    output: result.output || result.error,
    code: result.code,
  });
};
