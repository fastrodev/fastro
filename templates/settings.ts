export const setting = `{
  "files.eol": "\\n",
  "files.trimTrailingWhitespace": true,
  "[javascript]": {
    "editor.defaultFormatter": "vscode.typescript-language-features"
  },
  "[typescript]": {
    "editor.defaultFormatter": "vscode.typescript-language-features",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true,
    }
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "vscode.typescript-language-features",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true,
    }
  },
  "deno.enable": true,
  "deno.unstable": true,
  "editor.tabSize": 2
}
`;
