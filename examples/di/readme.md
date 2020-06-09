# Dependency Injection Example

```
.
├── tsconfig.json
├── main.ts
├── root.controller.ts
├── hello.controller.ts
├── hello.service.ts
├── mobile.gateway.ts
└── web.gateway.ts
```

## File Description
| File | Used for| 
| :-- | :-- |
|`tsconfig.json`| typescript config |
|`main.ts`| application entry point|
|`root.controller.ts`| controller, contain root route and handler |
|`hello.controller.ts`| controller, contain several routes and handler |
|`hello.service.ts`| very simple bussiness logic|
|`mobile.gateway.ts`| gateway, contain several controller |
|`web.gateway.ts`| gateway, contain several controller |

## Application Entry Point
This is the application entry point. You no longer need import anything. `createServer` function already load all handlers and services for you.
```ts
import { createServer } from "../../mod.ts";
const server = await createServer();
await server.listen();
```

## Usage
```
deno run -c tsconfig.json --allow-net --allow-read main.ts
```
