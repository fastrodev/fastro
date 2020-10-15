# Perfomance

Starting from v0.30.x, `fastro` has been rewritten to improve performance. Here are the test results for the hello-world keep-alive connection.

|Module|Req/s|Percentage|
|--|--:|--:|
|[Deno](https://github.com/fastrodev/fastro/blob/v0.30.5/benchmarks/deno_app.ts)|16384.0|100.0%|
|[Fastro](https://github.com/fastrodev/fastro/blob/v0.30.5/benchmarks/fastro_app.ts)|15291.2|93.3%|

You can see the details in [the benchmarks.](https://github.com/fastrodev/fastro/blob/master/benchmarks)


## What's next:
- [Quickstart](quickstart.md)
- [Create handler](handler.md)
- [Create middleware](middleware.md)
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Deployment](deployment.md)
- [Fastro API](api.md)