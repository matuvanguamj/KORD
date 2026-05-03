/**
 * KORD LOADER — Machine à écrire + barre de chargement
 * Police Space Grotesk, identité KORD pure.
 */
(function() {
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
      animation: kord-reveal 0.65s cubic-bezier(0.76, 0, 0.24, 1) forwards;
    }

    @keyframes kord-reveal {
      0%   { clip-path: inset(0 0 0 0); }
      100% { clip-path: inset(0 0 100% 0); }
    }

    #kl-word {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: clamp(52px, 8vw, 88px);
      letter-spacing: -0.02em;
      color: #fff;
      text-transform: uppercase;
      line-height: 1;
      min-width: 4ch;
      display: flex;
      align-items: center;
      gap: 0;
      margin-bottom: 40px;
    }

    /* Curseur clignotant */
    #kl-cursor {
      display: inline-block;
      width: 3px;
      height: 0.85em;
      background: #fff;
      margin-left: 4px;
      vertical-align: middle;
      animation: kl-blink 0.7s step-end infinite;
      flex-shrink: 0;
    }

    @keyframes kl-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }

    #kl-cursor.done {
      animation: kl-cursor-fade 0.3s ease 0.4s forwards;
    }
    @keyframes kl-cursor-fade {
      to { opacity: 0; }
    }

    /* Barre de chargement */
    #kl-bar-wrap {
      width: min(240px, 40vw);
      height: 1px;
      background: rgba(255,255,255,0.1);
      position: relative;
      overflow: hidden;
    }

    #kl-bar-fill {
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 0%;
      background: #fff;
      transition: width 0.1s linear;
    }

    /* Flash transition entre pages */
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
    <div id="kl-word"><span id="kl-text"></span><span id="kl-cursor"></span></div>
    <div id="kl-bar-wrap"><div id="kl-bar-fill"></div></div>
  `;

  const transition = document.createElement('div');
  transition.id = 'kord-transition';

  function insert() {
    if (document.body) {
      document.body.appendChild(loader);
      document.body.appendChild(transition);
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

  // Machine à écrire
  const WORD    = 'KORD';
  const DELAYS  = [0, 120, 240, 380]; // timing irrégulier — naturel
  let pageReady = false;
  let typeDone  = false;

  function startAnimation() {
    const textEl   = document.getElementById('kl-text');
    const cursor   = document.getElementById('kl-cursor');
    const barFill  = document.getElementById('kl-bar-fill');

    // Tape les lettres
    WORD.split('').forEach((char, i) => {
      setTimeout(() => {
        textEl.textContent += char;
        if (i === WORD.length - 1) {
          typeDone = true;
          cursor.classList.add('done');
          maybeHide();
        }
      }, 200 + DELAYS[i]);
    });

    // Barre de progression
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 12 + 4;
      if (pct >= 92) { pct = 92; clearInterval(interval); }
      barFill.style.width = pct + '%';
    }, 120);

    window._kordBarFill   = barFill;
    window._kordInterval  = interval;
  }

  function maybeHide() {
    if (typeDone && pageReady) hide();
  }

  function hide() {
    const barFill = window._kordBarFill;
    clearInterval(window._kordInterval);
    if (barFill) barFill.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => { loader.style.display = 'none'; }, 750);
    }, 200);
  }

  const MIN  = 900; // durée minimale
  const start = Date.now();

  function onReady() {
    const elapsed   = Date.now() - start;
    const remaining = Math.max(0, MIN - elapsed);
    setTimeout(() => { pageReady = true; maybeHide(); }, remaining);
  }

  if (document.readyState === 'complete') onReady();
  else window.addEventListener('load', onReady);

  // Transitions entre pages
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

  window.kordNavigate = url => {
    transition.classList.add('flash');
    setTimeout(() => { window.location.href = url; }, 230);
  };
})();
