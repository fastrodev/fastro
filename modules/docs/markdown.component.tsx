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
  <main class="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 sm:p-6 lg:p-8">
    {props.title && (
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-100 mb-4">
        {props.title}
      </h1>
    )}
    {props.description && (
      <p class="text-sm sm:text-base text-gray-400 mb-6">
        {props.description}
      </p>
    )}

    {/* hide on large devices */}
    {props.toc && (
      <div class="lg:hidden *:mt-4 mb-6">
        <TableOfContents tocItems={props.toc} />
      </div>
    )}

    <div
      data-color-mode="dark"
      data-dark-theme="dark"
      class="markdown-body"
    >
      {props.children}
    </div>
  </main>
);
