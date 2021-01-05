// Copyright 2021 the Fastro author. All rights reserved. MIT license.

// deno-lint-ignore no-explicit-any
function createConfig(data: any) {
  const { appId, userEmail } = data;
  const yamlConfig = !userEmail ? `app_id: ${appId}` : `app_id: ${appId}
  user_email: ${userEmail}`;
  return yamlConfig;
}

// deno-lint-ignore no-explicit-any
function createPage(data: any) {
  const yamlContent = `type: page
  title: Hello world
  description: This is my awesome landing page
  
  headline:
      title: Headline
      description: My headline description
      image: headline.png
  `;
  return yamlContent;
}

function createService() {}

function createMiddleware() {}

function createHelp() {
  console.log("create help");
}

// deno-lint-ignore no-explicit-any
export function create(args?: any) {
  if (args.help) return createHelp();
  if (args.config) return createConfig(args);
  if (args.page) return createPage(args);
  if (args.service) return createService();
  if (args.middleware) return createMiddleware();
  const encoder = new TextEncoder();
}
