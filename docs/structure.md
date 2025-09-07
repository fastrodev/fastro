---
title: Application Structure
description: Understanding Fastro's flat modular architecture for improved readability and maintainability.
image: https://fastro.deno.dev/fastro.png
previous: start
next: hello
---

## Table of Contents

Fastro follows a **flat modular architecture** that promotes code organization,
maintainability, and scalability. This structure separates concerns while
keeping the codebase easy to navigate.

## Overview

The application structure is generated using the `tree -I 'node_modules'`
command. You can find detailed implementation examples in
[the source code template](https://github.com/fastrodev/template).

### Core Modules

The initial setup includes three main modules:

- **`index`** - Server-Side Rendering (SSR) page module for the main application
  views
- **`user`** - API module providing user-related data and operations
- **`markdown`** - Handles markdown file processing and rendering

> **Note**: You can modify existing modules or add new ones based on your
> application requirements.

## Directory Structure

```bash
.
├── components/
│   ├── footer.tsx
│   └── header.tsx
├── deno.json
├── main.ts
├── modules/
│   ├── index/
│   │   ├── index.handler.ts
│   │   ├── index.layout.tsx
│   │   ├── index.mod.ts
│   │   ├── index.page.tsx
│   │   └── index.service.ts
│   ├── markdown/
│   │   ├── markdown.mod.ts
│   │   └── readme.layout.tsx
│   └── user/
│       ├── user.handler.ts
│       ├── user.mod.ts
│       ├── user.service.ts
│       └── user.types.ts
├── readme.md
├── static/
│   └── tailwind.css
├── tailwind.config.ts
└── utils/
    └── db.ts
```

## File Reference Guide

### Configuration Files

| File                 | Purpose                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| `deno.json`          | Deno configuration file defining application behavior and task shortcuts (e.g., `deno task start`) |
| `tailwind.config.ts` | Tailwind CSS configuration. See [Tailwind docs](https://tailwindcss.com/docs/configuration)        |
| `main.ts`            | Application entry point - modify to add modules or application-level middleware                    |

### Core Directories

| Directory     | Description                                       |
| ------------- | ------------------------------------------------- |
| `utils/`      | Custom helper functions and utilities             |
| `utils/db.ts` | Deno.Kv database initialization and configuration |
| `modules/`    | Application modules organized by feature          |
| `components/` | Reusable UI components                            |
| `static/`     | Static assets (CSS, images, etc.)                 |

### Module Organization

Each module follows a consistent file naming convention:

| File Pattern   | Purpose                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| `*.mod.ts`     | **Module index** - Entry point for routes, middlewares, and pages        |
| `*.handler.ts` | **Request handlers** - Process incoming requests and responses           |
| `*.service.ts` | **Business logic** - Data processing and external service integration    |
| `*.types.ts`   | **Type definitions** - TypeScript interfaces and type declarations       |
| `*.page.tsx`   | **UI pages** - React/JSX components for rendering pages                  |
| `*.layout.tsx` | **Layout components** - Wrapper components for consistent page structure |

### Module Examples

#### Index Module (`modules/index/`)

Handles the main application pages with server-side rendering:

- Homepage rendering
- Layout management
- SEO optimization

#### User Module (`modules/user/`)

Manages user-related functionality:

- User API endpoints
- Authentication services
- Deno.Kv database operations

#### Markdown Module (`modules/markdown/`)

Processes markdown content:

- Markdown file parsing
- Documentation rendering
- Custom layout for markdown pages

## Best Practices

1. **Consistent naming**: Follow the established file naming patterns
2. **Separation of concerns**: Keep handlers, services, and types separate
3. **Modular design**: Each module should be self-contained and focused
4. **Type safety**: Use TypeScript types for better development experience
5. **Component reusability**: Place shared components in the `components/`
   directory

## Adding New Modules

To create a new module:

1. Create a new directory in `modules/`
2. Add the required files following the naming convention
3. Register the module in `main.ts`
4. Define routes in the module's `*.mod.ts` file

This structure ensures your application remains organized and scalable as it
grows.
