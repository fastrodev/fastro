function readme(version: string) {
  Deno.readTextFile("./cli/tmpl.txt").then((txt) =>
    console.info(txt.replaceAll("{{version}}", version))
  )
}

const decoder = new TextDecoder('utf-8')
const data = await Deno.readFile('./server/version.json')
const { version } = JSON.parse(decoder.decode(data))

readme(version)
