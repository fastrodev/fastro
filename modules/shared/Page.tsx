import type { ReactNode } from "react";

type Props = {
  user?: string | undefined;
  children?: ReactNode;
  title?: string;
};

import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

export default function Page({ user, children, title }: Props) {
  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif" }}
      className="min-h-screen flex flex-col w-full"
    >
      {user ? <Header user={user} /> : <Header user={undefined} />}

      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Animate on load without mutating DOM classes to avoid hydration mismatch */
          .page { opacity: 0; transform: translateY(6px); animation: pageFade .24s ease forwards; }
          .page-exit { opacity: 0; transform: translateY(-6px); transition: opacity .18s ease, transform .18s ease; }
          @keyframes pageFade { to { opacity: 1; transform: none; } }
          `,
        }}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            if(typeof window === 'undefined') return;
            function ready(fn){ if(document.readyState !== 'loading') return fn(); document.addEventListener('DOMContentLoaded', fn); }
            ready(function(){
              try{
                var main = document.querySelector('main.page');

                // intercept same-origin link clicks to animate exit briefly
                document.addEventListener('click', function(e){
                  try{
                    var a = e.target.closest && e.target.closest('a');
                    if(!a) return;
                    var href = a.getAttribute('href');
                    if(!href) return;
                    if(href.indexOf('http') === 0 || href.indexOf('mailto:') === 0) return;
                    if(href.charAt(0) === '#') return;
                    if(a.hasAttribute('download') || a.target) return;
                    if(href.indexOf('/') !== 0) return;
                    if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

                    e.preventDefault();
                    if(main){
                      main.classList.add('page-exit');
                    }
                    setTimeout(function(){ window.location.href = href; }, 140);
                  }catch(_err){}
                }, false);
              }catch(_e){}
            });
          })();
          `,
        }}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 page flex-1 w-full">
        {title
          ? (
            <h1 className="text-2xl font-semibold leading-tight mt-0 mb-4">
              {title}
            </h1>
          )
          : null}
        {children}
      </main>
      <Footer />
    </div>
  );
}

export { Page };
