---
title: "Building a High-Performance CMS with Fastro, Deno Deploy, and Deno KV"
description: "How we built the Fastro CMS using only Deno, Fastro, and Markdown—powered by modern content management via Deno KV."
date: 2026-02-15
author: "Fastro Team"
tags: ["cms", "markdown", "deno-kv"]
image: "https://storage.googleapis.com/replix-394315-file/uploads/dashboard.jpg"
---

![cms](https://storage.googleapis.com/replix-394315-file/uploads/dashboard.jpg)

When we built the Fastro CMS, we wanted something fast, maintainable, and cost-effective. We used our own product: **Fastro** on **Deno Deploy**.

The result? A high-performance CMS that runs completely for **FREE**, without a traditional database, powered by Markdown files and **Deno KV** for configuration management.

## Modern Tech Stack

Our stack is designed to be as efficient as possible:
- **Framework**: [Fastro](https://fastro.dev) (A Fullstack Deno Framework)
- **Runtime**: [Deno](https://deno.com)
- **Storage**: A hybrid of filesystem (Markdown) and **Deno KV** (Config & Meta)
- **Deployment**: [Deno Deploy](https://deno.com/deploy)
- **UI**: React 19 with Server Side Rendering (SSR) and Tailwind CSS.

## What's New?

We have recently integrated advanced features to simplify content management directly from the CMS dashboard:

### 1. Dynamic Navigation via Deno KV
Previously, the header navigation menu was static. Now, we use **Deno KV** to store page configurations. Through the CMS dashboard, we can designate up to 4 main pages (from the `/pages` folder) to appear in the site navigation in real-time without needing a redeploy.

### 2. Integrated Content & Git Management
We've added features to manage posts and media assets directly through the dashboard:
- **Post Management**: Create and manage Markdown posts directly from the browser. These changes are handled using integrated Git commands via server-side handlers (Git via API).
- **Media Management**: Upload and delete CMS image assets directly from the UI.
- **Git Dashboard**: Monitor newly added (*untracked*), modified, and even *deleted* files. You can *Add*, *Commit*, and *Push* directly from the dashboard without touching the terminal.

> **Note**: Currently, these Git-based management features are only available when running on `localhost`. In the next version, we plan to integrate this with the **GitHub API** to make it fully functional in **Deno Deploy** environments.

### 3. Security & Environment Guard
The CMS is designed with smart environment detection. Critical features like Git operations and sensitive file management are automatically protected with *guards* when running on **Deno Deploy**, ensuring system integrity in production environments.

## Why Still No Traditional Database?

We stay true to our minimalist principles:
1.  **Version Control in Git**: Markdown content remains in Git as the single source of truth.
2.  **Deno KV for State**: Using Deno KV for application configuration provides much lower latency compared to conventional SQL/NoSQL databases.
3.  **Real-time Metrics**: The CMS dashboard now displays the count of files in `/pages`, `/posts`, and `/public/img` instantly, providing an overview of storage capacity.

## Cost: Still $0.00

With Fastro's tiny memory footprint and Deno KV's efficiency within the Deno Deploy free tier, this CMS continues to run with zero operational costs.

## Conclusion

Building a modern CMS no longer means being trapped in heavy system complexity. By combining **Markdown** for content and **Deno KV** for state management, you get a robust, fast, and extremely easy-to-manage CMS.

Stay tuned for more updates as we continue to evolve the Fastro CMS!
