# Fastro
![][build] ![][version]

Fastro is a simple and fast web framework built on top of [deno](https://deno.land). Its speed is [close to the raw deno http library](https://fastro.dev/docs/perfomance.html). 

|Module|Req/s|Percentage|
|--|--:|--:|
|Deno|23513.5|100.0%|
|Fastro|23025.6|97.9%|

Written in typescript. No need to register routes, controllers, middlewares, templates, or static files. They will be loaded and saved when the server starts. 

You can see the example of deployed webapp at this link: [https://hello-6bxxicr2uq-uc.a.run.app](https://hello-6bxxicr2uq-uc.a.run.app). 

## Features
||||
|--|--|--|
|`application/json`|`application/json`|`multipart/form-data`|
|Command line interface|Data validation|Dynamic URL parameters|
|Serverless deployment|Supports proxy|Supports `cookie`|Support querystring|
|Supports middleware|Support static files|Serverless middleware|URL prefix|
|URL redirection|URL routing by file name|Template rendering|

You can see the details in [the examples](https://github.com/fastrodev/fastro/blob/master/services).

## Get Started
Go to [the quickstart](https://fastro.dev/docs/quickstart) to create your own.

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[version]: https://img.shields.io/github/v/release/fastrojs/fastro?label=version "fastro version"
