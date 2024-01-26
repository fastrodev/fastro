---
title: "Getting started"
description: We will create a SSR web application with one page and returning very simple react component.
page: 1
---

First, make sure you have Git and Deno installed.

See
[the git manual](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
and
[the deno manual](https://docs.deno.com/runtime/manual/getting_started/installation)
for details.

Generate default project from command line.

```zsh
deno run -A -r https://fastro.deno.dev
```

The above command will generate default folders and files that you can use for
the initial project.

```zsh
cd project
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

You can find more detailed instructions in
[the source code.](https://github.com/fastrodev/template)
