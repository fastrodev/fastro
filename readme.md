
# Fastro
![][build] ![][version]

Fastro is a simple and fast web framework built on top of [deno](https://deno.land). Its speed is [close to the raw deno http library](https://fastro.dev/benchmarks). 

|Module|Req/s avg|Percentage|
|--|--:|--:|
|Deno|23513.5|100.0%|
|Fastro|23025.6|97.9%|

Written in typescript. No need to register routes, controllers, middlewares, templates, or static files. They will be loaded and saved when the server starts. 

## Features

Fastro provides easy-to-use features for web development.

<table>
<tbody>
<tr>
<td>application/json</td>
<td>x-www-form-urlencoded</td>
</tr>
<tr>
<td>multipart/form-data</td>
<td>command line interface</td>
</tr>
<tr>
<td>data validation</td>
<td>dynamic url param</td>
</tr>
<tr>
<td>serverless deployment</td>
<td>cookie</td>
</tr>
<tr>
<td>middleware</td>
<td>proxy</td>
</tr>
<tr>
<td>query param</td>
<td>static files</td>
</tr>
<tr>
<td>url prefix</td>
<td>url redirection</td>
</tr>
<tr>
<td>url routing by file name</td>
<td>template rendering</td>
</tr>
</tbody>
</table>

You can see detailed examples [here](https://github.com/fastrodev/fastro/blob/master/services).

## Getting Started
- Go to [the quickstart](https://fastro.dev/docs/quickstart) to install command line interface and create a project.

## Serverless Demo
- [Webapp deployed on flexible google app engine](https://phonic-altar-274306.ue.r.appspot.com).
- [Webapp deployed on google cloud run](https://hello-6bxxicr2uq-ue.a.run.app/).

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[version]: https://img.shields.io/github/v/release/fastrojs/fastro?label=version "fastro version"
