import { ComponentChildren } from "../../core/server/deps.ts";

export const defaultMarkdownWrapper = (
  children: ComponentChildren,
  attrs: Record<string, unknown>,
  toc?: Array<{ value: string; label: string }> | null,
) => (
  <main
    data-color-mode="auto"
    data-light-theme="light"
    data-dark-theme="dark"
    class="markdown-body"
  >
    {attrs.title && (
      <h1 class="markdown-title">
        {attrs.title}
      </h1>
    )}
    {attrs.description && (
      <p class="markdown-description">
        {attrs.description}
      </p>
    )}
    {toc && (
      <nav class="table-of-contents">
        <ul>
          {toc.map((item, index) => (
            <li key={index}>
              <a href={item.value}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    )}
    {children}
  </main>
);
