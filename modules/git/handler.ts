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
  const statusResult = await runGit(["status", "--porcelain", "--branch"]);
  const logResult = await runGit([
    "log",
    "--oneline",
    "-5",
    "--",
    "posts/",
    "public/img/",
  ]);

  const branch = branchResult.output.trim();
  // Preserve leading spaces in porcelain lines so index/worktree columns remain
  const rawLines = statusResult.output.split("\n").filter((l) => l !== "");

  // Parse ahead count from branch header, e.g. "## main...origin/main [ahead 2]"
  let ahead = 0;
  if (rawLines.length > 0 && rawLines[0].startsWith("##")) {
    const m = rawLines[0].match(/ahead\s+(\d+)/);
    if (m) ahead = parseInt(m[1], 10);
  }

  // Count untracked (??), staged (X), and deleted/modified but not staged ( Y)
  const untrackedFiles: string[] = [];
  const stagedFiles: string[] = [];
  const deletedFiles: string[] = [];
  const log = logResult.output.split("\n").filter((l) => l !== "");

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (line.startsWith("##")) continue;

    const pathPart = line.slice(3);
    const path = pathPart.includes(" -> ")
      ? pathPart.split(" -> ")[1]
      : pathPart;

    if (!path.startsWith("posts/") && !path.startsWith("public/img/")) continue;

    const idx = line[0];
    const work = line[1];

    // Untracked
    if (idx === "?" && work === "?") {
      untrackedFiles.push(path);
      continue;
    }

    // Staged
    if (idx !== " " && idx !== "?") {
      stagedFiles.push(path);
    }

    // Worktree changes (Deleted or Modified but not staged)
    if (work === "D") {
      deletedFiles.push(path);
    }
  }

  return Response.json({
    branch,
    counts: {
      untracked: untrackedFiles.length,
      staged: stagedFiles.length,
      deleted: deletedFiles.length,
      ahead,
    },
    files: {
      untracked: untrackedFiles,
      staged: stagedFiles,
      deleted: deletedFiles,
    },
    log,
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
  // Only add files under posts/ and public/img/ to avoid affecting other folders
  await runGit(["add", "posts/", "public/img/"]);
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

export const gitAddHandler: Handler = async (_req, ctx) => {
  const user = await checkAuth(ctx.cookies?.token as string);
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Add all files under posts/ and public/img/
  const res = await runGit(["add", "posts/", "public/img/"]);
  return Response.json({ output: res.output || res.error, code: res.code });
};

export const gitCommitHandler: Handler = async (req, ctx) => {
  const user = await checkAuth(ctx.cookies?.token as string);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const message = body.message || `commit from dashboard by ${user}`;

  const res = await runGit(["commit", "-m", message]);
  return Response.json({ output: res.output || res.error, code: res.code });
};

export const gitPushHandler: Handler = async (_req, ctx) => {
  const user = await checkAuth(ctx.cookies?.token as string);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const branchResult = await runGit(["branch", "--show-current"]);
  const branch = branchResult.output.trim();
  const res = await runGit(["push", "origin", branch]);
  return Response.json({ output: res.output || res.error, code: res.code });
};

export const gitUnstageHandler: Handler = async (_req, ctx) => {
  const user = await checkAuth(ctx.cookies?.token as string);
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Unstage files under posts/ and public/img/ only
  // Use git reset HEAD <paths> to unstage
  const res = await runGit(["reset", "HEAD", "--", "posts/", "public/img/"]);
  return Response.json({ output: res.output || res.error, code: res.code });
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

export const gitLogHandler: Handler = async (_req, ctx) => {
  const user = await checkAuth(ctx.cookies?.token as string);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const url = new URL(_req.url);
  const limit = url.searchParams.get("limit") || "10";
  const logResult = await runGit([
    "log",
    "--oneline",
    `-${limit}`,
    "--",
    "posts/",
    "public/img/",
  ]);
  const log = logResult.output.split("\n").filter((l) => l !== "");
  return Response.json({ log });
};
