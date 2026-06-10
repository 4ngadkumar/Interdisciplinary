// ===== HAND GESTURE CAPTCHA — "Are you a bot?" =====
const GestureCaptcha = {
  hands: null, camera: null, stream: null,
  videoEl: null, canvasEl: null,
  targetGesture: null, onSuccess: null,
  consecutiveFrames: 0, isRunning: false,
  REQUIRED_FRAMES: 15, // ~0.75s at 20fps

  GESTURES: {
    OPEN_PALM: { label: 'Open Palm',  emoji: '🖐️', hint: 'Spread all five fingers open' },
    THUMBS_UP: { label: 'Thumbs Up',  emoji: '👍', hint: 'Curl fingers, extend thumb up' },
    PEACE:     { label: 'Peace Sign', emoji: '✌️', hint: 'Extend index and middle fingers' },
    FIST:      { label: 'Fist',       emoji: '✊', hint: 'Curl all fingers into a fist' },
    POINT_UP:  { label: 'Point Up',   emoji: '☝️', hint: 'Extend only your index finger' },
  },

  pickRandom() {
    const keys = Object.keys(this.GESTURES);
    return keys[Math.floor(Math.random() * keys.length)];
  },

  async init(videoEl, canvasEl) {
    this.videoEl = videoEl; this.canvasEl = canvasEl;
    if (!window.Hands) return false;

    this.hands = new Hands({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
    this.hands.setOptions({ maxNumHands: 1, modelComplexity: 0, minDetectionConfidence: 0.7, minTrackingConfidence: 0.55 });
    this.hands.onResults(r => this._onResults(r));

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } });
      videoEl.srcObject = this.stream;
      await new Promise(r => { videoEl.onloadedmetadata = r; });
      videoEl.play();
    } catch { return false; }

    if (window.Camera) {
      this.camera = new Camera(videoEl, {
        onFrame: async () => { if (this.isRunning) await this.hands.send({ image: videoEl }); },
        width: 320, height: 240
      });
      this.camera.start();
    } else {
      this._loop = setInterval(async () => {
        if (this.isRunning && videoEl.readyState >= 2) await this.hands.send({ image: videoEl });
      }, 50);
    }
    this.isRunning = true;
    return true;
  },

  _onResults(results) {
    const ctx = this.canvasEl?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);

    if (!results.multiHandLandmarks?.length) {
      this.consecutiveFrames = 0;
      this._setStatus('none', 'Show your hand to the camera');
      this._setProgress(0);
      return;
    }

    const lm = results.multiHandLandmarks[0];
    this._drawHand(ctx, lm);
    const detected = this._classify(lm);

    if (detected === this.targetGesture) {
      this.consecutiveFrames++;
      this._setProgress(this.consecutiveFrames / this.REQUIRED_FRAMES);
      const g = this.GESTURES[detected];
      this._setStatus('match', `${g.emoji} ${g.label} — hold it!`);
      if (this.consecutiveFrames >= this.REQUIRED_FRAMES) {
        this.isRunning = false;
        this._setProgress(1);
        this._setStatus('success', '✅ Verified! You are human.');
        setTimeout(() => { this.stop(); this._closeModal(); if (this.onSuccess) this.onSuccess(); }, 700);
      }
    } else {
      this.consecutiveFrames = Math.max(0, this.consecutiveFrames - 2);
      this._setProgress(this.consecutiveFrames / this.REQUIRED_FRAMES);
      if (detected) {
        const g = this.GESTURES[detected];
        this._setStatus('wrong', `${g.emoji} ${g.label} detected — wrong gesture`);
      } else {
        this._setStatus('none', 'Hand detected — perform the gesture');
      }
    }
  },

  _drawHand(ctx, lm) {
    const W = this.canvasEl.width, H = this.canvasEl.height;
    const CONN = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17]];
    ctx.save(); ctx.scale(-1,1); ctx.translate(-W,0);
    ctx.strokeStyle = 'rgba(124,58,237,0.75)'; ctx.lineWidth = 2;
    CONN.forEach(([a,b]) => {
      ctx.beginPath();
      ctx.moveTo(lm[a].x*W, lm[a].y*H);
      ctx.lineTo(lm[b].x*W, lm[b].y*H);
      ctx.stroke();
    });
    lm.forEach((p,i) => {
      const tip = [4,8,12,16,20].includes(i);
      ctx.beginPath(); ctx.arc(p.x*W, p.y*H, tip?6:3.5, 0, Math.PI*2);
      ctx.fillStyle = tip ? '#a855f7' : 'rgba(124,58,237,0.85)';
      ctx.fill();
      if (tip) { ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1.5; ctx.stroke(); }
    });
    ctx.restore();
  },

  _classify(lm) {
    const ext = (tip, pip) => lm[tip].y < lm[pip].y - 0.03;
    const thumbOut = lm[4].x < lm[3].x - 0.04;
    const i = ext(8,6), m = ext(12,10), r = ext(16,14), p = ext(20,18);
    if (!i && !m && !r && !p && thumbOut) return 'THUMBS_UP';
    if (!i && !m && !r && !p) return 'FIST';
    if (i && m && r && p) return 'OPEN_PALM';
    if (i && m && !r && !p) return 'PEACE';
    if (i && !m && !r && !p) return 'POINT_UP';
    return null;
  },

  _setStatus(type, msg) {
    const el = document.getElementById('gc-status');
    if (!el) return;
    const colors = { none:'rgba(255,255,255,0.3)', match:'#10b981', wrong:'#f59e0b', success:'#10b981' };
    el.style.color = colors[type] || colors.none;
    el.textContent = msg;
  },

  _setProgress(pct) {
    const bar = document.getElementById('gc-bar');
    const ring = document.getElementById('gc-ring');
    if (bar) bar.style.width = Math.min(pct*100,100) + '%';
    if (ring) ring.style.background = `conic-gradient(var(--theme-accent,#7c3aed) ${Math.min(pct,1)*360}deg, rgba(255,255,255,0.06) 0deg)`;
  },

  stop() {
    this.isRunning = false;
    if (this.camera) { try { this.camera.stop(); } catch(e){} this.camera = null; }
    if (this._loop) { clearInterval(this._loop); this._loop = null; }
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
    if (this.videoEl) this.videoEl.srcObject = null;
    this.consecutiveFrames = 0;
  },

  _closeModal() {
    const m = document.getElementById('global-modal');
    if (m) { m.classList.add('hidden'); m.innerHTML = ''; }
  },

  // ── Show CAPTCHA ──────────────────────────────────────────────────────────
  show(onSuccess, onFail) {
    this.onSuccess = onSuccess; this.onFail = onFail;
    this.targetGesture = this.pickRandom();
    const g = this.GESTURES[this.targetGesture];

    const overlay = document.getElementById('global-modal');
    overlay.classList.remove('hidden');
    overlay.innerHTML = `
      <div class="gc-modal" onclick="event.stopPropagation()">

        <!-- Header -->
        <div class="gc-header">
          <div class="gc-header-icon"><i class="fas fa-shield-alt"></i></div>
          <div class="gc-header-text">
            <h3>Human Verification</h3>
            <p>Perform the gesture shown below to continue</p>
          </div>
          <button class="gc-close-btn" onclick="GestureCaptcha._skipCaptcha()" title="Skip">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Challenge -->
        <div class="gc-challenge">
          <div class="gc-challenge-label">PERFORM THIS GESTURE</div>
          <div class="gc-target" id="gc-target">
            <div class="gc-emoji" id="gc-emoji">${g.emoji}</div>
            <div class="gc-gesture-name">${g.label}</div>
            <div class="gc-gesture-hint">${g.hint}</div>
          </div>
        </div>

        <!-- Camera -->
        <div class="gc-camera-section">
          <div class="gc-camera-frame" id="gc-frame">
            <video id="gesture-video" autoplay muted playsinline class="gc-video"></video>
            <canvas id="gesture-canvas" class="gc-canvas" width="320" height="240"></canvas>

            <!-- Progress ring overlay -->
            <div class="gc-ring-wrap">
              <div class="gc-ring" id="gc-ring"></div>
              <div class="gc-ring-inner">
                <span id="gc-ring-emoji">${g.emoji}</span>
              </div>
            </div>

            <!-- Corner brackets -->
            <span class="gc-corner tl"></span><span class="gc-corner tr"></span>
            <span class="gc-corner bl"></span><span class="gc-corner br"></span>

            <!-- Scan line -->
            <div class="gc-scanline"></div>
          </div>

          <!-- Status -->
          <div id="gc-status" class="gc-status">Initialising camera…</div>

          <!-- Progress bar -->
          <div class="gc-progress-track">
            <div class="gc-progress-fill" id="gc-bar"></div>
          </div>
          <div class="gc-progress-label">Hold the gesture until the bar fills</div>
        </div>

        <!-- Footer -->
        <div class="gc-footer">
          <button class="gc-btn-ghost" onclick="GestureCaptcha._tryDifferent()">
            <i class="fas fa-shuffle"></i> Different gesture
          </button>
          <button class="gc-btn-ghost" onclick="GestureCaptcha._skipCaptcha()">
            Skip for demo
          </button>
        </div>
      </div>`;

    setTimeout(() => {
      const v = document.getElementById('gesture-video');
      const c = document.getElementById('gesture-canvas');
      this.init(v, c).then(ok => {
        if (!ok) this._setStatus('none', '⚠️ Camera unavailable — click Skip');
      });
    }, 80);

    this._styles();
  },

  _tryDifferent() {
    this.stop();
    this.targetGesture = this.pickRandom();
    const g = this.GESTURES[this.targetGesture];
    const t = document.getElementById('gc-target');
    if (t) t.innerHTML = `<div class="gc-emoji">${g.emoji}</div><div class="gc-gesture-name">${g.label}</div><div class="gc-gesture-hint">${g.hint}</div>`;
    const re = document.getElementById('gc-ring-emoji');
    if (re) re.textContent = g.emoji;
    this.consecutiveFrames = 0; this._setProgress(0);
    this._setStatus('none', 'Show your hand to the camera');
    const v = document.getElementById('gesture-video');
    const c = document.getElementById('gesture-canvas');
    this.isRunning = true;
    this.init(v, c);
  },

  _skipCaptcha() {
    this.stop(); this._closeModal();
    if (this.onSuccess) this.onSuccess();
  },

  _styles() {
    if (document.getElementById('gc-styles')) return;
    const s = document.createElement('style');
    s.id = 'gc-styles';
    s.textContent = `
.gc-modal{
  background:linear-gradient(160deg,#16161f,#111118);
  border:1px solid rgba(124,58,237,0.25); border-radius:22px;
  padding:28px; width:100%; max-width:460px;
  animation:modalIn .35s cubic-bezier(.34,1.56,.64,1);
  box-shadow:0 40px 80px rgba(0,0,0,.7),0 0 60px rgba(124,58,237,.12),inset 0 1px 0 rgba(255,255,255,.07);
  font-family:'Inter',sans-serif;
}
.gc-header{display:flex;align-items:center;gap:14px;margin-bottom:22px}
.gc-header-icon{width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,#7c3aed,#4f46e5);display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#fff;flex-shrink:0;box-shadow:0 6px 20px rgba(124,58,237,.4)}
.gc-header-text{flex:1}
.gc-header-text h3{font-size:1.05rem;font-weight:700;color:#f1f5f9;margin-bottom:3px}
.gc-header-text p{font-size:.78rem;color:rgba(255,255,255,.35)}
.gc-close-btn{width:30px;height:30px;border-radius:8px;border:none;background:rgba(255,255,255,.07);color:rgba(255,255,255,.4);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.8rem;transition:all .2s}
.gc-close-btn:hover{background:rgba(255,255,255,.14);color:#fff}

.gc-challenge{background:rgba(124,58,237,.07);border:1px solid rgba(124,58,237,.18);border-radius:14px;padding:18px;margin-bottom:18px;text-align:center}
.gc-challenge-label{font-size:.65rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:rgba(124,58,237,.9);margin-bottom:12px}
.gc-target{display:flex;flex-direction:column;align-items:center;gap:5px}
.gc-emoji{font-size:3rem;line-height:1;animation:gcFloat 2s ease-in-out infinite;filter:drop-shadow(0 6px 14px rgba(124,58,237,.4))}
@keyframes gcFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.gc-gesture-name{font-size:1rem;font-weight:700;color:#f1f5f9}
.gc-gesture-hint{font-size:.78rem;color:rgba(255,255,255,.35)}

.gc-camera-section{display:flex;flex-direction:column;align-items:center;gap:10px}
.gc-camera-frame{position:relative;width:320px;height:240px;border-radius:14px;overflow:hidden;background:#000;border:1.5px solid rgba(124,58,237,.3);box-shadow:0 16px 40px rgba(0,0,0,.6),0 0 24px rgba(124,58,237,.1)}
.gc-video{width:100%;height:100%;object-fit:cover;transform:scaleX(-1);display:block}
.gc-canvas{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}

.gc-ring-wrap{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:76px;height:76px;pointer-events:none}
.gc-ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(#7c3aed 0deg,rgba(255,255,255,.05) 0deg);transition:background .08s linear}
.gc-ring::before{content:'';position:absolute;inset:7px;border-radius:50%;background:rgba(0,0,0,.55);backdrop-filter:blur(3px)}
.gc-ring-inner{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.7rem;z-index:1}

.gc-corner{position:absolute;width:16px;height:16px;border-color:rgba(124,58,237,.9);border-style:solid}
.gc-corner.tl{top:8px;left:8px;border-width:2.5px 0 0 2.5px;border-radius:3px 0 0 0}
.gc-corner.tr{top:8px;right:8px;border-width:2.5px 2.5px 0 0;border-radius:0 3px 0 0}
.gc-corner.bl{bottom:8px;left:8px;border-width:0 0 2.5px 2.5px;border-radius:0 0 0 3px}
.gc-corner.br{bottom:8px;right:8px;border-width:0 2.5px 2.5px 0;border-radius:0 0 3px 0}

.gc-scanline{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(124,58,237,.6),transparent);animation:gcScan 2.5s linear infinite;top:0}
@keyframes gcScan{0%{top:0;opacity:1}100%{top:100%;opacity:0}}

.gc-status{font-size:.8rem;font-weight:500;min-height:22px;text-align:center;transition:color .3s}
.gc-progress-track{width:320px;height:5px;background:rgba(255,255,255,.07);border-radius:999px;overflow:hidden}
.gc-progress-fill{height:100%;width:0%;border-radius:999px;background:linear-gradient(90deg,#7c3aed,#a855f7,#06b6d4);background-size:200% 100%;animation:gcShimmer 1.5s linear infinite;box-shadow:0 0 8px rgba(124,58,237,.6);transition:width .1s linear}
@keyframes gcShimmer{0%{background-position:0% 50%}100%{background-position:200% 50%}}
.gc-progress-label{font-size:.68rem;color:rgba(255,255,255,.25)}

.gc-footer{display:flex;justify-content:space-between;align-items:center;margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.07)}
.gc-btn-ghost{background:none;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:6px 14px;font-size:.75rem;color:rgba(255,255,255,.4);cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif;display:flex;align-items:center;gap:6px}
.gc-btn-ghost:hover{border-color:rgba(124,58,237,.4);color:#a78bfa;background:rgba(124,58,237,.08)}
    `;
    document.head.appendChild(s);
  }
};
