# Fastro
![][build] ![][version]

Fastro is a simple and fast web framework built on top of [deno](https://deno.land). Its speed is [close to the raw deno http library](https://fastro.dev/docs/perfomance.html). 

|Module|Req/s|Percentage|
|--|--:|--:|
|Deno|23513.5|100.0%|
|Fastro|23025.6|97.9%|

Written in typescript. No need to register routes, controllers, middlewares, templates, or static files. They will be loaded and saved when the server starts. 

## Features
- Body handling `application/json`
- Body handling `application/x-www-form-urlencoded`
- Body handling `multipart/form-data`
- Command line interface
- Data validation
- Dynamic URL parameters
- Serverless deployment
- Supports `cookie`
- Supports middleware
- Supports proxy
- Support querystring
- Support static files
- URL prefix
- URL redirection
- URL routing by file name
- Template rendering

## Getting Started
Go to [the quickstart](https://fastro.dev/docs/quickstart) to create a project.

## Examples
You can see the example of deployed webapp at [this link](https://phonic-altar-274306.ue.r.appspot.com) and see the example of a feature implementation [here](https://github.com/fastrodev/fastro/blob/master/services).

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[version]: https://img.shields.io/github/v/release/fastrojs/fastro?label=version "fastro version"
