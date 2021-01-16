# High performance deno web framework
![][build] ![][version]

Fastro is a simple and fast web framework built on top of [deno](https://deno.land). Its speed is [close to the raw deno http library](https://fastro.dev/docs/perfomance.html). 

|Module|Req/s|Percentage|
|--|--:|--:|
|Deno|23513.5|100.0%|
|Fastro|23025.6|97.9%|

Written in typescript. No need to register routes, controllers, middlewares, templates, or static files. They will be loaded and saved when the server starts. 

## Features

<table>
<tbody>
<tr>
<td>Application/json</td>
<td>X-www-form-urlencoded</td>
</tr>
<tr>
<td>Multipart/form-data</td>
<td>Command line interface</td>
</tr>
<tr>
<td>Data validation</td>
<td>Dynamic URL parameters</td>
</tr>
<tr>
<td>Serverless deployment</td>
<td>Cookie</td>
</tr>
<tr>
<td>Middleware</td>
<td>Proxy</td>
</tr>
<tr>
<td>Query param</td>
<td>Static files</td>
</tr>
<tr>
<td>URL prefix</td>
<td>URL redirection</td>
</tr>
<tr>
<td>URL routing by file name</td>
<td>Template rendering</td>
</tr>
</tbody>
</table>

## Getting Started
- Go to [the quickstart](https://fastro.dev/docs/quickstart) to install and create a project.

## Examples
- Feature implementation: [https://github.com/fastrodev/fastro/blob/master/services](https://github.com/fastrodev/fastro/blob/master/services)
- Webapp deployed on flexible google app engine: [https://phonic-altar-274306.ue.r.appspot.com](https://phonic-altar-274306.ue.r.appspot.com)

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[version]: https://img.shields.io/github/v/release/fastrojs/fastro?label=version "fastro version"
