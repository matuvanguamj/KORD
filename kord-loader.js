/**
 * KORD LOADER — Machine à écrire + logo officiel
 * S'affiche sur index.html et après connexion (dashboard)
 */
(function() {

  const path = window.location.pathname;
  const showOn = ['/', '/index.html', '/kord.html', '/dashboard.html', '/admin.html'];

  const fromLogin = document.referrer.includes('login') ||
                    document.referrer.includes('register') ||
                    sessionStorage.getItem('kord_just_logged_in') === '1';

  const isDashboard = path.includes('dashboard') || path.includes('admin');
  const isIndex = path === '/' || path.includes('index') || path.includes('kord.html') || path === '';

  if (isDashboard && !fromLogin) {
    sessionStorage.removeItem('kord_just_logged_in');
    addTransitionOnly();
    return;
  }

  if (!isIndex && !isDashboard) {
    addTransitionOnly();
    return;
  }

  // ── CSS ──
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap');

    #kord-loader {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: all;
    }

    #kord-loader.hide {
      animation: kord-reveal 0.7s cubic-bezier(0.76, 0, 0.24, 1) forwards;
    }
    @keyframes kord-reveal {
      0%   { clip-path: inset(0 0 0 0); }
      100% { clip-path: inset(0 0 100% 0); }
    }

    #kl-lockup {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 44px;
    }

    #kl-logo {
      opacity: 0;
      transform: scale(0.6);
      transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1);
    }
    #kl-logo.show {
      opacity: 1;
      transform: scale(1);
    }

    #kl-word {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: clamp(56px, 9vw, 88px);
      letter-spacing: -0.01em;
      color: #fff;
      line-height: 1;
      display: flex;
      align-items: center;
      min-height: 1.1em;
    }

    #kl-cursor {
      display: inline-block;
      width: 3px;
      height: 0.82em;
      background: #fff;
      margin-left: 5px;
      vertical-align: middle;
      flex-shrink: 0;
      animation: kl-blink 0.55s step-end infinite;
    }
    @keyframes kl-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
    #kl-cursor.done {
      animation: kl-cursor-out 0.25s ease 0.3s forwards;
    }
    @keyframes kl-cursor-out {
      to { opacity: 0; width: 0; margin: 0; }
    }

    #kl-bar-wrap {
      width: min(200px, 38vw);
      height: 1px;
      background: rgba(255,255,255,0.08);
      position: relative;
      overflow: hidden;
    }
    #kl-bar-fill {
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 0%;
      background: rgba(255,255,255,0.7);
      transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
    }

    #kord-transition {
      position: fixed;
      inset: 0;
      z-index: 99998;
      background: #000;
      pointer-events: none;
      opacity: 0;
    }
    #kord-transition.flash {
      animation: kord-flash 0.45s cubic-bezier(0.76, 0, 0.24, 1) forwards;
    }
    @keyframes kord-flash {
      0%   { opacity: 0; }
      35%  { opacity: 1; }
      100% { opacity: 0; }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const loader = document.createElement('div');
  loader.id = 'kord-loader';
  loader.innerHTML = `
    <div id="kl-lockup">
      <svg id="kl-logo" xmlns="http://www.w3.org/2000/svg" viewBox="80 50 350 420" style="height:clamp(56px,9vw,88px);width:auto;flex-shrink:0">
        <g fill="#FFFFFF">
          <rect x="112" y="150" width="50" height="214"/>
          <rect x="234" y="72" width="52" height="156" transform="rotate(-47 260 150)"/>
          <rect x="205" y="276" width="52" height="166" transform="rotate(42 231 359)"/>
        </g>
      </svg>
      <div id="kl-word"><span id="kl-text"></span><span id="kl-cursor"></span></div>
    </div>
    <div id="kl-bar-wrap"><div id="kl-bar-fill"></div></div>
  `;

  const transition = document.createElement('div');
  transition.id = 'kord-transition';

  function insert() {
    const body = document.body;
    if (body) {
      body.appendChild(loader);
      body.appendChild(transition);
      startAnimation();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(loader);
        document.body.appendChild(transition);
        startAnimation();
      });
    }
  }
  insert();

  const WORD   = 'KORD';
  const DELAYS = [0, 380, 820, 1340];
  let typeDone  = false;
  let pageReady = false;

  function startAnimation() {
    const textEl  = document.getElementById('kl-text');
    const cursor  = document.getElementById('kl-cursor');
    const barFill = document.getElementById('kl-bar-fill');
    const logo    = document.getElementById('kl-logo');

    // Logo apparaît en premier
    setTimeout(() => { logo.classList.add('show'); }, 80);

    // Puis les lettres
    WORD.split('').forEach((char, i) => {
      setTimeout(() => {
        textEl.textContent += char;
        barFill.style.width = ((i + 1) / WORD.length * 75) + '%';
        if (i === WORD.length - 1) {
          typeDone = true;
          cursor.classList.add('done');
          setTimeout(() => { barFill.style.width = '100%'; }, 180);
          setTimeout(maybeHide, 400);
        }
      }, 400 + DELAYS[i]);
    });
  }

  function maybeHide() {
    if (typeDone && pageReady) hide();
  }

  function hide() {
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => { loader.style.display = 'none'; }, 800);
    }, 100);
  }

  const MIN   = 2400;
  const start = Date.now();

  function onReady() {
    const elapsed   = Date.now() - start;
    const remaining = Math.max(0, MIN - elapsed);
    setTimeout(() => { pageReady = true; maybeHide(); }, remaining);
  }

  if (document.readyState === 'complete') onReady();
  else window.addEventListener('load', onReady);

  setupTransitions();

  function setupTransitions() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto') || a.target === '_blank') return;
      e.preventDefault();
      transition.classList.add('flash');
      setTimeout(() => { window.location.href = href; }, 230);
    });
  }

  window.kordNavigate = url => {
    transition.classList.add('flash');
    setTimeout(() => { window.location.href = url; }, 230);
  };

  window.kordMarkLogin = () => {
    sessionStorage.setItem('kord_just_logged_in', '1');
  };

})();

function addTransitionOnly() {
  const css2 = `
    #kord-transition{position:fixed;inset:0;z-index:99998;background:#000;pointer-events:none;opacity:0}
    #kord-transition.flash{animation:kord-flash2 .45s cubic-bezier(.76,0,.24,1) forwards}
    @keyframes kord-flash2{0%{opacity:0}35%{opacity:1}100%{opacity:0}}
  `;
  const s = document.createElement('style');
  s.textContent = css2;
  document.head.appendChild(s);
  const t = document.createElement('div');
  t.id = 'kord-transition';
  function ins() {
    document.body.appendChild(t);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto') || a.target === '_blank') return;
      e.preventDefault();
      t.classList.add('flash');
      setTimeout(() => { window.location.href = href; }, 230);
    });
  }
  if (document.body) ins();
  else document.addEventListener('DOMContentLoaded', ins);
  window.kordNavigate = url => {
    t.classList.add('flash');
    setTimeout(() => { window.location.href = url; }, 230);
  };
  window.kordMarkLogin = () => {
    sessionStorage.setItem('kord_just_logged_in', '1');
  };
}
