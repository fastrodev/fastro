const version = "v0.75.3";
export { version };

const init = async (name?: string, ver?: string) => {
  try {
    const projectName = name ?? "my-project";
    const v = ver ?? version;
    // vscode
    await Deno.mkdir(".vscode");
    await Deno.writeTextFile(
      ".vscode/settings.json",
      `{
  "deno.enable": true,
  "deno.lint": true,
  "deno.unstable": true,
  "deno.codeLens.test": true,
  "editor.defaultFormatter": "denoland.vscode-deno",
  "[typescript]": {
    "editor.defaultFormatter": "denoland.vscode-deno",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "denoland.vscode-deno",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  },
  "[yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "vscode.html-language-features"
  }
}`,
    );
    // main entry point
    await Deno.writeTextFile(
      "main.ts",
      `import fastro, {
  Context,
  HttpRequest,
} from "https://deno.land/x/fastro@${v}/mod.ts";
import app from "./pages/app.tsx";

const f = new fastro();

f.get("/api", () => Response.json({ msg: "hello" }));
f.static("/static", { folder: "static", maxAge: 90 });
f.page(
  "/",
  app,
  (_req: HttpRequest, ctx: Context) => {
    const options = {
      status: 200,
      props: { data: "Guest" },
      html: { head: { title: "React Component" } },
    };
    return ctx.render(options);
  },
);

await f.serve();
      
  `,
    );
    // github action
    await Deno.mkdir(".github/workflows", { recursive: true });
    await Deno.writeTextFile(
      ".github/workflows/build.yml",
      `name: build
  on:
    push:
        branches:
        - main
  jobs:
    build:
      runs-on: ubuntu-latest
  
      permissions:
        id-token: write
        contents: write
        packages: write
  
      steps:
        - name: Clone repository
          uses: actions/checkout@v3
  
        - uses: denoland/setup-deno@v1
          with:
            deno-version: vx.x.x

        - name: Run hydrate
          run: deno task hydrate
  
        - name: Deploy to Deno Deploy
          uses: denoland/deployctl@v1
          with:
            project: ${projectName}
            entrypoint: main.ts    
`,
    );
    // deno.json
    await Deno.writeTextFile(
      "deno.json",
      `{
  "lock": false,
  "imports": {
    "react/": "https://esm.sh/react@18.2.0/"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "lib": [
      "dom",
      "dom.iterable",
      "dom.asynciterable",
      "deno.ns",
      "deno.unstable"
    ]
  },
  "tasks": {
    "start": "deno run -A -r --watch main.ts --development",
    "hydrate": "deno run -A main.ts --hydrate"
  }
}`,
    );
    // readme.md
    await Deno.writeTextFile(
      "readme.md",
      `# Readme

How to start development:
\`\`\`
deno task start
\`\`\`
It will reload your browser automatically if changes occur.

`,
    );
    // page
    await Deno.mkdir("pages");
    await Deno.writeTextFile(
      "pages/app.tsx",
      `// uncomment this line if you want to deploy to production (deno deploy)
// import React, { useState } from "https://esm.sh/react@18.2.0"
import React, { useState } from "https://esm.sh/react@18.2.0?dev";

export default function App(props: { data: string }) {
  return (
    <>
      <h1>Hello {props.data}</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}

`,
    );

    // gitignore
    await Deno.writeTextFile(
      ".gitignore",
      `hydrate`,
    );
  } catch (error) {
    throw error;
  }
};
export default init;
