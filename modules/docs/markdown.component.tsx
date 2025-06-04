import { ComponentChildren } from "../../core/server/deps.ts";
import TableOfContents from "../wait/TableOfContents.tsx";

export const MarkdownComponent = (
  props: {
    children: ComponentChildren;
    title?: string;
    description?: string;
    toc?: Array<{ value: string; label: string }> | null;
  },
) => (
  <main class="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:p-8">
    <div
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
      class="markdown-body"
    >
      {props.title && (
        <h1 class="markdown-title">
          {props.title}
        </h1>
      )}
      {props.description && (
        <p class="markdown-description">
          {props.description}
        </p>
      )}
      {/* hide on large devices */}
      {props.toc && (
        <div class="lg:hidden">
          <TableOfContents tocItems={props.toc} />
        </div>
      )}

      {props.children}
    </div>
  </main>
);
