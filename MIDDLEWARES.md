# Fastro Middlewares

Welcome to the Fastro middleware collection! This page lists all available
middlewares created by the community.

**Want to add your middleware?** Please follow the instructions in the
[Contributing Guide](/CONTRIBUTING.md) and add your middleware to this list via
a Pull Request.


## Official Middlewares

These middlewares are maintained by the Fastro core team.

| Name       | Description                        | Source                                  |
| :--------- | :--------------------------------- | :-------------------------------------- |
| **Logger** | Standard request/response logging. | [Source](/middlewares/logger/logger.ts)    |
| **CORS**   | Handle Cross-Origin Resource Sharing. | [Source](/middlewares/cors/cors.ts) |
| **Static** | Serve static files and SPA support.| [Source](/middlewares/static/static.ts)    |
| **BodyParser**| Parse request body (JSON, Form, etc.) | [Source](/middlewares/bodyparser/bodyparser.ts) |


## Modules as Middleware

In Fastro, every module is a middleware. This allows for powerful patterns where you can group routes and logic into directories and load them dynamically.

- Learn more about [Creating Modules](/blog/modules).
- See the [Module Loader](/core/loader.ts) source code.


## Community Middlewares

Add your awesome middlewares here!

| Name                   | Description                            | Author                                     | Link                                                                      |
| :--------------------- | :------------------------------------- | :----------------------------------------- | :------------------------------------------------------------------------ |
| **Example Middleware** | A starter template for your own logic. | [@fastrodev](https://github.com/fastrodev) | [View Source](/CONTRIBUTING.md#3-practical-example-request-logger--state) |


### How to add your middleware here:

1. Create your middleware logic.
2. Submit a PR adding your middleware to the `middlewares/` directory.
3. Add a new row to the table above with your details.
