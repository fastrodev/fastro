import { extract } from "https://deno.land/std@0.196.0/front_matter/any.ts";
import ReactMarkdown from "https://esm.sh/react-markdown@8.0.7";
import { Prism as SyntaxHighlighter } from "https://esm.sh/react-syntax-highlighter@15.5.0";
import * as prism from "https://esm.sh/react-syntax-highlighter@15.5.0/dist/esm/styles/prism";
import remarkGfm from "https://esm.sh/remark-gfm@3.0.1";

export { extract, prism, ReactMarkdown, remarkGfm, SyntaxHighlighter };
