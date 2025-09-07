---
title: "Create a new app"
description: Learn how to create your first Fastro application with server-side rendering and Preact components in minutes.
image: https://fastro.deno.dev/fastro.png
previous: "/"
next: structure
---

This guide will walk you through creating your first Fastro application - a
server-side rendered web app that returns a simple Preact component.

## Table of contents

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Git** - Version control system
  - Installation guide:
    [Git Manual](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- **Deno** - Modern JavaScript/TypeScript runtime
  - Installation guide:
    [Deno Manual](https://docs.deno.com/runtime/manual/getting_started/installation)

## Quick Start

### 1. Create a New Project

Generate a new Fastro project using the official template:

```bash
deno run -A -r https://fastro.deno.dev
```

This command will:

- Download the latest Fastro template
- Create a new project directory with all necessary files
- Set up the default folder structure

### 2. Navigate to Your Project

```bash
cd project
```

### 3. Start the Development Server

```bash
deno task start
```

### 4. Verify Installation

If everything is set up correctly, you should see:

```
Listening on http://localhost:8000
```

## Testing Your Application

### Browser Access

Open [http://localhost:8000](http://localhost:8000) in your web browser to view
your new Fastro application.

### Command Line Testing

Alternatively, test the server response using curl:

```bash
curl http://localhost:8000
```

## What You Get

The default Fastro template includes:

- 🚀 **Fast development** - Hot reloading and instant startup
- ⚡ **Server-side rendering** - SEO-friendly by default
- 🎨 **Preact integration** - Modern React-like components
- 📦 **Zero configuration** - Works out of the box
- 🔒 **TypeScript support** - Type safety included

## Next Steps

- Check out the [project structure](structure) to understand how Fastro
  organizes your code
- Explore the [template source code](https://github.com/fastrodev/template) for
  more detailed examples
- Learn about Fastro's features and capabilities in the following sections

## Troubleshooting

If you encounter issues:

1. **Installation Problems**
   - Ensure Deno and Git are properly installed
   - Verify you have internet access for downloading dependencies

2. **Server Issues**
   - Check that port 8000 is available
   - Try using a different port with `deno task start --port 3000`

3. **Permission Errors**
   - Make sure you have write permissions in the current directory
   - On some systems, you may need to run with elevated permissions

4. **Module Resolution**
   - Clear Deno cache: `deno cache --reload`
   - Review the console output for specific error messages

## Help & Support

- 📖 [Documentation](https://fastro.deno.dev)
- 🐛 [Report Issues](https://github.com/fastrodev/fastro/issues)
- 💬 [Community Discussions](https://github.com/fastrodev/fastro/discussions)
