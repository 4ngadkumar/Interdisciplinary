// ===== SMOOTH LOADING ANIMATION =====
const Loader = {
  show() {
    if (document.getElementById('iv-loader')) return;
    const el = document.createElement('div');
    el.id = 'iv-loader';
    el.innerHTML = `
      <div class="loader-scene">
        <!-- Particle field -->
        <div class="loader-particles" id="loader-particles"></div>

        <!-- Central logo -->
        <div class="loader-core">
          <div class="loader-rings">
            <div class="loader-ring r1"></div>
            <div class="loader-ring r2"></div>
            <div class="loader-ring r3"></div>
          </div>
          <div class="loader-logo">
            <i class="fas fa-infinity"></i>
          </div>
          <div class="loader-glow"></div>
        </div>

        <!-- Brand text -->
        <div class="loader-brand">
          <div class="loader-brand-name">InnoVerse</div>
          <div class="loader-brand-sub">Campus Innovation Ecosystem</div>
        </div>

        <!-- Progress -->
        <div class="loader-progress-wrap">
          <div class="loader-progress-track">
            <div class="loader-progress-fill" id="loader-fill"></div>
            <div class="loader-progress-glow"></div>
          </div>
          <div class="loader-progress-label" id="loader-label">Initialising…</div>
        </div>

        <!-- Bottom tagline -->
        <div class="loader-tagline">Where Ideas Become Startups</div>
      </div>
    `;
    document.body.appendChild(el);
    this._injectStyles();
    this._spawnParticles();
    this._animateProgress();
  },

  _steps: [
    { pct: 15, label: 'Loading AI models…' },
    { pct: 35, label: 'Connecting to network…' },
    { pct: 55, label: 'Preparing your ecosystem…' },
    { pct: 75, label: 'Syncing startup data…' },
    { pct: 90, label: 'Almost ready…' },
    { pct: 100, label: 'Welcome to InnoVerse!' },
  ],

  _animateProgress() {
    let i = 0;
    const fill = document.getElementById('loader-fill');
    const label = document.getElementById('loader-label');
    const run = () => {
      if (i >= this._steps.length) return;
      const step = this._steps[i++];
      if (fill) fill.style.width = step.pct + '%';
      if (label) label.textContent = step.label;
      if (i < this._steps.length) setTimeout(run, 380 + Math.random() * 200);
    };
    setTimeout(run, 200);
  },

  _spawnParticles() {
    const container = document.getElementById('loader-particles');
    if (!container) return;
    // Reduced from 60 to 25 particles, no filter:blur on particles
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'loader-particle';
      const size = 1.5 + Math.random() * 2.5;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        --dur:${4+Math.random()*5}s;
        --delay:${-Math.random()*5}s;
        --tx:${(Math.random()-0.5)*160}px;
        --ty:${(Math.random()-0.5)*160}px;
        opacity:${0.2+Math.random()*0.5};
      `;
      container.appendChild(p);
    }
  },

  hide(delay = 200) {
    setTimeout(() => {
      const el = document.getElementById('iv-loader');
      if (!el) return;
      el.classList.add('loader-exit');
      setTimeout(() => el.remove(), 700);
    }, delay);
  },

  _injectStyles() {
    if (document.getElementById('loader-styles')) return;
    const s = document.createElement('style');
    s.id = 'loader-styles';
    s.textContent = `
#iv-loader {
  position: fixed; inset: 0; z-index: 99999;
  background: #0a0a0f;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.4,0,0.2,1);
}
#iv-loader.loader-exit {
  opacity: 0;
  transform: scale(1.05);
}
.loader-scene {
  display: flex; flex-direction: column; align-items: center; gap: 28px;
  position: relative; z-index: 1;
}

/* Particles */
.loader-particles { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
.loader-particle {
  position: absolute; border-radius: 50%;
  background: rgba(124,58,237,0.7); /* solid color, no radial-gradient per particle */
  animation: particleDrift var(--dur, 5s) var(--delay, 0s) ease-in-out infinite alternate;
  will-change: transform;
}
@keyframes particleDrift {
  from { transform: translate(0,0); }
  to   { transform: translate(var(--tx,50px), var(--ty,50px)); }
}

/* Core */
.loader-core {
  position: relative; width: 120px; height: 120px;
  display: flex; align-items: center; justify-content: center;
}
.loader-rings { position: absolute; inset: 0; }
.loader-ring {
  position: absolute; border-radius: 50%; border: 2px solid transparent;
}
.r1 {
  inset: 0;
  border-top-color: rgba(124,58,237,0.8);
  border-right-color: rgba(124,58,237,0.2);
  animation: spinRing 1.2s linear infinite;
}
.r2 {
  inset: 12px;
  border-top-color: rgba(37,99,235,0.7);
  border-left-color: rgba(37,99,235,0.2);
  animation: spinRing 1.8s linear infinite reverse;
}
.r3 {
  inset: 24px;
  border-top-color: rgba(6,182,212,0.6);
  border-right-color: rgba(6,182,212,0.15);
  animation: spinRing 2.4s linear infinite;
}
@keyframes spinRing { to { transform: rotate(360deg); } }

.loader-logo {
  font-size: 2.2rem; color: #fff; z-index: 2;
  animation: logoPulse 2s ease-in-out infinite;
  background: var(--gradient-primary);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 0 20px rgba(124,58,237,0.8));
}
@keyframes logoPulse {
  0%,100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(124,58,237,0.8)); }
  50%      { transform: scale(1.1); filter: drop-shadow(0 0 40px rgba(124,58,237,1)); }
}
.loader-glow {
  position: absolute; inset: -20px; border-radius: 50%;
  background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
  animation: glowPulse 2s ease-in-out infinite;
}
@keyframes glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

/* Brand */
.loader-brand { text-align: center; }
.loader-brand-name {
  font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, rgba(124,58,237,0.9) 50%, #60a5fa 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: brandShimmer 3s linear infinite;
  letter-spacing: -0.02em;
}
@keyframes brandShimmer {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
.loader-brand-sub {
  font-size: 0.78rem; color: rgba(255,255,255,0.3);
  letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px;
}

/* Progress */
.loader-progress-wrap { width: 280px; text-align: center; }
.loader-progress-track {
  height: 4px; background: rgba(255,255,255,0.06);
  border-radius: 999px; overflow: visible; position: relative; margin-bottom: 10px;
}
.loader-progress-fill {
  height: 100%; width: 0%; border-radius: 999px;
  background: linear-gradient(90deg, #7c3aed, #a855f7, #06b6d4);
  background-size: 200% 100%;
  animation: progressShimmer 1.5s linear infinite;
  transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 0 12px rgba(124,58,237,0.8), 0 0 24px rgba(124,58,237,0.4);
  position: relative;
}
.loader-progress-fill::after {
  content: ''; position: absolute; right: -1px; top: 50%;
  transform: translateY(-50%);
  width: 8px; height: 8px; border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 8px rgba(124,58,237,1), 0 0 16px rgba(124,58,237,0.6);
}
@keyframes progressShimmer {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
.loader-progress-label {
  font-size: 0.75rem; color: rgba(255,255,255,0.4);
  letter-spacing: 0.05em; transition: opacity 0.3s ease;
}

/* Tagline */
.loader-tagline {
  font-size: 0.72rem; color: rgba(255,255,255,0.15);
  letter-spacing: 0.2em; text-transform: uppercase;
  animation: taglineFade 3s ease-in-out infinite;
}
@keyframes taglineFade { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
    `;
    document.head.appendChild(s);
  }
};
