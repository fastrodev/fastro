export const md = `---
title: Fastro, a modern web framework for Deno and Preact
description: A brief introduction to Fastro, a modern web framework for Deno.
published_at: 2025-06-07
author: Abu Zaid
avatar: https://avatars.githubusercontent.com/u/10122431?s=70&v=4
url: #
bio: Abu Zaid is a software engineer and open source enthusiast. He loves building web applications
readTime: 5 min read
tags: ["Fastro", "Deno", "Web Framework", "Tutorial"]
image: https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80
post_type: blog
---

Fastro is a modern web framework for Deno that combines the simplicity of Express.js with the power and security of Deno. It is designed to be fast, secure, and easy to use, making it an excellent choice for building web applications.

## Table of Contents

## Features of Fastro
- **Simplicity**: Fastro provides a simple and intuitive API that makes it easy to get started with web development in Deno.
- **Performance**: Built on top of Deno's native HTTP server, Fastro is designed for high performance and low latency.
- **Security**: Fastro leverages Deno's security model, ensuring that your applications are secure by default.
- **TypeScript Support**: Fastro is built with TypeScript, providing type safety and better developer experience.
- **Middleware Support**: Fastro supports middleware, allowing you to easily add functionality to your applications.
- **Routing**: Fastro provides a powerful routing system that makes it easy to define routes and handle requests.

## Getting Started with Fastro
To get started with Fastro, you need to have Deno installed on your machine. You can install Deno by following the instructions on the [Deno website](https://deno.land/).
Once you have Deno installed, you can create a new Fastro application by running the following command:
\`\`\`bash
deno run -A -r https://fastro.deno.dev
\`\`\`

Fastro is a powerful, modern web framework built specifically for Deno. It combines the simplicity of Express.js with the power and security of Deno, making it an excellent choice for building fast, secure web applications.
`;

export function createPost(
  arg0: {
    content: string;
    author: string;
    avatar: string;
    image: string;
    title: string;
    description: string;
    tags: string;
    expired: boolean;
  },
) {
  console.log(arg0);
  throw new Error("Function not implemented.");
}
