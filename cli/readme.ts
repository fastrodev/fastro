import { VERSION } from "../server/version.ts"

function readme(version: string) {
  Deno.readTextFile("./cli/tmpl.txt").then((txt) =>
    console.info(txt.replaceAll("{{version}}", version))
  )
}

readme(VERSION)
