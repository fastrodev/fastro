// deno-lint-ignore-file no-explicit-any
import { useState } from "preact/hooks";
import Footer from "../wait/Footer.tsx";
import Header from "../wait/Header.tsx";
import Navigation from "../wait/Navigation.tsx";
import TableOfContents from "../wait/TableOfContents.tsx";
import { MarkdownComponent } from "./markdown.component.tsx";
import { getNavigationSections } from "./navigation-sections.ts";

export default function Docs(
  props: {
    data: any;
  },
) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  const data = props.data;
  const nav = getNavigationSections(data.baseUrl);
  const activePath = props.data.url;

  return (
    <div class="min-h-screen" style="background-color: rgb(244, 242, 238);">
      <div class="sticky top-0 z-50">
        <Header
          title="Documentation"
          isLogin={false}
          user=""
          avatar_url=""
          baseUrl={data.baseUrl}
          isMobileNavOpen={isMobileNavOpen}
          setIsMobileNavOpen={setIsMobileNavOpen}
          isMobileTocOpen={isMobileTocOpen}
          setIsMobileTocOpen={setIsMobileTocOpen}
          navigationSections={nav}
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-6 py-6">
          <div class="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div class="lg:sticky lg:top-24">
              <Navigation
                navigationSections={nav}
                activePath={activePath}
              />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <MarkdownComponent
              title={props.data.attrs?.title || "Documentation"}
              description={props.data.attrs?.description ||
                "Documentation for Fastro"}
              toc={props.data.toc}
            >
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    props.data.markdown.props.dangerouslySetInnerHTML.__html,
                }}
              />
            </MarkdownComponent>
          </div>

          {/* Column 3: Content TOC - Hidden on mobile, shown on larger screens */}
          <div class="hidden lg:block lg:w-64 lg-flex-shrink-0">
            <div class="sticky top-24">
              {props.data.toc && <TableOfContents tocItems={props.data.toc} />}
            </div>
          </div>
        </div>
      </div>
      <Footer
        title="Fastro Documentation"
        description="Documentation for Fastro, a Deno framework for building web applications."
        baseUrl={data.baseUrl}
      />
    </div>
  );
}
