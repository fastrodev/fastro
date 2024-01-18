let projectDir = "app";
const modulesDir = "modules";
const componentsDir = "components";
const utilsDir = "utils";
const vsCodeDir = ".vscode";

async function createFolder(name?: string) {
  projectDir = name ? name : "project";
  await Deno.mkdir(`${projectDir}/${modulesDir}`, { recursive: true });
  await Deno.mkdir(`${projectDir}/${componentsDir}`, { recursive: true });
  await Deno.mkdir(`${projectDir}/${utilsDir}`, { recursive: true });
  await Deno.mkdir(`${projectDir}/${vsCodeDir}`, { recursive: true });
}

async function createSettingsJson() {
  console.log("create vscode settings..");
  const settings = `{
  "deno.enable": true,
  "deno.lint": true,
  "deno.codeLens.test": true,
  "deno.documentPreloadLimit": 2000,
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
  "[markdown]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "css.customData": [
    ".vscode/tailwind.json"
  ],
  "[css]": {
    "editor.defaultFormatter": "vscode.css-language-features"
  }
}
`;
  const path = `${projectDir}/${vsCodeDir}/settings.json`;
  await Deno.writeTextFile(path, settings);
}

async function createTailwindJson() {
  const settings = `{
    "version": 1.1,
    "atDirectives": [
      {
        "name": "@tailwind",
        "description": "Use the \`@tailwind\` directive to insert Tailwind's \`base\`, \`components\`, \`utilities\` and \`screens\` styles into your CSS.",
        "references": [
          {
            "name": "Tailwind Documentation",
            "url": "https://tailwindcss.com/docs/functions-and-directives#tailwind"
          }
        ]
      },
      {
        "name": "@apply",
        "description": "Use the \`@apply\` directive to inline any existing utility classes into your own custom CSS. This is useful when you find a common utility pattern in your HTML that you’d like to extract to a new component.",
        "references": [
          {
            "name": "Tailwind Documentation",
            "url": "https://tailwindcss.com/docs/functions-and-directives#apply"
          }
        ]
      },
      {
        "name": "@responsive",
        "description": "You can generate responsive variants of your own classes by wrapping their definitions in the \`@responsive\` directive:\\n\`\`\`css\\n@responsive {\\n  .alert {\\n    background-color: #E53E3E;\\n  }\\n}\\n\`\`\`\\n",
        "references": [
          {
            "name": "Tailwind Documentation",
            "url": "https://tailwindcss.com/docs/functions-and-directives#responsive"
          }
        ]
      },
      {
        "name": "@screen",
        "description": "The\`@screen\` directive allows you to create media queries that reference your breakpoints by **name** instead of duplicating their values in your own CSS:\\n\`\`\`css\\n@screen sm {\\n  /* ... */\\n}\\n\`\`\`\\n…gets transformed into this:\\n\`\`\`css\\n@media (min-width: 640px) {\\n  /* ... */\\n}\\n\`\`\`\\n",
        "references": [
          {
            "name": "Tailwind Documentation",
            "url": "https://tailwindcss.com/docs/functions-and-directives#screen"
          }
        ]
      },
      {
        "name": "@variants",
        "description": "Generate \`hover\`, \`focus\`, \`active\` and other **variants** of your own utilities by wrapping their definitions in the \`@variants\` directive:\\n\`\`\`css\\n@variants hover, focus {\\n   .btn-brand {\\n    background-color: #3182CE;\\n  }\\n}\\n\`\`\`\\n",
        "references": [
          {
            "name": "Tailwind Documentation",
            "url": "https://tailwindcss.com/docs/functions-and-directives#variants"
          }
        ]
      }
    ]
  }`;
  const path = `${projectDir}/${vsCodeDir}/tailwind.json`;
  await Deno.writeTextFile(path, settings);
}

async function createExtensionsJson() {
  const settings = `{
  "recommendations": [
    "denoland.vscode-deno"
  ]
}`;
  const path = `${projectDir}/${vsCodeDir}/extensions.json`;
  await Deno.writeTextFile(path, settings);
}

async function createMain() {
  console.log("create main file..");
  const main = `import Server from "fastro/mod.ts";
import { tailwind } from "fastro/middleware/tailwind/mod.ts";
import { indexModule } from "$app/modules/index/index.mod.ts";
import { userModule } from "$app/modules/user/user.mod.ts";

const s = new Server();
s.use(tailwind());
s.group(indexModule);
s.group(userModule);
s.serve();`;

  const path = `${projectDir}/main.ts`;
  await Deno.writeTextFile(path, main);
}

function createLayout() {
  console.log("create layout..");
}

function createPage() {
  console.log("create page..");
}

async function createDenoJson() {
  console.log("create deno.json..");
  const deno = `{
"lock": false,
"tasks": {
  "start": "ENV=DEVELOPMENT deno run -A -r --unstable --watch main.ts",
  "build": "deno run -A --unstable main.ts --build ",
  "test": "rm -rf .hydrate && rm -rf cov && deno test -A --coverage=cov && deno coverage cov",
  "coverage": "deno coverage cov --lcov > cov.lcov"
},
"lint": {
  "rules": {
    "tags": [
      "recommended"
    ]
  }
},
"imports": {
  "$app/": "./",
  "preact": "npm:preact@10.19.2",
  "preact/": "npm:/preact@10.19.2/",
  "@preact/signals": "npm:/@preact/signals@1.2.2",
  "@preact/signals-core": "npm:/@preact/signals-core@1.5.1",
  "std/": "https://deno.land/std@0.210.0/",
  "fastro/": "https://raw.githubusercontent.com/fastrodev/fastro/preact/"
},
"compilerOptions": {
  "jsx": "react-jsx",
  "jsxImportSource": "preact"
},
"nodeModulesDir": true
}`;

  const path = `${projectDir}/deno.json`;
  await Deno.writeTextFile(path, deno);
}

export default async function (name?: string) {
  await createFolder(name);
  await createSettingsJson();
  await createTailwindJson();
  await createExtensionsJson();
  await createMain();
  await createLayout();
  await createPage();
  await createDenoJson();
}
