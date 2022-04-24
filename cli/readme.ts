import { VERSION } from "../server/version.ts"

function readme(version: string) {
  Deno.readTextFile("./cli/tmpl.md").then((txt) =>
    console.info(txt.replaceAll("{{version}}", version))
  )
}

readme(VERSION)
