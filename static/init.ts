const init = async (name?: string) => {
  try {
    const projectName = name ?? "my-project";
    // vscode
    await Deno.mkdir(".vscode");
    await Deno.writeTextFile(
      ".vscode/settings.json",
      `{
  "deno.enable": true,
  "deno.lint": true,
  "deno.codeLens.test": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "denoland.vscode-deno",
  "[typescriptreact]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[typescript]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[javascript]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[css]": {
    "editor.defaultFormatter": "vscode.css-language-features"
  }
}`,
    );
    // main entry point
    await Deno.writeTextFile(
      "main.ts",
      `import { Server } from "$app/deps.ts";
import { pageModule } from "$app/pages/mod.ts";
import { uuidModule } from "$app/uuid/mod.ts";

// initiate the application
const s = new Server();

// setup static folder with maxAge 90
s.static("/static", { folder: "static", maxAge: 90 });

// setup API for UUID Module
await s.register(uuidModule);

// setup page module
await s.register(pageModule);

// serves HTTP requests
await s.serve();

`,
    );

    // deps
    await Deno.writeTextFile(
      "deps.ts",
      `import Server from "https://raw.githubusercontent.com/fastrodev/fastro/main/mod.ts";
export * from "https://raw.githubusercontent.com/fastrodev/fastro/main/mod.ts";
export { Server };
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
  "importMap": "./import_map.json",
  "lock": false,
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
    "start": "ENV=DEVELOPMENT deno run -A --watch main.ts",
    "hydrate": "deno run -A -r main.ts --hydrate"
  }
}`,
    );

    // deno.json
    await Deno.writeTextFile(
      "import_map.json",
      `{
  "imports": {
    "$app/": "./",
    "react": "https://esm.sh/v133/react@18.2.0?dev",
    "react/": "https://esm.sh/v133/react@18.2.0/",
    "react-dom": "https://esm.sh/v133/react-dom@18.2.0?dev",
    "react-dom/": "https://esm.sh/v133/react-dom@18.2.0/"
  }
}`,
    );

    // deno.json
    await Deno.writeTextFile(
      "import_map.prod.json",
      `{
  "imports": {
    "$app/": "./",
    "react": "https://esm.sh/v133/react@18.2.0",
    "react/": "https://esm.sh/v133/react@18.2.0/",
    "react-dom": "https://esm.sh/v133/react-dom@18.2.0",
    "react-dom/": "https://esm.sh/v133/react-dom@18.2.0/"
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

## Application structure

\`\`\`
.
├── .github
│   └── workflows
│       └── build.yml
├── .gitignore
├── .vscode
│   └── settings.json
├── deno.json
├── main.ts
├── pages
│   ├── app.tsx
│   ├── layout.tsx
│   └── mod.ts
├── readme.md
├── static
│   └── app.css
└── uuid
    └── mod.ts

6 directories, 11 files
\`\`\`

|File|Use for|
|--|--|
|\`main.ts\`| Deno cli entry point. This is the first script executed when you run \`deno task start\` |
|\`uuid/mod.tsx\`| UUID module function. This is the API for UUID feature. Create a new folder and a module function file if you want to add a new feature |
|\`pages/mod.tsx\`| Page module function. This is the module for all SSR pages |
|\`pages/app.tsx\`| Application page. This is the initial react SSR for your app |
|\`pages/layout.ts\`| App layout. Defines initial data, meta, css, class, and script|
|\`app.css\`| CSS file. Describes how HTML elements should be displayed. See: [CSS tutorial](https://www.w3schools.com/css/)|
|\`deno.json\`| App configuration. See: [deno config](https://deno.land/manual/getting_started/configuration_file) |
|\`settings.json\`| User and Workspace Settings for VSCode. See: [vs-code settings](https://code.visualstudio.com/docs/getstarted/settings)|
|\`build.yml\`| Automate, customize, and execute your software development workflows right in your repository. See [Github action](https://docs.github.com/en/actions) |
|\`.gitignore\`| Specifies intentionally untracked files that Git should ignore. See: [gitignore](https://git-scm.com/docs/gitignore) |
|\`readme.md\`| Step by step instructions |

`,
    );
    // page ssr
    await Deno.mkdir("pages");
    await Deno.writeTextFile(
      "pages/app.page.tsx",
      `import React, { useState } from "react";

export default function App(props: { data: string }) {
  const [data, setD] = useState({
    uuid: "e90d45df-4132-41ad-aec8-e0e19f7647a9",
  });

  const handleClick = async () => {
    const res = await fetch("/api");
    setD(await res.json());
  };

  return (
    <main className="d-flex flex-column justify-content-center align-items-center h-100">
      <h1>Hello {props.data}</h1>
      <p className="fw-light">
        Click the button below to get the new UUID from the server
      </p>
      <div className="d-flex p-2 bd-highlight">
        <button
          onClick={handleClick}
          className="me-1 p-3 btn btn-light fw-semibold bg-white align-middle"
        >
          GET
        </button>
        <div className="p-3 bg-black border border-light rounded fw-light align-middle">
          {data.uuid}
        </div>
      </div>
    </main>
  );
}

`,
    );
    // layout
    await Deno.writeTextFile(
      "pages/layout.tsx",
      `// deno-lint-ignore-file no-explicit-any
import { RenderOptions } from "$app/deps.ts";

export default function (
  props: { data: string; title: string; description: string },
): RenderOptions {
  return {
    props,
    cache: false,
    customRoot: (el: React.ReactNode) => {
      return (
        <div
          id="root"
          className="d-flex w-100 pt-3 ps-3 pe-3 mx-auto flex-column"
          style={{ maxWidth: "42em" }}
          data-color-mode="auto"
          data-light-theme="light"
          data-dark-theme="dark"
        >
          {el}
        </div>
      );
    },
    layout: (
      { children, data }: { children: React.ReactNode; data: any },
    ) => {
      return (
        <html className="h-100" lang="EN">
          <head>
            <title>{data.title}</title>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta
              name="description"
              content={data.description}
            />
            <link
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
              rel="stylesheet"
              integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
              crossOrigin="anonymous"
            />

            <link
              href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css"
              rel="stylesheet"
            />
          </head>
          <body className="d-flex h-100 text-bg-dark">
            {children}
            <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js" />
            <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js" />
          </body>
        </html>
      );
    },
  };
}
`,
    );
    // page mod
    await Deno.writeTextFile(
      "pages/mod.ts",
      `import { Context, Fastro, HttpRequest } from "$app/deps.ts";
import app from "$app/pages/app.page.tsx";
import layout from "$app/pages/layout.tsx";

export function pageModule(f: Fastro) {
  return f.page(
    "/",
    app,
    (_req: HttpRequest, ctx: Context) => {
      const options = layout({
        data: "World",
        title: "Hello World",
        description: "This is simple react component",
      });
      return ctx.render(options);
    },
  );
}

`,
    );

    // UUID
    await Deno.mkdir("uuid");
    await Deno.writeTextFile(
      "uuid/mod.ts",
      `import { Fastro } from "$app/deps.ts";

export function uuidModule(f: Fastro) {
  return f.get("/api", () => Response.json({ uuid: crypto.randomUUID() }));
}
      
`,
    );

    // gitignore
    await Deno.writeTextFile(
      ".gitignore",
      `.hydrate`,
    );

    // css
    await Deno.mkdir("static", { recursive: true });
    await Deno.writeTextFile(
      "static/app.css",
      `/*
* Globals
*/


/* Custom default button */
.btn-light,
.btn-light:hover,
.btn-light:focus {
  color: #333;
  text-shadow: none; /* Prevent inheritance from \`body\` */
}


/*
* Base structure
*/

body {
  text-shadow: 0 .05rem .1rem rgba(0, 0, 0, .5);
  box-shadow: inset 0 0 5rem rgba(0, 0, 0, .5);
}

.cover-container {
  max-width: 42em;
}


/*
* Header
*/

.nav-masthead .nav-link {
  color: rgba(255, 255, 255, .5);
  border-bottom: .25rem solid transparent;
}

.nav-masthead .nav-link:hover,
.nav-masthead .nav-link:focus {
  border-bottom-color: rgba(255, 255, 255, .25);
}

.nav-masthead .nav-link + .nav-link {
  margin-left: 1rem;
}

.nav-masthead .active {
  color: #fff;
  border-bottom-color: #fff;
}

.bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

@media (min-width: 768px) {
    .bd-placeholder-img-lg {
        font-size: 3.5rem;
    }
}

.b-example-divider {
    width: 100%;
    height: 3rem;
    background-color: rgba(0, 0, 0, .1);
    border: solid rgba(0, 0, 0, .15);
    border-width: 1px 0;
    box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
}

.b-example-vr {
    flex-shrink: 0;
    width: 1.5rem;
    height: 100vh;
}

.bi {
    vertical-align: -.125em;
    fill: currentColor;
}

.nav-scroller {
    position: relative;
    z-index: 2;
    height: 2.75rem;
    overflow-y: hidden;
}

.nav-scroller .nav {
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: 1rem;
    margin-top: -1px;
    overflow-x: auto;
    text-align: center;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
}

.btn-bd-primary {
    --bd-violet-bg: #712cf9;
    --bd-violet-rgb: 112.520718, 44.062154, 249.437846;

    --bs-btn-font-weight: 600;
    --bs-btn-color: var(--bs-white);
    --bs-btn-bg: var(--bd-violet-bg);
    --bs-btn-border-color: var(--bd-violet-bg);
    --bs-btn-hover-color: var(--bs-white);
    --bs-btn-hover-bg: #6528e0;
    --bs-btn-hover-border-color: #6528e0;
    --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
    --bs-btn-active-color: var(--bs-btn-hover-color);
    --bs-btn-active-bg: #5a23c8;
    --bs-btn-active-border-color: #5a23c8;
}

.bd-mode-toggle {
    z-index: 1500;
}

`,
    );

    console.log(
      `%cProject created!`,
      "color: blue",
    );
    console.log(
      `%cTo start the application, run:`,
      "color: white",
    );
    console.log(`%cdeno task start`, "color: green");
  } catch (error) {
    throw error;
  }
};
export default init;
