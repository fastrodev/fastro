const version = "v0.77.0";
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
import layout from "./layout.ts";
import app from "./pages/app.tsx";

// initiate the application
const f = new fastro();

// define API end point
f.get("/api", () => Response.json({ uuid: crypto.randomUUID() }));

// setup static folder with maxAge 90
f.static("/static", { folder: "static", maxAge: 90 });

// setup the page endpoint with the \`app\` component
f.page(
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

// serves HTTP requests
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
    "start": "deno run -A --watch main.ts --development",
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
  const [data, setD] = useState({
    uuid: "e90d45df-4132-41ad-aec8-e0e19f7647a9",
  });

  const handleClick = async () => {
    const res = await fetch("/api");
    setD(await res.json());
  };

  return (
    <>
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
    </>
  );
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

    // layout
    await Deno.writeTextFile(
      "layout.ts",
      `import { RenderOptions } from "https://deno.land/x/fastro@${v}/mod.ts";

export default function (
  props: { data: string; title: string; description: string },
): RenderOptions {
  return {
    props: { data: props.data },
    cache: false,
    html: {
      class: "h-100",
      head: {
        title: props.title,
        descriptions: props.description,
        meta: [
          { charset: "utf-8" },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
          {
            name: "description",
            content: "Fast & Simple Web Application Framework",
          },
          {
            property: "og:image",
            content: "https://fastro.dev/static/image.png",
          },
        ],
        link: [{
          href:
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
          rel: "stylesheet",
          integrity:
            "sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD",
          crossorigin: "anonymous",
        }, {
          href: "/static/app.css",
          rel: "stylesheet",
        }],
        script: [{
          src:
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js",
          integrity:
            "sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN",
          crossorigin: "anonymous",
        }],
      },
      body: {
        class: "h-100 text-bg-dark",
        script: [],
        root: {
          class: "cover-container d-flex w-100 h-100 p-3 mx-auto flex-column",
        },
      },
    },
  };
}
`,
    );
  } catch (error) {
    throw error;
  }
};
export default init;
