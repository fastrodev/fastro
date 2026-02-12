type Props = {
  user?: string | undefined;
};

import Logo from "./Logo.tsx";

export default function Header({ user }: Props) {
  return (
    <header className="header-container border-b border-gray-200 dark:border-gray-800 transition-colors">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .header-container {
          --space-v: 12px;
          --space-h: 16px;
          position: relative;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          padding: var(--space-v) var(--space-h);
        }
        .header-nav { display: flex; gap: 12px; align-items: center; }
        .site-title { font-weight: 700; font-size: 18px; color: #111827; margin-left: 8px; letter-spacing: 0.4px; }
        .nav-link { text-decoration: none; color: #374151; font-weight: 500; padding: 8px 12px; border-radius: 6px; display: inline-block; font-size: 15px; margin: 0; transition: all 0.2s; }
        .nav-link:hover { background: #f7f7fb; text-decoration: none; color: #111827; }
        .menu-button { display: none; background: none; border: none; font-size: 20px; padding: 6px; cursor: pointer; margin-left: 8px; color: #374151; }
        
        @media (prefers-color-scheme: dark) {
          .site-title { color: #f9fafb; }
          .nav-link { color: #d1d5db; }
          .nav-link:hover { background: #1f2937; color: #f9fafb; }
          .menu-button { color: #d1d5db; }
        }

        @media (max-width: 640px) {
          /* remove extra outer horizontal padding on mobile */
          .header-container { padding: var(--space-v) 0; }
          /* Mobile: full-width panel under header. top is computed by JS when opened. */
          .header-nav {
            display: none !important;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            width: 100vw;
            max-width: none;
            margin: 0;
            background: #fff;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            box-shadow: 0 6px 18px rgba(0,0,0,0.06);
            z-index: 600;
            align-items: stretch;
          }
          @media (prefers-color-scheme: dark) {
            .header-nav {
              background: #030712;
              border-bottom: 1px solid #1f2937;
              box-shadow: 0 6px 18px rgba(0,0,0,0.4);
            }
          }
          .header-nav .nav-link { display: block; padding: 12px 16px; border-bottom: 1px solid #f5f5f5; text-align: left; }
          @media (prefers-color-scheme: dark) {
            .header-nav .nav-link { border-bottom: 1px solid #111827; }
          }
          .header-nav .nav-link:last-child { border-bottom: none; }
          /* Ensure buttons styled like links */
          .header-nav button.nav-link { background: transparent; border: none; padding: 12px 16px; margin: 0; width: 100%; text-align: left; font: inherit; color: inherit; cursor: pointer; }
          .menu-button { display: inline-block; }
          .nav-open { display: flex !important; }
           /* Make the header inner container full-width on small screens so
             logo and menu sit flush with the viewport edges (small padding).
           */
          .header-container > div { max-width: 100%; width: 100%; padding-left: 8px; padding-right: 8px; margin: 0; box-sizing: border-box; }
        }
      `,
        }}
      />

      <div className="max-w-[720px] mx-auto px-6 md:px-8 flex justify-between items-center w-full">
        <div style={{ display: "flex", alignItems: "center" }}>
          <a
            href="/"
            className="inline-flex items-center mr-3 no-underline text-gray-900 dark:text-gray-100"
          >
            <Logo height={28} />
            <span className="site-title">FASTRO</span>
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {user
            ? (
              <>
                <nav id="header-nav" className="header-nav">
                  <a className="nav-link" href="/dashboard">Dashboard</a>
                  <a className="nav-link" href="/profile">Profile</a>
                  <a className="nav-link" href="/password">Change Password</a>
                  <a className="nav-link" href="/signout">Sign out</a>
                </nav>

                <button
                  type="button"
                  id="menu-btn"
                  className="menu-button"
                  aria-controls="header-nav"
                  aria-expanded="false"
                >
                  ☰
                </button>
              </>
            )
            : null}
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
        (function(){
          function ready(fn){ if(document.readyState!='loading') return fn(); document.addEventListener('DOMContentLoaded', fn); }
          ready(function(){
            var btn = document.getElementById('menu-btn');
            var nav = document.getElementById('header-nav');
            var header = document.querySelector('.header-container');
            if(!btn || !nav || !header) return;
            function isMobile(){ return window.matchMedia && window.matchMedia('(max-width:640px)').matches; }

            function updateNavTop(){
              try{
                var rect = header.getBoundingClientRect();
                // rect.bottom is relative to viewport; set nav top to that value in px
                nav.style.top = Math.max(rect.bottom, 0) + 'px';
              }catch(e){}
            }

            // Ensure initial state (hidden on mobile).
            // Do not write inline styles here — avoid mutating DOM before React hydrates.
            if(isMobile()){ /* CSS keeps nav hidden; compute top only when opening */ }

            btn.addEventListener('click', function(e){
              e.preventDefault();
              if(!isMobile()) return; // only toggle on mobile
              // recompute top in case layout changed
              updateNavTop();
              var open = nav.classList.toggle('nav-open');
              // Explicitly set inline display so important rules don't block toggle
              nav.style.display = open ? 'flex' : 'none';
              btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            });

            // Update position on resize/scroll and close when switching to desktop
            window.addEventListener('resize', function(){
              if(!isMobile()){
                nav.classList.remove('nav-open');
                nav.style.display = '';
                nav.style.top = '';
                btn.setAttribute('aria-expanded','false');
              } else {
                updateNavTop();
                if(nav.classList.contains('nav-open')) nav.style.display = 'flex';
              }
            });
            window.addEventListener('scroll', function(){ if(isMobile() && nav.classList.contains('nav-open')) updateNavTop(); });
          });
        })();
      `,
        }}
      />
    </header>
  );
}
