export function layout(
  { children, data: { title } }: {
    children: React.ReactNode;
    data: { title: string };
  },
) {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

export function customRoot(children: React.ReactNode) {
  return (
    <div
      id="root"
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
    >
      {children}
    </div>
  );
}
