---
title: High performance deno web framework
description: Fastro is a simple and fast web framework built on top of deno. Its speed is close to the raw deno http library. Written in typescript
image: public/fastro.png
layout: default
---

# Fastro
![][build] ![][version]

Fastro is a simple and fast web framework built on top of [deno](https://deno.land). Its speed is [close to the raw deno http library](https://fastro.dev/benchmarks). 

|Module|Req/s avg|Percentage|
|--|--:|--:|
|Deno|23078.19|100.00%|
|Fastro|21344.37|92.48%|

Written in typescript. No need to register routes, controllers, middlewares, templates, or static files. They will be loaded and saved when the server starts. 

## Features

Fastro provides easy-to-use features for web development.


|application/json|x-www-form-urlencoded|
|multipart/form-data|command line interface|
|data validation|dynamic url param|
|serverless deployment|cookie|
|middleware|proxy|
|query param|static files|
|url prefix|url redirection|
|url routing by file name|template rendering|

You can see detailed examples [here](https://github.com/fastrodev/fastro/blob/master/services).

## Getting Started
- Go to [the quickstart](https://fastro.dev/docs/quickstart) to install command line interface and create a project.

## Serverless Demo
- [Webapp deployed on flexible google app engine](https://phonic-altar-274306.ue.r.appspot.com).
- [Webapp deployed on google cloud run](https://hello-6bxxicr2uq-ue.a.run.app).

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[version]: https://img.shields.io/github/v/release/fastrojs/fastro?label=version "fastro version"
