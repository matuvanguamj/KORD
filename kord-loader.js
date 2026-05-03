/**
 * KORD LOADER — Animation de chargement premium
 * Le K-Pivot s'assemble puis l'écran s'ouvre.
 * Inclure dans toutes les pages : <script src="kord-loader.js"></script>
 */

(function() {
  // Styles injectés directement
  const css = `
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
      transition: none;
    }

    #kord-loader.hide {
      animation: kord-split 0.7s cubic-bezier(0.76, 0, 0.24, 1) 0.1s forwards;
    }

    @keyframes kord-split {
      0%   { clip-path: inset(0 0 0 0); opacity: 1; }
      100% { clip-path: inset(0 0 100% 0); opacity: 1; }
    }

    /* SVG du K-Pivot */
    #kord-loader-svg {
      width: 64px;
      height: 64px;
      margin-bottom: 32px;
      overflow: visible;
    }

    /* Barre verticale */
    #kl-bar {
      transform-origin: 10.25px 16px;
      animation: kl-bar-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
    }
    @keyframes kl-bar-in {
      from { transform: scaleY(0); opacity: 0; }
      to   { transform: scaleY(1); opacity: 1; }
    }

    /* Diagonale haute */
    #kl-diag-top {
      stroke-dasharray: 140;
      stroke-dashoffset: 140;
      animation: kl-line-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.38s both;
    }
    @keyframes kl-line-in {
      to { stroke-dashoffset: 0; }
    }

    /* Diagonale basse */
    #kl-diag-bot {
      stroke-dasharray: 140;
      stroke-dashoffset: 140;
      animation: kl-line-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both;
    }

    /* Ligne de scan */
    #kl-scan {
      position: absolute;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255,255,255,0.08);
      animation: kl-scan-anim 1.2s ease-in-out 0.7s both;
      transform: translateY(-50vh);
    }
    @keyframes kl-scan-anim {
      0%   { transform: translateY(-50vh); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translateY(50vh); opacity: 0; }
    }

    /* Texte KORD */
    #kl-wordmark {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #fff;
      opacity: 0;
      animation: kl-word-in 0.4s ease 0.65s both;
    }
    @keyframes kl-word-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Tagline */
    #kl-tagline {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 400;
      font-size: 9px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.25);
      margin-top: 8px;
      opacity: 0;
      animation: kl-word-in 0.4s ease 0.8s both;
    }

    /* Barre de progression */
    #kl-progress-wrap {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1.5px;
      background: transparent;
    }
    #kl-progress {
      height: 100%;
      background: rgba(255,255,255,0.35);
      width: 0%;
      animation: kl-progress-anim 1.1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
    }
    @keyframes kl-progress-anim {
      0%   { width: 0%; }
      60%  { width: 75%; }
      90%  { width: 92%; }
      100% { width: 100%; }
    }

    /* Transition de page — overlay flash */
    #kord-transition {
      position: fixed;
      inset: 0;
      z-index: 99998;
      background: #000;
      pointer-events: none;
      opacity: 0;
    }
    #kord-transition.flash {
      animation: kord-flash 0.5s cubic-bezier(0.76, 0, 0.24, 1) forwards;
    }
    @keyframes kord-flash {
      0%   { opacity: 0; }
      40%  { opacity: 1; }
      100% { opacity: 0; }
    }
  `;

  // Injecter le CSS
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Créer le loader
  const loader = document.createElement('div');
  loader.id = 'kord-loader';
  loader.innerHTML = `
    <div id="kl-scan"></div>
    <svg id="kord-loader-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="kl-bar">
        <rect x="9" y="7" width="2.5" height="18" fill="white"/>
      </g>
      <line id="kl-diag-top"
        x1="11.5" y1="16" x2="23" y2="7"
        stroke="white" stroke-width="2.5" stroke-linecap="square"/>
      <line id="kl-diag-bot"
        x1="11.5" y1="16" x2="23" y2="25"
        stroke="white" stroke-width="2.5" stroke-linecap="square"/>
    </svg>
    <div id="kl-wordmark">KORD</div>
    <div id="kl-tagline">Performance Opérationnelle</div>
    <div id="kl-progress-wrap">
      <div id="kl-progress"></div>
    </div>
  `;

  // Overlay de transition entre pages
  const transition = document.createElement('div');
  transition.id = 'kord-transition';

  // Insérer dès que possible
  function insertLoader() {
    if (document.body) {
      document.body.appendChild(loader);
      document.body.appendChild(transition);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(loader);
        document.body.appendChild(transition);
      });
    }
  }

  insertLoader();

  // Masquer le loader quand la page est prête
  function hideLoader() {
    loader.classList.add('hide');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 900);
  }

  // Durée minimale d'affichage : 1.6s pour profiter de l'animation
  const MIN_DISPLAY = 1600;
  const startTime = Date.now();

  function ready() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY - elapsed);
    setTimeout(hideLoader, remaining);
  }

  if (document.readyState === 'complete') {
    ready();
  } else {
    window.addEventListener('load', ready);
  }

  // Transition entre pages (sur les liens internes)
  document.addEventListener('click', function(e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || a.target === '_blank') return;

    e.preventDefault();
    transition.classList.add('flash');
    setTimeout(() => {
      window.location.href = href;
    }, 250);
  });

  // Transition sur window.location.href programmatique
  const originalAssign = window.location.assign.bind(window.location);
  const originalReplace = window.location.replace.bind(window.location);

  // Exposer une fonction globale pour les navigations programmatiques
  window.kordNavigate = function(url) {
    transition.classList.add('flash');
    setTimeout(() => {
      window.location.href = url;
    }, 250);
  };

})();
