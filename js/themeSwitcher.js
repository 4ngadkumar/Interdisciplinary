// ===== THEME SWITCHER =====
const ThemeSwitcher = {
  STORAGE_KEY: 'innoverse_theme',

  THEMES: {
    purple: {
      name: 'Cosmic Purple', swatch: '#7c3aed',
      '--theme-accent':       '#7c3aed',
      '--theme-accent-light': '#a855f7',
      '--theme-accent-2':     '#2563eb',
      '--gradient-primary':   'linear-gradient(135deg,#7c3aed,#2563eb)',
      '--gradient-maker':     'linear-gradient(135deg,#7c3aed,#ec4899)',
    },
    blue: {
      name: 'Ocean Blue', swatch: '#0ea5e9',
      '--theme-accent':       '#0ea5e9',
      '--theme-accent-light': '#38bdf8',
      '--theme-accent-2':     '#6366f1',
      '--gradient-primary':   'linear-gradient(135deg,#0ea5e9,#6366f1)',
      '--gradient-maker':     'linear-gradient(135deg,#0ea5e9,#ec4899)',
    },
    green: {
      name: 'Neon Green', swatch: '#10b981',
      '--theme-accent':       '#10b981',
      '--theme-accent-light': '#34d399',
      '--theme-accent-2':     '#0891b2',
      '--gradient-primary':   'linear-gradient(135deg,#10b981,#0891b2)',
      '--gradient-maker':     'linear-gradient(135deg,#10b981,#7c3aed)',
    },
    orange: {
      name: 'Solar Orange', swatch: '#f59e0b',
      '--theme-accent':       '#f59e0b',
      '--theme-accent-light': '#fbbf24',
      '--theme-accent-2':     '#ef4444',
      '--gradient-primary':   'linear-gradient(135deg,#f59e0b,#ef4444)',
      '--gradient-maker':     'linear-gradient(135deg,#f59e0b,#ec4899)',
    },
    pink: {
      name: 'Rose Pink', swatch: '#ec4899',
      '--theme-accent':       '#ec4899',
      '--theme-accent-light': '#f472b6',
      '--theme-accent-2':     '#8b5cf6',
      '--gradient-primary':   'linear-gradient(135deg,#ec4899,#8b5cf6)',
      '--gradient-maker':     'linear-gradient(135deg,#ec4899,#f59e0b)',
    },
    cyan: {
      name: 'Arctic Cyan', swatch: '#06b6d4',
      '--theme-accent':       '#06b6d4',
      '--theme-accent-light': '#22d3ee',
      '--theme-accent-2':     '#7c3aed',
      '--gradient-primary':   'linear-gradient(135deg,#06b6d4,#7c3aed)',
      '--gradient-maker':     'linear-gradient(135deg,#06b6d4,#10b981)',
    },
  },

  current: 'purple',

  apply(themeKey) {
    const theme = this.THEMES[themeKey];
    if (!theme) return;
    this.current = themeKey;
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) => {
      if (k.startsWith('--')) root.style.setProperty(k, v);
    });
    // Also set --accent-purple aliases so existing code still works
    root.style.setProperty('--accent-purple',       theme['--theme-accent']);
    root.style.setProperty('--accent-purple-light', theme['--theme-accent-light']);
    root.style.setProperty('--accent-blue',         theme['--theme-accent-2']);
    root.style.setProperty('--shadow-glow-purple',  `0 0 40px ${theme['--theme-accent']}4d`);
    localStorage.setItem(this.STORAGE_KEY, themeKey);
    this._updateUI();
  },

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY) || 'purple';
    this.apply(saved);
    this._mount();
  },

  _mount() {
    if (document.getElementById('theme-switcher')) return;
    const el = document.createElement('div');
    el.id = 'theme-switcher';
    el.innerHTML = `
      <button id="theme-toggle-btn" class="ts-toggle" onclick="ThemeSwitcher._togglePanel()" title="Change theme">
        <i class="fas fa-palette"></i>
      </button>
      <div id="theme-panel" class="ts-panel ts-hidden">
        <div class="ts-panel-header">
          <span><i class="fas fa-palette"></i> Theme</span>
          <button class="ts-close" onclick="ThemeSwitcher._togglePanel()"><i class="fas fa-times"></i></button>
        </div>
        <div class="ts-swatches" id="ts-swatches">
          ${Object.entries(this.THEMES).map(([key, t]) => `
            <button class="ts-swatch ${key === this.current ? 'ts-active' : ''}"
              data-key="${key}"
              style="background:${t.swatch}"
              onclick="ThemeSwitcher.apply('${key}')"
              title="${t.name}">
              ${key === this.current ? '<i class="fas fa-check"></i>' : ''}
            </button>
          `).join('')}
        </div>
        <div class="ts-name" id="ts-name">${this.THEMES[this.current].name}</div>
      </div>
    `;
    document.body.appendChild(el);
    this._injectStyles();
  },

  _togglePanel() {
    const panel = document.getElementById('theme-panel');
    if (!panel) return;
    panel.classList.toggle('ts-hidden');
  },

  _updateUI() {
    const swatches = document.getElementById('ts-swatches');
    const nameEl = document.getElementById('ts-name');
    if (swatches) {
      swatches.querySelectorAll('.ts-swatch').forEach(btn => {
        const active = btn.dataset.key === this.current;
        btn.classList.toggle('ts-active', active);
        btn.innerHTML = active ? '<i class="fas fa-check"></i>' : '';
      });
    }
    if (nameEl) nameEl.textContent = this.THEMES[this.current].name;
  },

  _injectStyles() {
    if (document.getElementById('ts-styles')) return;
    const s = document.createElement('style');
    s.id = 'ts-styles';
    s.textContent = `
#theme-switcher{position:fixed;bottom:110px;right:28px;z-index:8999;font-family:'Inter',sans-serif}
.ts-toggle{
  width:44px;height:44px;border-radius:50%;border:none;cursor:pointer;
  background:var(--bg-card);border:1px solid rgba(255,255,255,.1);
  color:var(--theme-accent,#7c3aed);font-size:1rem;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 16px rgba(0,0,0,.4);
  transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s;
}
.ts-toggle:hover{transform:scale(1.12) rotate(15deg);box-shadow:0 8px 24px rgba(0,0,0,.5)}
.ts-panel{
  position:absolute;bottom:54px;right:0;
  background:linear-gradient(160deg,#16161f,#111118);
  border:1px solid rgba(255,255,255,.09);border-radius:16px;
  padding:16px;width:200px;
  box-shadow:0 20px 50px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.06);
  transition:opacity .2s,transform .25s cubic-bezier(.34,1.56,.64,1);
  transform-origin:bottom right;
}
.ts-hidden{opacity:0;transform:scale(.85) translateY(10px);pointer-events:none}
.ts-panel-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;font-size:.8rem;font-weight:600;color:rgba(255,255,255,.6)}
.ts-close{background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer;font-size:.75rem;padding:2px}
.ts-close:hover{color:#fff}
.ts-swatches{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.ts-swatch{
  width:32px;height:32px;border-radius:50%;border:2px solid transparent;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  font-size:.65rem;color:#fff;transition:transform .2s,border-color .2s;
}
.ts-swatch:hover{transform:scale(1.15)}
.ts-active{border-color:#fff!important;box-shadow:0 0 0 3px rgba(255,255,255,.2)}
.ts-name{font-size:.72rem;color:rgba(255,255,255,.35);text-align:center}
    `;
    document.head.appendChild(s);
  }
};
