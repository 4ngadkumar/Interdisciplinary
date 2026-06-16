// ===== NOVA AI AGENT — Google Gemini 1.5 Flash =====
const AIAgent = {
  API_KEY : 'AIzaSyCUqaLq_pbLDU363lLr0YfDpyZRc8IEq1k',
  API_URL : 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',

  SYSTEM: `You are Nova, the professional AI assistant for InnoVerse — India's AI-powered campus innovation platform.
Platform features: Maker Hub (startup registration with AI duplicate detection, resume upload with AI scoring 0-100 and recruiter matching), Investor Zone (AI-matched startups and talent pool), Hackathon Portal (discover hackathons, AI teammate matching), Campus Network (connect by skill/university), Face ID (on-device TensorFlow.js), Hand Gesture CAPTCHA (MediaPipe), Terms & Conditions (1% annual profit share for platform-facilitated commercial activities, Section 7; exempt under ₹5L/year).
Navigation: Dashboard | Maker Hub | Investor Zone | Hackathon Portal | Campus Network | My Profile | Terms & Conditions.
Rules: Be concise (under 100 words unless asked for detail). Use **bold** for key terms. Friendly but professional tone. Always offer to help further.`,

  isOpen: false, isTyping: false,
  messages: [], history: [],

  async callGemini(text) {
    const contents = [...this.history, { role:'user', parts:[{text}] }];
    const res = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        systemInstruction: { parts:[{text: this.SYSTEM}] },
        contents,
        generationConfig: { temperature:0.7, maxOutputTokens:256, topP:0.9 },
        safetySettings:[
          {category:'HARM_CATEGORY_HARASSMENT',        threshold:'BLOCK_ONLY_HIGH'},
          {category:'HARM_CATEGORY_HATE_SPEECH',       threshold:'BLOCK_ONLY_HIGH'},
          {category:'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold:'BLOCK_ONLY_HIGH'},
          {category:'HARM_CATEGORY_DANGEROUS_CONTENT', threshold:'BLOCK_ONLY_HIGH'}
        ]
      }),
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e?.error?.message||`HTTP ${res.status}`); }
    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) throw new Error('Empty response');
    this.history.push({role:'user',parts:[{text}]});
    this.history.push({role:'model',parts:[{text:reply}]});
    if (this.history.length > 20) this.history = this.history.slice(-20);
    return reply;
  },

  fallback(t) {
    t = t.toLowerCase();
    if (/startup|idea|register/.test(t))  return "Head to **Maker Hub → Register Startup**. AI checks for duplicate ideas automatically! 🚀";
    if (/resume|cv|upload/.test(t))       return "Go to **Maker Hub → Upload Resume**. AI scores it 0–100 and matches you to recruiters. 📄";
    if (/investor|fund|invest/.test(t))   return "Check **Investor Zone** for AI-matched investors. Complete your startup profile first! 💰";
    if (/hackathon|hack|compet/.test(t))  return "Browse **Hackathon Portal** for open competitions with AI teammate matching! ⚡";
    if (/face|biometric/.test(t))         return "Set up **Face ID** in Profile settings — runs on-device, nothing sent to servers. 🔐";
    if (/gesture|captcha|robot/.test(t))  return "Our **Hand Gesture CAPTCHA** uses MediaPipe — show a thumbs up or peace sign to verify! ✌️";
    if (/terms|legal|1%|revenue/.test(t)) return "See **Terms & Conditions** in the sidebar. Section 7 covers the 1% annual profit share. ⚖️";
    if (/network|connect|people/.test(t)) return "Use **Campus Network** to connect with students and founders. Filter by skill or university! 🌐";
    if (/hello|hi|hey/.test(t))           return "Hey! 👋 I'm **Nova**, your InnoVerse AI assistant. Ask me anything about the platform!";
    return "I'm having a brief connection issue. Please try again in a moment, or explore the sidebar! 🔄";
  },

  md(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,     '<em>$1</em>')
      .replace(/`(.*?)`/g,       '<code class="na-code">$1</code>')
      .replace(/\n/g,            '<br>');
  },

  push(role, text) {
    this.messages.push({role, text, time: new Date()});
    this._render();
  },

  _render() {
    const box = document.getElementById('na-messages');
    if (!box) return;
    box.innerHTML = this.messages.map(m => `
      <div class="na-msg na-${m.role}">
        ${m.role==='bot' ? '<div class="na-av"><i class="fas fa-infinity"></i></div>' : ''}
        <div class="na-bubble">
          <div class="na-text">${this.md(m.text)}</div>
          <div class="na-time">${m.time.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
        </div>
      </div>`).join('');
    box.scrollTop = box.scrollHeight;
  },

  _typing(show) {
    if (show) {
      const box = document.getElementById('na-messages');
      if (!box) return;
      const el = document.createElement('div');
      el.id = 'na-typing'; el.className = 'na-msg na-bot';
      el.innerHTML = '<div class="na-av"><i class="fas fa-infinity"></i></div><div class="na-bubble"><div class="na-dots"><span></span><span></span><span></span></div></div>';
      box.appendChild(el); box.scrollTop = box.scrollHeight;
    } else {
      document.getElementById('na-typing')?.remove();
    }
  },

  async send() {
    const inp = document.getElementById('na-input');
    if (!inp) return;
    const text = inp.value.trim();
    if (!text || this.isTyping) return;
    inp.value = ''; inp.style.height = 'auto';
    this.push('user', text);
    this.isTyping = true; this._typing(true);
    const btn = document.getElementById('na-send');
    if (btn) btn.innerHTML = '<span class="na-spin"></span>';
    try {
      const reply = await this.callGemini(text);
      this._typing(false); this.push('bot', reply);
    } catch(e) {
      console.warn('Gemini:', e.message);
      this._typing(false); this.push('bot', this.fallback(text));
    } finally {
      this.isTyping = false;
      if (btn) btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
      document.getElementById('na-input')?.focus();
    }
  },

  chip(t) { const i = document.getElementById('na-input'); if(i) i.value=t; this.send(); },

  clear() {
    this.messages=[]; this.history=[]; this._render();
    setTimeout(()=>this.push('bot',"Chat cleared! I'm **Nova** — ask me anything. 😊"),150);
  },

  key(e) { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();AIAgent.send();} },

  toggle() {
    this.isOpen = !this.isOpen;
    const win = document.getElementById('na-window');
    const fab = document.getElementById('na-fab');
    const notif = document.getElementById('na-notif');
    if (!win||!fab) return;
    if (this.isOpen) {
      win.classList.replace('na-hidden','na-visible');
      fab.classList.add('na-open');
      if (notif) notif.style.display='none';
      if (this.messages.length===0) setTimeout(()=>this.push('bot',
        "Hi! I'm **Nova** ✨ — your InnoVerse AI assistant powered by **Gemini 1.5 Flash**.\n\nAsk me anything about startups, investors, hackathons, resumes, or the platform!"),250);
      setTimeout(()=>document.getElementById('na-input')?.focus(),350);
    } else {
      win.classList.replace('na-visible','na-hidden');
      fab.classList.remove('na-open');
    }
  },

  mount() {
    if (document.getElementById('na-fab')) return;
    const root = document.createElement('div');
    root.id = 'na-root';
    root.innerHTML = `
      <button id="na-fab" class="na-fab" onclick="AIAgent.toggle()" title="Chat with Nova AI">
        <div class="na-fab-ring r1"></div>
        <div class="na-fab-ring r2"></div>
        <div class="na-fab-body">
          <i class="fas fa-infinity na-fab-icon"></i>
          <i class="fas fa-times na-fab-close"></i>
        </div>
        <span class="na-fab-label">Nova AI</span>
        <span id="na-notif" class="na-notif">1</span>
      </button>

      <div id="na-window" class="na-window na-hidden">
        <div class="na-head">
          <div class="na-head-left">
            <div class="na-head-av">
              <i class="fas fa-infinity"></i>
              <span class="na-online-dot"></span>
            </div>
            <div>
              <div class="na-head-name">Nova <span class="na-badge">Gemini</span></div>
              <div class="na-head-sub"><span class="na-green-dot"></span>Always available</div>
            </div>
          </div>
          <div class="na-head-actions">
            <button class="na-icon-btn" onclick="AIAgent.clear()" title="Clear chat"><i class="fas fa-rotate-left"></i></button>
            <button class="na-icon-btn" onclick="AIAgent.toggle()" title="Close"><i class="fas fa-times"></i></button>
          </div>
        </div>

        <div id="na-messages" class="na-messages"></div>

        <div class="na-chips">
          <button class="na-chip" onclick="AIAgent.chip('How do I register a startup?')">🚀 Register startup</button>
          <button class="na-chip" onclick="AIAgent.chip('How does AI matching work?')">🧠 AI matching</button>
          <button class="na-chip" onclick="AIAgent.chip('Tell me about hackathons')">⚡ Hackathons</button>
          <button class="na-chip" onclick="AIAgent.chip('How do I upload my resume?')">📄 Resume</button>
          <button class="na-chip" onclick="AIAgent.chip('What is the 1% revenue share?')">⚖️ Revenue share</button>
        </div>

        <div class="na-input-row">
          <textarea id="na-input" class="na-input" placeholder="Ask Nova anything…" rows="1"
            onkeydown="AIAgent.key(event)"
            oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,96)+'px'"></textarea>
          <button id="na-send" class="na-send-btn" onclick="AIAgent.send()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>

        <div class="na-footer">
          <i class="fab fa-google" style="color:#4285f4;font-size:.65rem"></i>
          Gemini 1.5 Flash &nbsp;·&nbsp; InnoVerse AI
        </div>
      </div>`;

    document.body.appendChild(root);
    this._styles();
    setTimeout(()=>{ const n=document.getElementById('na-notif'); if(n) n.classList.add('na-notif-show'); },3000);
  },

  _styles() {
    if (document.getElementById('na-styles')) return;
    const s = document.createElement('style');
    s.id = 'na-styles';
    const css = [
      '#na-root{position:fixed;bottom:28px;right:28px;z-index:9999;font-family:"Inter",sans-serif}',

      /* FAB */
      '.na-fab{position:relative;width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;animation:naFloat 3.5s ease-in-out infinite;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}',
      '@keyframes naFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}',
      '.na-fab:hover{animation:none;transform:scale(1.1) translateY(-4px)}',
      '.na-open{animation:none!important;transform:scale(.92)!important}',
      '.na-fab-ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(var(--theme-accent-rgb,124,58,237),.35);animation:naRing 2.2s ease-out infinite}',
      '.r2{inset:-9px;border-color:rgba(var(--theme-accent-rgb,124,58,237),.15);animation-delay:.7s}',
      '@keyframes naRing{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.55);opacity:0}}',
      '.na-fab-body{width:58px;height:58px;border-radius:50%;position:relative;z-index:1;background:var(--gradient-primary,linear-gradient(135deg,#7c3aed,#2563eb));display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(124,58,237,.5),inset 0 1px 0 rgba(255,255,255,.2)}',
      '.na-fab-icon,.na-fab-close{position:absolute;font-size:1.25rem;color:#fff;transition:opacity .25s,transform .25s}',
      '.na-fab-close{opacity:0;transform:rotate(-90deg);font-size:1.05rem}',
      '.na-open .na-fab-icon{opacity:0;transform:rotate(90deg)}',
      '.na-open .na-fab-close{opacity:1;transform:rotate(0)}',
      '.na-fab-label{position:absolute;bottom:-19px;left:50%;transform:translateX(-50%);font-size:.6rem;font-weight:700;color:var(--theme-accent-light,#a855f7);white-space:nowrap;letter-spacing:.06em}',
      '.na-notif{display:none;position:absolute;top:-2px;right:-2px;width:17px;height:17px;border-radius:50%;background:#ef4444;color:#fff;font-size:.58rem;font-weight:800;align-items:center;justify-content:center;border:2px solid #0a0a0f}',
      '.na-notif-show{display:flex!important;animation:naPop .4s cubic-bezier(.34,1.56,.64,1)}',
      '@keyframes naPop{from{transform:scale(0)}to{transform:scale(1)}}',

      /* Window */
      '.na-window{position:absolute;bottom:74px;right:0;width:370px;border-radius:20px;background:linear-gradient(160deg,#16161f 0%,#111118 100%);border:1px solid rgba(255,255,255,.07);box-shadow:0 40px 80px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.04),inset 0 1px 0 rgba(255,255,255,.07),0 0 60px rgba(124,58,237,.08);display:flex;flex-direction:column;overflow:hidden;transform-origin:bottom right}',
      '.na-hidden{opacity:0;transform:scale(.82) translateY(22px);pointer-events:none;transition:opacity .2s,transform .28s cubic-bezier(.34,1.56,.64,1)}',
      '.na-visible{opacity:1;transform:scale(1) translateY(0);pointer-events:all;transition:opacity .2s,transform .3s cubic-bezier(.34,1.56,.64,1)}',

      /* Header */
      '.na-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:linear-gradient(135deg,rgba(124,58,237,.14),rgba(37,99,235,.08));border-bottom:1px solid rgba(255,255,255,.06);position:relative;overflow:hidden}',
      '.na-head::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(124,58,237,.05),transparent);animation:naShimmer 5s linear infinite}',
      '@keyframes naShimmer{from{transform:translateX(-100%)}to{transform:translateX(100%)}}',
      '.na-head-left{display:flex;align-items:center;gap:11px}',
      '.na-head-av{width:38px;height:38px;border-radius:50%;background:var(--gradient-primary,linear-gradient(135deg,#7c3aed,#2563eb));display:flex;align-items:center;justify-content:center;font-size:.9rem;color:#fff;position:relative;box-shadow:0 4px 14px rgba(124,58,237,.45);flex-shrink:0}',
      '.na-online-dot{position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;background:#10b981;border:2px solid #16161f;animation:naPulse 2s ease-in-out infinite}',
      '@keyframes naPulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.4)}50%{box-shadow:0 0 0 4px rgba(16,185,129,0)}}',
      '.na-head-name{font-size:.88rem;font-weight:700;color:#f1f5f9;display:flex;align-items:center;gap:6px}',
      '.na-badge{font-size:.56rem;font-weight:800;padding:2px 7px;border-radius:5px;background:linear-gradient(135deg,#4285f4,#34a853);color:#fff;letter-spacing:.06em;text-transform:uppercase}',
      '.na-head-sub{font-size:.68rem;color:rgba(255,255,255,.3);display:flex;align-items:center;gap:5px;margin-top:2px}',
      '.na-green-dot{width:5px;height:5px;border-radius:50%;background:#10b981}',
      '.na-head-actions{display:flex;gap:4px}',
      '.na-icon-btn{width:28px;height:28px;border-radius:8px;border:none;background:rgba(255,255,255,.06);color:rgba(255,255,255,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.7rem;transition:all .2s}',
      '.na-icon-btn:hover{background:rgba(255,255,255,.12);color:#fff}',

      /* Messages */
      '.na-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;min-height:260px;max-height:320px;scrollbar-width:thin;scrollbar-color:rgba(124,58,237,.25) transparent}',
      '.na-msg{display:flex;align-items:flex-end;gap:8px}',
      '.na-user{flex-direction:row-reverse}',
      '.na-av{width:26px;height:26px;border-radius:50%;flex-shrink:0;background:var(--gradient-primary,linear-gradient(135deg,#7c3aed,#2563eb));display:flex;align-items:center;justify-content:center;font-size:.62rem;color:#fff;box-shadow:0 2px 8px rgba(124,58,237,.35)}',
      '.na-bubble{max-width:80%;padding:9px 13px;border-radius:16px;animation:naBubble .28s cubic-bezier(.34,1.56,.64,1)}',
      '@keyframes naBubble{from{opacity:0;transform:scale(.8) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}',
      '.na-bot .na-bubble{background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.16);border-bottom-left-radius:4px}',
      '.na-user .na-bubble{background:var(--gradient-primary,linear-gradient(135deg,#7c3aed,#4f46e5));border-bottom-right-radius:4px;box-shadow:0 4px 14px rgba(124,58,237,.3)}',
      '.na-text{font-size:.8rem;line-height:1.65;color:#f1f5f9}',
      '.na-text strong{color:var(--theme-accent-light,#c4b5fd)}',
      '.na-text em{color:#93c5fd}',
      '.na-code{background:rgba(124,58,237,.15);padding:1px 5px;border-radius:4px;font-size:.77em;font-family:monospace}',
      '.na-time{font-size:.58rem;color:rgba(255,255,255,.2);margin-top:4px;text-align:right}',
      '.na-dots{display:flex;gap:4px;padding:3px 0}',
      '.na-dots span{width:7px;height:7px;border-radius:50%;background:var(--theme-accent-light,#a855f7);animation:naDot 1.2s ease-in-out infinite}',
      '.na-dots span:nth-child(2){animation-delay:.2s}',
      '.na-dots span:nth-child(3){animation-delay:.4s}',
      '@keyframes naDot{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-7px);opacity:1}}',

      /* Chips */
      '.na-chips{display:flex;flex-wrap:wrap;gap:5px;padding:8px 12px;border-top:1px solid rgba(255,255,255,.05)}',
      '.na-chip{padding:4px 11px;border-radius:999px;font-size:.69rem;font-weight:500;background:rgba(124,58,237,.08);border:1px solid rgba(124,58,237,.2);color:var(--theme-accent-light,#a78bfa);cursor:pointer;transition:all .2s;font-family:"Inter",sans-serif;white-space:nowrap}',
      '.na-chip:hover{background:rgba(124,58,237,.18);border-color:rgba(124,58,237,.45);transform:translateY(-2px);color:#c4b5fd}',

      /* Input */
      '.na-input-row{display:flex;align-items:flex-end;gap:8px;padding:10px 12px;border-top:1px solid rgba(255,255,255,.05);background:rgba(0,0,0,.2)}',
      '.na-input{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:9px 13px;color:#f1f5f9;font-size:.8rem;font-family:"Inter",sans-serif;resize:none;outline:none;min-height:38px;max-height:96px;line-height:1.5;transition:border-color .2s,box-shadow .2s}',
      '.na-input:focus{border-color:rgba(124,58,237,.5);box-shadow:0 0 0 3px rgba(124,58,237,.1)}',
      '.na-input::placeholder{color:rgba(255,255,255,.18)}',
      '.na-send-btn{width:38px;height:38px;border-radius:11px;flex-shrink:0;background:var(--gradient-primary,linear-gradient(135deg,#7c3aed,#4f46e5));border:none;cursor:pointer;color:#fff;font-size:.8rem;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(124,58,237,.4);transition:transform .2s,box-shadow .2s}',
      '.na-send-btn:hover{transform:translateY(-2px) scale(1.06);box-shadow:0 8px 22px rgba(124,58,237,.5)}',
      '.na-send-btn:active{transform:scale(.93)}',
      '.na-spin{width:13px;height:13px;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:naSpin .7s linear infinite;display:inline-block}',
      '@keyframes naSpin{to{transform:rotate(360deg)}}',

      /* Footer */
      '.na-footer{text-align:center;font-size:.58rem;color:rgba(255,255,255,.18);padding:5px;border-top:1px solid rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;gap:5px}'
    ];
    s.textContent = css.join('\n');
    document.head.appendChild(s);
  }
};
