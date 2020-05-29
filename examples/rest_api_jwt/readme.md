# REST API with JWT Auth

## Structure
```
.
├── main.ts
├── handlers.ts
├── middleware.ts
└── services.ts
```
## Description
| File | Used for| 
| :-- | :-- |
|`main.ts`| application entry point|
|`handlers.ts`| controller, serve http request. call service function |
|`services.ts`| CRUD logic, connected to database |
|`middleware.ts`| modify default `request` object|

## Usage
```
deno run --allow-net main.ts
```