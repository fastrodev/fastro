---
title: Get Started
description: We will create a very simple web application with one route and returning the text hello-world.
image: static/image.png
author: Yanu Widodo
date: 07/06/2023
---

### Prerequisites

Make sure you have Deno installed. This is required to run JS and TS code. With the `--version` argument below, you will know what version is installed.

Execute this command:
```zsh
> deno --version
```

You will see the response
```zsh
deno 1.35.0 (release, x86_64-apple-darwin)
v8 11.6.189.7
typescript 5.1.6
```

> If not, you can read [this page](https://deno.land/manual/getting_started/installation) for detailed instruction.


### Let's start coding

Okay, after deno installed to your computer, this is the perfect time to play. Create a folder for your project.

```zsh
> mkdir my-project
```

Enter to the folder
```zsh
> cd my-project
```


Create a `main.ts` file for deno-cli entry point.

```zsh
> touch main.ts
```

Open the created file with vi or your favorite editor

```zsh
> vi main.ts
```

Copy and paste the code below

```ts
import fastro from "https://deno.land/x/fastro/server/mod.ts";

const f = fastro();

f.get("/", () => "Hello, World!");

f.serve();
```

Save the file. And run the app

```zsh
> deno run -A main.ts
```

Please note, the `-A` argument allows deno to access all permissions.

If there are no problems, you will see this message in the terminal.

```zsh
Listening on http://localhost:8000
```

Open that link on [your browser](http://localhost:8000) or hit them via `curl`

```zsh
> curl http://localhost:8000
```

You will see the response

```zsh
Hello world
```