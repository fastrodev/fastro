export const setting = `{
  "files.eol": "\\n",
  "files.trimTrailingWhitespace": true,
  "[javascript]": {
    "editor.defaultFormatter": "denoland.vscode-deno-canary"
  },
  "[typescript]": {
    "editor.defaultFormatter": "denoland.vscode-deno-canary",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true,
    }
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "denoland.vscode-deno-canary",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true,
    }
  },
  "deno.enable": true,
  "deno.unstable": true,
  "deno.lint": true,
  "editor.tabSize": 2
}
`;
