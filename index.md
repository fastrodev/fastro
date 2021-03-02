---
description: High performance deno web application framework
image: public/fastro.png
layout: default
---
# Fastro
![][build] ![][version]

Fastro is a simple and fast web application framework built on top of
[deno](https://deno.land).


## Getting Started
Go to [the quickstart](https://fastro.dev/docs/quickstart) to install command
line interface and create a project.

![](public/tree.svg)

## Benchmarks
The speed is up to 92% deno http raw library. Go to
[benchmarks](https://fastro.dev/benchmarks) to see the measurement and detailed
results.

## Features
Fastro provides easy-to-use features for web development.

- Container based dependency injection: put all dependencies in a container and access them via function parameters.
- File system routing: no need to register routes, controllers, middlewares, templates, or static files. They will be loaded and saved when the server starts.
- React SSR: create react components, define props, and setup the html template in a very simple way.
- More features: [see all features and examples](https://github.com/fastrodev/fastro/blob/master/module).

## Serverless Demo
- [Webb app deployed on app engine](https://phonic-altar-274306.ue.r.appspot.com).
- [Webb app deployed on cloud run](https://hello-6bxxicr2uq-ue.a.run.app/).

## Contributing
We appreciate your help!

To contribute, please read [deno guidelines.](https://github.com/denoland/deno/blob/main/docs/contributing/style_guide.md)

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[version]: https://img.shields.io/github/v/release/fastrojs/fastro?label=version "fastro version"

