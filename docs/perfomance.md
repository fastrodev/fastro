# Perfomance

Starting from v0.30.25, `fastro` has been rewritten to improve performance. 

Here are the test results for the [keep-alive connections](https://www.google.com/search?q=keep+alive+connection).

|Module|Req/s|Percentage|
|--|--:|--:|
|Deno|23513.5|100.0%|
|Fastro|23025.6|97.9%|

You can see the details in [the benchmarks.](../benchmarks/readme.md)


## What's next:
- [Quickstart](quickstart.md)
- [Create a handler](handler.md)
- [Create a middleware](middleware.md)
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
