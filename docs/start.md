---
title: "Getting started"
description: We will create a SSR web application with one page and returning very simple react component.
image: https://fastro.dev/static/image.png
author: Fastro
date: 07/06/2023
---

First, make sure you have Deno installed. See
[the deno manual](https://deno.land/manual/getting_started/installation) for
details.

Then, create a folder for your project and enter to it.

```zsh
mkdir my-project && cd my-project
```

Generate default project from command line.

```zsh
deno run -A -r https://fastro.dev
```

The above command will generate default folders and files that you can use for
the initial project.

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

You can find more detailed instructions in
[the manual page](/manual#server-side-rendering).
