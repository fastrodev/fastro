import { ComponentChildren } from "../../core/server/deps.ts";

export const defaultLayout = (props: {
  CSS: string;
  attrs: Record<string, unknown>;
  children: ComponentChildren;
}) => {
  console.log(props.attrs);
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          {props.CSS}
        </style>
        <link
          href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.min.css"
          rel="stylesheet"
        />
      </head>
      <body id="root">
        {props.children}
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-core.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js" />
      </body>
    </html>
  );
};
