import { PageProps } from "@app/mod.ts";
import { useState } from "preact/hooks";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import HeroSection from "./HeroSection.tsx";
import FeatureCards from "./FeatureCards.tsx";
import PostsSection from "./PostsSection.tsx";

export default function Wait({ data }: PageProps<
  {
    user: string;
    title: string;
    description: string;
    baseUrl: string;
    new: string;
    destination: string;
    isLogin: boolean;
    avatar_url: string;
    html_url: string;
    popularPosts?: Array<{
      title: string;
      slug: string;
      description: string;
      date: string;
      readTime: string;
      image?: string;
    }>;
  }
>) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  return (
    <div class="min-h-screen bg-gray-950 text-white">
      <div class="sticky top-0 z-50">
        <Header
          title={data.title}
          isLogin={data.isLogin}
          user={data.user}
          avatar_url={data.avatar_url}
          baseUrl={data.baseUrl}
          isMobileNavOpen={isMobileNavOpen}
          setIsMobileNavOpen={setIsMobileNavOpen}
          isMobileTocOpen={isMobileTocOpen}
          setIsMobileTocOpen={setIsMobileTocOpen}
          navigationSections={[]}
        />
      </div>

      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 pb-6 sm:gap-6">
          <HeroSection
            title="The Next-Gen Content Management System"
            description={data.description}
          />
          <FeatureCards />
          <PostsSection popularPosts={data.popularPosts} />
        </div>
      </div>

      <Footer
        title={data.title}
        description={data.description}
        baseUrl={data.baseUrl}
      />
    </div>
  );
}
