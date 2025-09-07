export function getNavigationSections(baseUrl: string) {
  return [
    {
      title: "Getting Started",
      href: `${baseUrl}/docs/start`,
      items: [
        {
          href: `${baseUrl}/docs/start`,
          label: "Create a new app",
        },
        {
          href: `${baseUrl}/docs/structure`,
          label: "Application Structure",
        },
      ],
    },
    {
      title: "Handling Requests",
      href: `${baseUrl}/docs/hello`,
      items: [
        {
          href: `${baseUrl}/docs/hello`,
          label: "Basic Request Handling",
        },
        {
          href: `${baseUrl}/docs/json`,
          label: "Working with JSON Responses",
        },
        {
          href: `${baseUrl}/docs/native`,
          label: "Working with Native Responses",
        },
        {
          href: `${baseUrl}/docs/tsx`,
          label: "Working with TSX Responses",
        },
        {
          href: `${baseUrl}/docs/tsx-component`,
          label: "TSX Components",
        },
        {
          href: `${baseUrl}/docs/hello-context`,
          label: "Working with Context",
        },
        {
          href: `${baseUrl}/docs/url-params`,
          label: "URL Parameters",
        },
        {
          href: `${baseUrl}/docs/url-query`,
          label: "URL Query Parameters",
        },
      ],
    },
    {
      title: "Middleware",
      href: `${baseUrl}/docs/app-middleware`,
      items: [
        {
          href: `${baseUrl}/docs/app-middleware`,
          label: "Application Middleware",
        },
        {
          href: `${baseUrl}/docs/route-middleware`,
          label: "Route Middleware",
        },
        {
          href: `${baseUrl}/docs/markdown`,
          label: "Markdown Middleware",
        },
        {
          href: `${baseUrl}/docs/tailwind`,
          label: "Tailwind CSS Middleware",
        },
      ],
    },
    {
      title: "Routing",
      href: `${baseUrl}/docs/route`,
      items: [
        {
          href: `${baseUrl}/docs/route`,
          label: "Routing Overview",
        },
        {
          href: `${baseUrl}/docs/group`,
          label: "Grouping Routes",
        },
      ],
    },
    {
      title: "Server Side Rendering",
      href: `${baseUrl}/docs/ssr`,
      items: [
        {
          href: `${baseUrl}/docs/ssr`,
          label: "SSR Overview",
        },
        {
          href: `${baseUrl}/docs/fn-component`,
          label: "Function Components",
        },
      ],
    },
    {
      title: "Database",
      href: `${baseUrl}/docs/kv`,
      items: [
        { href: `${baseUrl}/docs/kv`, label: "Deno KV" },
        { href: `${baseUrl}/docs/mysql`, label: "MySQL" },
        {
          href: `${baseUrl}/docs/postgres`,
          label: "Postgres",
        },
        { href: `${baseUrl}/docs/redis`, label: "Redis" },
        { href: `${baseUrl}/docs/mongo`, label: "Mongo" },
        {
          href: `${baseUrl}/docs/firestore`,
          label: "Firestore",
        },
      ],
    },
    {
      title: "Deployment",
      href: `${baseUrl}/docs/deploy`,
      items: [],
    },
    {
      title: "Examples",
      href: `https://github.com/fastrodev/fastro/tree/main/examples`,
      items: [],
    },
    {
      title: "Benchmarks",
      href: `${baseUrl}/docs/benchmarks`,
      items: [],
    },
  ];
}
