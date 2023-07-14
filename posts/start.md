---
title: "Get started, hello world!"
description: We will create a SSR web application with one page and returning very simple react component.
image: https://fastro.dev/static/image.png
author: Fastro
date: 07/06/2023
---

### Prerequisites

Make sure you have Deno installed. This is required to run JS and TS code. With the `--version` argument below, you will know what version is installed.

Execute this command:
```zsh
deno --version
```

You will see the response
```zsh

deno 1.35.0 (release, x86_64-apple-darwin)
v8 11.6.189.7
typescript 5.1.6
```

If it hasn't been installed properly, please follow the detailed installation steps [here](https://deno.land/manual/getting_started/installation).


### Let's start coding

Okay, after deno installed to your computer, this is the perfect time to play. Create a folder for your project and enter to it.

```zsh
mkdir my-project && cd my-project
```

Generate default project from command line.

```zsh
deno run -A -r https://fastro.dev
```

Above command will generate default folders and files you can use for initial project.

Please note, the `-A` argument allows deno to access all permissions, and `-r` argument is to reload source code cache (recompile TypeScript).

```zsh

.
├── .github
│   └── workflows
│       └── build.yml
├── .vscode
│   └── settings.json
├── deno.json
├── main.ts
├── pages
│   └── app.tsx
└── readme.md
```

Now let's run the application

```zsh
deno task start
```

If there is no problem, you will see this message on the terminal

```zsh
Listening on http://localhost:8000
```

Open that link on [your browser](http://localhost:8000) or hit them via `curl`

```zsh
curl http://localhost:8000
```