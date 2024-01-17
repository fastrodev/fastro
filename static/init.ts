const projectDir = "app";

async function createFolder() {
  console.log("create project..");
  await Deno.mkdir(projectDir);
}

async function createVscodeDir() {
  console.log("create vscode folder..");
  const vsCodeDir = `${projectDir}/.vscode`;
  await Deno.mkdir(vsCodeDir);
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
  const vsCodeDir = `${projectDir}/.vscode/settings.json`;
  await Deno.writeTextFile(vsCodeDir, settings);
}

function createMain() {
  console.log("create main file..");
}

function createLayout() {
  console.log("create layout..");
}

function createPage() {
  console.log("create page..");
}

function createDenoJson() {
  console.log("create deno.json..");
}

export default function () {
  createFolder();
  createVscodeDir();
  createSettingsJson();
  createMain();
  createLayout();
  createPage();
  createDenoJson();
}
