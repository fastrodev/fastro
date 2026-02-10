type Props = {
  user?: string | undefined;
};

import Logo from "./Logo.tsx";

export default function Header({ user: _user }: Props) {
  return (
    <header
      className="header-container"
      style={{
        marginBottom: 20,
        borderBottom: "1px solid #eee",
        paddingBottom: 10,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .header-container { position: relative; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
        .header-nav { display: flex; gap: 12px; align-items: center; }
        .nav-link { text-decoration: none; color: #111827; font-weight: 500; padding: 6px 8px; border-radius: 6px; display: inline-block; font-size: 15px; }
        .nav-link:hover { background: #f7f7fb; text-decoration: none; }
        .menu-button { display: none; background: none; border: none; font-size: 20px; padding: 6px; cursor: pointer; }
        @media (max-width: 640px) {
          .header-container { padding: 8px 0; }
          /* Make the mobile nav full viewport width and fixed under the header */
          .header-nav {
            display: none !important;
            flex-direction: column;
            position: fixed;
            top: 56px;
            left: 0;
            right: 0;
            width: 100vw;
            max-width: none;
            margin: 0;
            background: #fff;
            padding: 8px 12px;
            border-bottom: 1px solid #eee;
            box-shadow: 0 6px 18px rgba(0,0,0,0.06);
            z-index: 600;
            align-items: stretch;
          }
          .header-nav .nav-link { display: block; padding: 12px 16px; margin: 0; border-bottom: 1px solid #f5f5f5; text-align: left; }
          .header-nav .nav-link:last-child { border-bottom: none; }
          /* Ensure buttons styled like links */
          .header-nav button.nav-link { background: transparent; border: none; padding: 12px 16px; margin: 0; width: 100%; text-align: left; font: inherit; color: inherit; cursor: pointer; }
          .menu-button { display: inline-block; }
          .nav-open { display: flex !important; }
        }
      `,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <a href="/" style={{ display: "inline-block", marginRight: 12 }}>
            <Logo height={28} />
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
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
