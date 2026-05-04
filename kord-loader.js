/**
 * KORD Loader — Animation d'entrée avec logo officiel
 * Logo K-symbol apparaît, puis "ORD" se révèle, puis fondu
 */
(function() {
  const PAGES_WITH_LOADER = ['kord.html', '/', '/index.html'];
  const PAGES_AFTER_LOGIN  = ['dashboard.html'];

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const justLoggedIn = sessionStorage.getItem('kord_just_logged_in');

  const shouldShow = PAGES_WITH_LOADER.some(p => currentPage.includes(p)) ||
                     (PAGES_AFTER_LOGIN.some(p => currentPage.includes(p)) && justLoggedIn);

  if (!shouldShow) return;
  if (justLoggedIn) sessionStorage.removeItem('kord_just_logged_in');

  // Inject loader HTML
  const loader = document.createElement('div');
  loader.id = 'kord-loader';
  loader.innerHTML = `
    <style>
      #kord-loader {
        position: fixed; inset: 0; z-index: 99999;
        background: #000;
        display: flex; align-items: center; justify-content: center;
        flex-direction: column;
        transition: opacity 0.6s ease, visibility 0.6s ease;
      }
      #kord-loader.fade-out {
        opacity: 0; visibility: hidden;
      }
      .kl-lockup {
        display: flex; align-items: center; gap: 0;
        overflow: hidden;
      }
      .kl-symbol {
        opacity: 0;
        transform: scale(0.7) rotate(-8deg);
        transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
      }
      .kl-symbol.show {
        opacity: 1; transform: scale(1) rotate(0deg);
      }
      .kl-text {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
        font-size: 48px;
        color: #fff;
        letter-spacing: 0.05em;
        overflow: hidden;
        max-width: 0;
        transition: max-width 0.6s cubic-bezier(0.16,1,0.3,1), margin-left 0.6s cubic-bezier(0.16,1,0.3,1);
        white-space: nowrap;
        margin-left: 0;
      }
      .kl-text.show {
        max-width: 200px;
        margin-left: 14px;
      }
      .kl-tagline {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 300;
        font-size: 11px;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        color: #444;
        margin-top: 18px;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.4s ease, transform 0.4s ease;
      }
      .kl-tagline.show {
        opacity: 1; transform: translateY(0);
      }
      .kl-bar {
        width: 0;
        height: 1px;
        background: #222;
        margin-top: 32px;
        transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
      }
      .kl-bar.show { width: 160px; }
    </style>
    <div class="kl-lockup">
      <svg class="kl-symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="height:52px;width:52px">
        <g fill="#FFFFFF">
          <rect x="112" y="150" width="50" height="214" rx="0"/>
          <rect x="234" y="72" width="52" height="156" rx="0" transform="rotate(-47 260 150)"/>
          <rect x="205" y="276" width="52" height="166" rx="0" transform="rotate(42 231 359)"/>
        </g>
      </svg>
      <span class="kl-text">ORD</span>
    </div>
    <div class="kl-tagline">Performance Opérationnelle</div>
    <div class="kl-bar"></div>
  `;
  document.body.insertBefore(loader, document.body.firstChild);
  document.body.style.overflow = 'hidden';

  // Animation sequence
  requestAnimationFrame(() => {
    setTimeout(() => loader.querySelector('.kl-symbol').classList.add('show'), 120);
    setTimeout(() => loader.querySelector('.kl-text').classList.add('show'), 480);
    setTimeout(() => loader.querySelector('.kl-tagline').classList.add('show'), 700);
    setTimeout(() => loader.querySelector('.kl-bar').classList.add('show'), 800);
    setTimeout(() => {
      loader.classList.add('fade-out');
      document.body.style.overflow = '';
      setTimeout(() => loader.remove(), 700);
    }, 2000);
  });
})();
