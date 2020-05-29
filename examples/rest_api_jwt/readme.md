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
|`handlers`| controller, serve http request. call service function |
|`services.ts`| CRUD logic, connected to database |
|`middleware`| modify default `request` object|

## Usage
```
deno run --allow-net main.ts
```