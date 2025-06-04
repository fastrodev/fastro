export function getNavigationSections(baseUrl: string) {
  return [
    {
      title: "Getting Started",
      items: [
        {
          href: `${baseUrl}/docs/start?section=getting-started`,
          label: "Create a new app",
        },
        {
          href: `${baseUrl}/docs/structure?section=getting-started`,
          label: "Application Structure",
        },
      ],
    },
    {
      title: "Handling Requests",
      items: [
        {
          href: `${baseUrl}/docs/hello?section=handling-requests`,
          label: "Basic Request Handling",
        },
        {
          href: `${baseUrl}/docs/json?section=handling-requests`,
          label: "Working with JSON Responses",
        },
        {
          href: `${baseUrl}/docs/native?section=handling-requests`,
          label: "Working with Native Responses",
        },
        {
          href: `${baseUrl}/docs/tsx?section=handling-requests`,
          label: "Working with TSX Responses",
        },
        {
          href: `${baseUrl}/docs/tsx-component?section=handling-requests`,
          label: "TSX Components",
        },
        {
          href: `${baseUrl}/docs/hello-context?section=handling-requests`,
          label: "Working with Context",
        },
        {
          href: `${baseUrl}/docs/url-params?section=handling-requests`,
          label: "URL Parameters",
        },
        {
          href: `${baseUrl}/docs/url-query?section=handling-requests`,
          label: "URL Query Parameters",
        },
      ],
    },
    {
      title: "Middleware",
      items: [
        {
          href: `${baseUrl}/docs/app-middleware?section=middleware`,
          label: "Application Middleware",
        },
        {
          href: `${baseUrl}/docs/route-middleware?section=middleware`,
          label: "Route Middleware",
        },
        {
          href: `${baseUrl}/docs/markdown?section=middleware`,
          label: "Markdown Middleware",
        },
        {
          href: `${baseUrl}/docs/tailwind?section=middleware`,
          label: "Tailwind CSS Middleware",
        },
      ],
    },
    {
      title: "Routing",
      items: [
        {
          href: `${baseUrl}/docs/route?section=routing`,
          label: "Routing Overview",
        },
        {
          href: `${baseUrl}/docs/group?section=routing`,
          label: "Grouping Routes",
        },
      ],
    },
    {
      title: "Server Side Rendering",
      items: [
        {
          href: `${baseUrl}/docs/ssr?section=server-side-rendering`,
          label: "SSR Overview",
        },
      ],
    },
    {
      title: "Database",
      items: [
        { href: `${baseUrl}/docs/mysql?section=database`, label: "MySQL" },
        {
          href: `${baseUrl}/docs/postgres?section=database`,
          label: "Postgres",
        },
        { href: `${baseUrl}/docs/redis?section=database`, label: "Redis" },
        { href: `${baseUrl}/docs/mongo?section=database`, label: "Mongo" },
        {
          href: `${baseUrl}/docs/firestore?section=database`,
          label: "Google Firestore",
        },
        { href: `${baseUrl}/docs/kv?section=database`, label: "Deno KV" },
      ],
    },
  ];
}
