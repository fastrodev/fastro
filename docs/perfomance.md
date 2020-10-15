# Perfomance

Starting from v0.30.0, `fastro` has been rewritten to improve performance. 

Here are the test results for the hello-world keep-alive connection.

|Module|Req/s|Percentage|
|--|--:|--:|
|Deno|17238.8|100%|
|Fastro|16006.4|92.85%|

You can see the details in [the benchmarks.](../benchmarks/readme.md)


## What's next:
- [Quickstart](quickstart.md)
- [Create handler](handler.md)
- [Create middleware](middleware.md)
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Deployment](deployment.md)
- [Fastro API](api.md)