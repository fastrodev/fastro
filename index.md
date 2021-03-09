---
description: High performance deno web application framework
image: https://raw.githubusercontent.com/fastrojs/fastro/gh-pages/public/tree.png
layout: default
---

# Fastro
![][build] ![][version]

Fastro is a simple and fast web application framework built on top of
[deno](https://deno.land).

The speed is up to 92% of deno http raw library. Go to
[benchmarks](https://fastro.dev/benchmarks) to see the measurement and detailed
results.

## Getting Started
Go to [the documentation](https://fastro.dev/docs/) to install command
line interface, create a project, and see the demo.

![][tree]

## Features

Fastro provides easy-to-use features for web development.

- File system routing. *Managing files and folders of a monolithic application made easy. No need to register routes, controllers, middlewares,
  templates, or static files. They will be loaded and saved when the server
  starts.*
- Container based dependency injection. *Put all dependencies in a container and
  access them via function parameters.*
- React SSR. *Create react components, define props, and setup the html template
  in a very simple way.*
- More features:
  [*see all features and examples.*](https://fastro.dev/docs/features.html)

## Contributing

We appreciate your help!

To contribute, please read
[deno guidelines.](https://github.com/denoland/deno/blob/main/docs/contributing/style_guide.md)

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "build"
[version]: https://img.shields.io/github/v/release/fastrojs/fastro?label=version "version"
[tree]: https://raw.githubusercontent.com/fastrojs/fastro/gh-pages/public/tree.svg "tree"
