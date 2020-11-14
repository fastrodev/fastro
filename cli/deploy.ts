import { Args } from "../core/types.ts";

function deployHelp() {
  const message = `USAGE
  fastro deploy [OPTIONS]

OPTIONS
  --name      Application name

EXAMPLE
  fastro deploy --name hello 
`;
  console.log(message);
}

async function getProjectId() {
  try {
    const p = Deno.run({
      cmd: ["gcloud", "config", "list", "--format", "value(core.project)"],
      stdout: "piped",
      stderr: "piped",
    });

    const { code } = await p.status();
    let str;
    if (code === 0) {
      const rawOutput = await p.output();
      str = new TextDecoder().decode(rawOutput);
    } else {
      const rawError = await p.stderrOutput();
      str = new TextDecoder().decode(rawError);
    }
    str = str.trim();
    return str;
  } catch (error) {
    console.error(
      "Gcloud not found. Go to https://fastro.dev/docs/deployment.html for installation.",
    );
  }
}

async function cloudRunDeployHandler(projectId: string, appName: string) {
  const image = `gcr.io/${projectId}/${appName}`;
  const p = Deno.run({
    cmd: [
      "gcloud",
      "run",
      "deploy",
      appName,
      "--image",
      image,
      "--platform",
      "managed",
      "--allow-unauthenticated",
      "--region",
      "us-central1",
    ],
  });

  const { code } = await p.status();
  if (code === 0) console.log({ message: "Deploy finish" });
  else console.error({ message: "Deploy error" });
}

async function buildHandler(projectId: string, appName: string) {
  const tag = `gcr.io/${projectId}/${appName}`;
  const p = Deno.run({
    cmd: ["gcloud", "builds", "submit", "--tag", tag],
  });

  const { code } = await p.status();
  if (code === 0) console.log({ message: "Build Finish" });
  else console.error({ message: "Build error" });
}

export async function handleDeploy(args: Args) {
  if (args.help) return deployHelp();
  const projectId = await getProjectId();
  if (projectId) {
    const appName = args.name ? args.name : "webapp";
    await buildHandler(projectId, appName);
    await cloudRunDeployHandler(projectId, appName);
  }
}
