export const readme = `## Prerequisites
- Install [deno](https://deno.land/#installation)
- Install [vscode extension for deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
- Install [google cloud sdk](https://cloud.google.com/sdk)

## How to run
- Run in production:
  \`\`\`
  deno run -A main.ts
  \`\`\`

- Monitor any changes and automatically restart:
  \`\`\`
  fastro serve
  \`\`\`

## Directory Stucture

\`\`\`
.
├── app.yaml                    // configuration file for flexible google app engine
├── container.ts                // contains injection of other service dependencies
├── deps.ts                     // definition of all external module urls
├── Dockerfile                  // dockerfile
├── main.ts                     // app entry point
├── middleware                  // middleware folder
│   └── support.ts              // simple sample of middleware
├── module                      // module folder. save all your modules here
│   ├── hello.controller.ts     // simple sample of controller
│   ├── hello.template.html     // html template
│   ├── react.page.tsx          // simple react component
│   └── react.template.html     // react html template
├── public                      // public folder. folder for all your static files.
│   ├── favicon.ico             // webapp icon
│   └── index.html              // default page
└── readme.md                   // simple webapp manual

3 directories, 13 files
\`\`\`
`;
