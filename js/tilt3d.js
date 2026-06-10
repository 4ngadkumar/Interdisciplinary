// ===== 3D TILT ENGINE + CURSOR GLOW (PERFORMANCE-OPTIMISED) =====
const Tilt3D = {
  MAX_TILT: 8,
  PERSPECTIVE: 900,
  SCALE: 1.02,
  _raf: null,

  init() {
    // Attach once on load
    this.attach();

    // Re-attach on navigation — debounced so it doesn't fire 100x per render
    const observer = new MutationObserver(this._debounce(() => this.attach(), 300));
    // Watch only direct children of main-content, not the whole body subtree
    const main = document.getElementById('main-content');
    if (main) observer.observe(main, { childList: true, subtree: false });
    // Also watch app-shell for initial render
    const shell = document.getElementById('app-shell');
    if (shell) observer.observe(shell, { childList: true, subtree: false });
  },

  attach() {
    const sel = [
      '.inv-startup-card','.startup-card','.resume-card','.person-card',
      '.hack-card','.role-feature-card','.feature-card','.stat-card',
      '.investor-card','.dash-startup-card','.quick-action-card',
      '.floating-card','.card-3d','[data-tilt]'
    ].join(',');

    document.querySelectorAll(sel).forEach(el => {
      if (el._tilt) return;
      el._tilt = true;
      this._bind(el);
    });
  },

  _bind(el) {
    const self = this;
    let active = false;

    el.addEventListener('mouseenter', () => {
      // Only add will-change when actually hovering (not on all cards at once)
      el.style.willChange = 'transform';
      active = true;
    });

    el.addEventListener('mousemove', function(e) {
      if (!active) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
      const tX = -dy * self.MAX_TILT;
      const tY =  dx * self.MAX_TILT;
      el.style.transition = 'transform 0.08s ease';
      el.style.transform  = `perspective(${self.PERSPECTIVE}px) rotateX(${tX}deg) rotateY(${tY}deg) scale3d(${self.SCALE},${self.SCALE},${self.SCALE})`;
    });

    el.addEventListener('mouseleave', function() {
      active = false;
      el.style.transition = 'transform 0.45s cubic-bezier(0.23,1,0.32,1)';
      el.style.transform  = '';
      // Remove will-change after transition ends to free GPU layer
      setTimeout(() => { el.style.willChange = 'auto'; }, 500);
    });
  },

  _debounce(fn, delay) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  }
};

// ===== CURSOR GLOW — throttled with requestAnimationFrame =====
const CursorGlow = {
  _x: 0, _y: 0, _pending: false,

  init() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    document.addEventListener('mousemove', e => {
      this._x = e.clientX;
      this._y = e.clientY;
      if (!this._pending) {
        this._pending = true;
        requestAnimationFrame(() => {
          glow.style.left = this._x + 'px';
          glow.style.top  = this._y + 'px';
          this._pending = false;
        });
      }
    }, { passive: true });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Tilt3D.init();
  CursorGlow.init();
});
