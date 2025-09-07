---
title: "Function Component"
description: How to create and use function components with TSX in Fastro
image: https://fastro.deno.dev/fastro.png
previous: tsx-component
next: ssr
---

Function components in Fastro are JavaScript functions that return JSX elements.
These components are compiled to efficient JavaScript during the build process.

## Table of contents

## Basic Function Component

Create a simple function component that returns JSX:

```tsx
export const Hello = () => {
  return <h1>Hello World!</h1>;
};
```

## Component with Props

Function components can accept props to make them dynamic and reusable:

```tsx
interface HelloProps {
  name: string;
  greeting?: string;
}

export const Hello = ({ name, greeting = "Hello" }: HelloProps) => {
  return <h1>{greeting} {name}!</h1>;
};
```

## Usage Example

Use your function components in other components or pages:

```tsx
export default function Page() {
  return (
    <div>
      <Hello name="World" />
      <Hello name="Fastro" greeting="Welcome" />
    </div>
  );
}
```

## Key Features

- **Type Safety**: Full TypeScript support with proper type checking
- **Build Optimization**: Components are compiled to optimized JavaScript
- **Server-Side Rendering**: Compatible with Fastro's SSR capabilities
- **Props Validation**: TypeScript interfaces ensure prop type safety
