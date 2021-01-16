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
<td>Body handling application/json</td>
<td>Body handling application/x-www-form-urlencoded</td>
<td>Body handling multipart/form-data</td>
</tr>
<tr>
<td>Command line interface</td>
<td>Data validation</td>
<td>Dynamic URL parameters</td>
</tr>
<tr>
<td>Serverless deployment</td>
<td>Supports cookie</td>
<td>Supports middleware</td>
</tr>
<tr>
<td>Supports proxy</td>
<td>Support querystring</td>
<td>Support static files</td>
</tr>
<tr>
<td>URL prefix</td>
<td>URL redirection</td>
<td>URL routing by file name</td>
</tr>
<tr>
<td>Template rendering</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
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
