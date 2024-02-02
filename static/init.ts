async function clone(name?: string) {
  try {
    const folder = name ?? "project";
    const args = ["clone", "https://github.com/fastrodev/template.git", folder];
    const command = new Deno.Command("git", { args });
    const remove = new Deno.Command("git", {
      args: ["remote", "rm", "origin"],
    });
    const { stderr } = await command.output();
    await remove.output();
    const err = new TextDecoder().decode(stderr);
    console.log(err);
    console.log(`%cEnter:`, "color:blue");
    console.log(`cd ${folder}`);
    console.log(`deno task start`);
  } catch (error) {
    console.error(error);
  }
}

export default async function (name?: string) {
  await clone(name);
}
