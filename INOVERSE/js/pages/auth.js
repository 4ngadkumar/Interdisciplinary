// ===== AUTH PAGE (with real Face ID) =====
const AuthPage = {
  mode: 'login',
  faceMode: false,   // true = showing face-id panel
  faceStep: null,    // 'register-face' | 'login-face'

  show(mode = 'login') {
    this.mode = mode;
    this.faceMode = false;
    const overlay = document.getElementById('auth-modal');
    overlay.classList.remove('hidden');
    overlay.innerHTML = `
      <div class="auth-box" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="AuthPage.closeAll()"><i class="fas fa-times"></i></button>
        <div class="auth-logo">
          <div class="logo-icon"><i class="fas fa-infinity"></i></div>
          <span>InnoVerse</span>
        </div>
        <div id="auth-content"></div>
      </div>
    `;
    overlay.onclick = () => this.closeAll();
    this.renderContent();
    this.injectStyles();
  },

  closeAll() {
    FaceID.stopCamera();
    document.getElementById('auth-modal').classList.add('hidden');
  },

  hide() { this.closeAll(); },

  // ── RENDER LOGIN / REGISTER FORMS ────────────────────────────────────────
  renderContent() {
    const el = document.getElementById('auth-content');
    if (this.mode === 'login') {
      el.innerHTML = `
        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-subtitle">Sign in to your InnoVerse account</p>

        <!-- Face ID Login Button (prominent) -->
        <button class="btn-face-id" onclick="AuthPage.showFaceLogin()">
          <div class="fid-btn-icon">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" stroke-width="3" fill="none"/>
              <rect x="48" y="2" width="14" height="14" rx="3" stroke="currentColor" stroke-width="3" fill="none"/>
              <rect x="2" y="48" width="14" height="14" rx="3" stroke="currentColor" stroke-width="3" fill="none"/>
              <rect x="48" y="48" width="14" height="14" rx="3" stroke="currentColor" stroke-width="3" fill="none"/>
              <circle cx="32" cy="26" r="7" stroke="currentColor" stroke-width="2.5" fill="none"/>
              <path d="M22 46c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <circle cx="24" cy="24" r="2" fill="currentColor"/>
              <circle cx="40" cy="24" r="2" fill="currentColor"/>
            </svg>
          </div>
          <div class="fid-btn-text">
            <span>Sign in with Face ID</span>
            <small>Instant · Secure · No password needed</small>
          </div>
          <i class="fas fa-chevron-right fid-btn-arrow"></i>
        </button>

        <div class="divider-text" style="margin:20px 0">or use password</div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <div class="input-group">
            <i class="fas fa-envelope input-icon"></i>
            <input type="email" class="form-input" id="login-email" placeholder="you@university.edu" value="demo@innoverse.in"/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-group">
            <i class="fas fa-lock input-icon"></i>
            <input type="password" class="form-input" id="login-pass" placeholder="••••••••" value="demo123"/>
          </div>
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px" onclick="AuthPage.login()">
          <i class="fas fa-sign-in-alt"></i> Sign In
        </button>
        <div class="divider-text" style="margin:16px 0">or</div>
        <button class="btn btn-secondary" style="width:100%;justify-content:center" onclick="AuthPage.demoLogin()">
          <i class="fas fa-play"></i> Try Demo Account
        </button>
        <p class="auth-switch">Don't have an account? <a onclick="AuthPage.show('register')">Sign up</a></p>
      `;
    } else {
      el.innerHTML = `
        <h2 class="auth-title">Join InnoVerse</h2>
        <p class="auth-subtitle">Create your account and start innovating</p>
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <div class="input-group">
            <i class="fas fa-user input-icon"></i>
            <input type="text" class="form-input" id="reg-name" placeholder="Your full name"/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <div class="input-group">
            <i class="fas fa-envelope input-icon"></i>
            <input type="email" class="form-input" id="reg-email" placeholder="you@university.edu"/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">University</label>
          <div class="input-group">
            <i class="fas fa-university input-icon"></i>
            <input type="text" class="form-input" id="reg-uni" placeholder="IIT Delhi, BITS Pilani..."/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">I am a...</label>
          <div class="role-selector">
            <div class="role-opt" data-role="maker" onclick="AuthPage.selectRole('maker')">
              <i class="fas fa-rocket"></i><span>Maker</span><small>Student / Founder</small>
            </div>
            <div class="role-opt" data-role="investor" onclick="AuthPage.selectRole('investor')">
              <i class="fas fa-chart-line"></i><span>Investor</span><small>VC / Angel</small>
            </div>
            <div class="role-opt" data-role="recruiter" onclick="AuthPage.selectRole('recruiter')">
              <i class="fas fa-users"></i><span>Recruiter</span><small>Startup / Company</small>
            </div>
          </div>
          <input type="hidden" id="reg-role" value="maker"/>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-group">
            <i class="fas fa-lock input-icon"></i>
            <input type="password" class="form-input" id="reg-pass" placeholder="Min 8 characters"/>
          </div>
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px" onclick="AuthPage.register()">
          <i class="fas fa-user-plus"></i> Create Account
        </button>
        <p style="font-size:0.75rem;color:var(--text-muted);text-align:center;margin-top:12px">
          By creating an account you agree to our
          <a onclick="AuthPage.closeAll();App.navigate('terms')" style="color:var(--accent-purple);cursor:pointer;font-weight:600">Terms & Conditions</a>
        </p>
        <p class="auth-switch">Already have an account? <a onclick="AuthPage.show('login')">Sign in</a></p>
      `;
      setTimeout(() => this.selectRole('maker'), 50);
    }
  },

  // ── FACE ID LOGIN FLOW ───────────────────────────────────────────────────
  showFaceLogin() {
    const el = document.getElementById('auth-content');
    el.innerHTML = `
      <button class="btn btn-ghost btn-sm" style="margin-bottom:16px" onclick="AuthPage.renderContent()">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <h2 class="auth-title">Face ID Sign In</h2>
      <p class="auth-subtitle">Look at the camera to authenticate</p>

      <div class="face-scanner-wrap">
        <div class="face-scanner-frame" id="face-frame">
          <video id="fid-video" autoplay muted playsinline class="fid-video"></video>
          <canvas id="fid-canvas" class="fid-canvas"></canvas>
          <div class="face-scan-ring" id="scan-ring"></div>
          <div class="face-scan-corners">
            <span class="fsc tl"></span><span class="fsc tr"></span>
            <span class="fsc bl"></span><span class="fsc br"></span>
          </div>
        </div>
        <div id="fid-status-bar" class="fid-status-bar"></div>
        <div id="fid-model-status"></div>
      </div>

      <div id="fid-action-area" style="margin-top:16px">
        <button class="btn btn-primary" style="width:100%;justify-content:center" id="fid-scan-btn" onclick="AuthPage.runFaceLogin()">
          <i class="fas fa-camera"></i> Scan My Face
        </button>
      </div>

      <div class="divider-text" style="margin:16px 0">or</div>
      <button class="btn btn-secondary" style="width:100%;justify-content:center" onclick="AuthPage.demoLogin()">
        <i class="fas fa-play"></i> Use Demo Account
      </button>
    `;
    this.faceStep = 'login-face';
    this._initCamera('fid-model-status', 'fid-status-bar');
  },

  async runFaceLogin() {
    const btn = document.getElementById('fid-scan-btn');
    const statusEl = document.getElementById('fid-status-bar');
    const video = document.getElementById('fid-video');
    const canvas = document.getElementById('fid-canvas');
    if (!video || !FaceID.modelsLoaded) {
      Toast.warning('Models still loading, please wait…'); return;
    }
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Scanning…'; }
    document.getElementById('scan-ring')?.classList.add('scanning');

    const result = await FaceID.matchFace(video, canvas, statusEl);

    document.getElementById('scan-ring')?.classList.remove('scanning');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-camera"></i> Scan My Face'; }

    if (result.matched) {
      // Find user by stored face userId
      const user = DB.users.find(u => String(u.id) === String(result.userId)) || DB.users[0];
      FaceID.stopCamera();
      Store.login(user);
      this.closeAll();
      App.showApp();
      Toast.success(`✅ Face ID verified! Welcome back, ${user.name}!`);
    } else {
      // Shake animation
      document.querySelector('.face-scanner-frame')?.classList.add('shake');
      setTimeout(() => document.querySelector('.face-scanner-frame')?.classList.remove('shake'), 600);
      Toast.error('Face not recognized. Try again or use password.');
    }
  },

  // ── FACE ID REGISTER FLOW ────────────────────────────────────────────────
  showFaceRegister(userId, userName) {
    const el = document.getElementById('auth-content');
    el.innerHTML = `
      <h2 class="auth-title">Set Up Face ID</h2>
      <p class="auth-subtitle">Register your face for instant sign-in next time</p>

      <div class="face-scanner-wrap">
        <div class="face-scanner-frame" id="face-frame">
          <video id="fid-video" autoplay muted playsinline class="fid-video"></video>
          <canvas id="fid-canvas" class="fid-canvas"></canvas>
          <div class="face-scan-ring" id="scan-ring"></div>
          <div class="face-scan-corners">
            <span class="fsc tl"></span><span class="fsc tr"></span>
            <span class="fsc bl"></span><span class="fsc br"></span>
          </div>
        </div>
        <div id="fid-status-bar" class="fid-status-bar"></div>
        <div id="fid-model-status"></div>
      </div>

      <div class="fid-instructions">
        <div class="fid-inst-item"><i class="fas fa-sun"></i><span>Good lighting on your face</span></div>
        <div class="fid-inst-item"><i class="fas fa-eye"></i><span>Look directly at the camera</span></div>
        <div class="fid-inst-item"><i class="fas fa-user"></i><span>Keep face centered in frame</span></div>
      </div>

      <div style="display:flex;gap:10px;margin-top:16px">
        <button class="btn btn-primary" style="flex:1;justify-content:center" id="fid-capture-btn"
          onclick="AuthPage.captureFaceRegister(${userId}, '${userName}')">
          <i class="fas fa-camera"></i> Capture Face
        </button>
        <button class="btn btn-ghost" onclick="AuthPage.skipFaceRegister()">
          Skip for now
        </button>
      </div>
    `;
    this.faceStep = 'register-face';
    this._initCamera('fid-model-status', 'fid-status-bar');
  },

  async captureFaceRegister(userId, userName) {
    const btn = document.getElementById('fid-capture-btn');
    const statusEl = document.getElementById('fid-status-bar');
    const video = document.getElementById('fid-video');
    const canvas = document.getElementById('fid-canvas');
    if (!video || !FaceID.modelsLoaded) {
      Toast.warning('Models still loading, please wait…'); return;
    }
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Capturing…'; }
    document.getElementById('scan-ring')?.classList.add('scanning');

    const descriptor = await FaceID.captureDescriptor(video, canvas, statusEl);

    document.getElementById('scan-ring')?.classList.remove('scanning');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-camera"></i> Capture Face'; }

    if (descriptor) {
      FaceID.saveDescriptor(userId, descriptor);
      FaceID.stopCamera();
      this.closeAll();
      App.showApp();
      Toast.success(`🎉 Face ID registered for ${userName}! You can now sign in with your face.`);
    } else {
      document.querySelector('.face-scanner-frame')?.classList.add('shake');
      setTimeout(() => document.querySelector('.face-scanner-frame')?.classList.remove('shake'), 600);
    }
  },

  skipFaceRegister() {
    FaceID.stopCamera();
    this.closeAll();
    App.showApp();
    Toast.info('Face ID skipped. You can set it up later in Profile settings.');
  },

  // ── SHARED: init camera + models ─────────────────────────────────────────
  async _initCamera(modelStatusId, camStatusId) {
    const modelEl = document.getElementById(modelStatusId);
    const camEl = document.getElementById(camStatusId);
    const video = document.getElementById('fid-video');
    const canvas = document.getElementById('fid-canvas');

    // Start camera and load models in parallel
    const [camOk, modelsOk] = await Promise.all([
      FaceID.startCamera(video, camEl),
      FaceID.loadModels(modelEl)
    ]);

    if (camOk && modelsOk) {
      // Start live detection loop (draws face box continuously)
      FaceID.startLiveDetection(
        video, canvas,
        () => { document.getElementById('scan-ring')?.classList.add('face-detected'); },
        () => { document.getElementById('scan-ring')?.classList.remove('face-detected'); }
      );
    }
  },

  // ── STANDARD AUTH ────────────────────────────────────────────────────────
  selectRole(role) {
    document.querySelectorAll('.role-opt').forEach(el => el.classList.remove('selected'));
    const el = document.querySelector(`.role-opt[data-role="${role}"]`);
    if (el) el.classList.add('selected');
    const input = document.getElementById('reg-role');
    if (input) input.value = role;
  },

  login() {
    const email = document.getElementById('login-email')?.value;
    const pass = document.getElementById('login-pass')?.value;
    if (!email || !pass) { Toast.error('Please fill all fields'); return; }
    const user = DB.users[0];
    Store.login(user);
    this.closeAll();
    App.showApp();
    Toast.success(`Welcome back, ${user.name}!`);
  },

  demoLogin() {
    const user = DB.users[0];
    Store.login(user);
    this.closeAll();
    App.showApp();
    Toast.success('Demo account loaded!');
  },

  register() {
    const name = document.getElementById('reg-name')?.value?.trim();
    const email = document.getElementById('reg-email')?.value?.trim();
    const uni = document.getElementById('reg-uni')?.value?.trim();
    const role = document.getElementById('reg-role')?.value;
    const pass = document.getElementById('reg-pass')?.value;

    if (!name || !email || !uni || !pass) { Toast.error('Please fill all fields'); return; }
    if (pass.length < 8) { Toast.error('Password must be at least 8 characters'); return; }

    // ── Step 1: Gesture CAPTCHA before creating account ──
    GestureCaptcha.show(
      () => {
        // CAPTCHA passed — create account
        const user = {
          id: Date.now(), name, email, university: uni, role,
          avatar: Utils.getInitials(name), bio: '', skills: [],
          connections: 0, startups: [], resumes: [], hackathons: []
        };
        DB.users.push(user);
        Store.login(user);
        Toast.success('Human verified! ✅ Account created.');
        // Step 2: Offer Face ID setup
        AuthPage.showFaceRegister(user.id, user.name);
      },
      () => { Toast.error('Verification failed. Please try again.'); }
    );
  },

  // ── STYLES ───────────────────────────────────────────────────────────────
  injectStyles() {
    if (document.getElementById('auth-styles')) return;
    const s = document.createElement('style');
    s.id = 'auth-styles';
    s.textContent = `
/* Auth box */
.auth-box {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-xl); padding: 40px; width: 100%;
  max-width: 480px; position: relative;
  animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  max-height: 92vh; overflow-y: auto;
}
.auth-logo {
  display: flex; align-items: center; gap: 10px; margin-bottom: 24px;
  font-family: 'Space Grotesk',sans-serif; font-weight: 700; font-size: 1.1rem;
}
.auth-title { font-size: 1.6rem; margin-bottom: 6px; }
.auth-subtitle { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 24px; }
.auth-switch { text-align: center; font-size: 0.85rem; color: var(--text-muted); margin-top: 20px; }
.auth-switch a { color: var(--accent-purple); cursor: pointer; font-weight: 600; }
.role-selector { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 8px; }
.role-opt {
  border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 12px 8px; text-align: center; cursor: pointer; transition: var(--transition);
  background: var(--bg-secondary);
}
.role-opt:hover { border-color: var(--accent-purple); }
.role-opt.selected { border-color: var(--accent-purple); background: rgba(124,58,237,0.1); }
.role-opt i { display: block; font-size: 1.2rem; margin-bottom: 6px; color: var(--accent-purple); }
.role-opt span { display: block; font-size: 0.8rem; font-weight: 600; }
.role-opt small { display: block; font-size: 0.68rem; color: var(--text-muted); margin-top: 2px; }

/* ── Face ID Button ── */
.btn-face-id {
  width: 100%; display: flex; align-items: center; gap: 16px;
  padding: 16px 20px; border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.12));
  border: 1.5px solid rgba(124,58,237,0.35);
  cursor: pointer; transition: var(--transition); color: var(--text-primary);
  font-family: 'Inter', sans-serif;
}
.btn-face-id:hover {
  background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.2));
  border-color: rgba(124,58,237,0.6);
  box-shadow: 0 0 24px rgba(124,58,237,0.25);
  transform: translateY(-1px);
}
.fid-btn-icon {
  width: 48px; height: 48px; border-radius: var(--radius-md);
  background: var(--gradient-primary); display: flex; align-items: center;
  justify-content: center; flex-shrink: 0; color: #fff; padding: 10px;
}
.fid-btn-icon svg { width: 100%; height: 100%; }
.fid-btn-text { flex: 1; text-align: left; }
.fid-btn-text span { display: block; font-weight: 700; font-size: 0.95rem; }
.fid-btn-text small { display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
.fid-btn-arrow { color: var(--text-muted); font-size: 0.8rem; }

/* ── Face Scanner ── */
.face-scanner-wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.face-scanner-frame {
  position: relative; width: 280px; height: 210px;
  border-radius: var(--radius-lg); overflow: hidden;
  background: #000; border: 2px solid var(--border);
  transition: border-color 0.3s;
}
.face-scanner-frame.shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97);
  border-color: var(--accent-red) !important;
}
@keyframes shake {
  10%,90%{transform:translateX(-2px)}
  20%,80%{transform:translateX(4px)}
  30%,50%,70%{transform:translateX(-6px)}
  40%,60%{transform:translateX(6px)}
}
.fid-video {
  width: 100%; height: 100%; object-fit: cover;
  transform: scaleX(-1); /* mirror */
  display: block;
}
.fid-canvas {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  transform: scaleX(-1); pointer-events: none;
}

/* Scan ring overlay */
.face-scan-ring {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 120px; height: 140px;
  border-radius: 50%;
  border: 2px solid rgba(124,58,237,0.4);
  transition: border-color 0.3s, box-shadow 0.3s;
  pointer-events: none;
}
.face-scan-ring.face-detected {
  border-color: var(--accent-green);
  box-shadow: 0 0 20px rgba(16,185,129,0.4);
}
.face-scan-ring.scanning {
  border-color: var(--accent-purple);
  box-shadow: 0 0 20px rgba(124,58,237,0.5);
  animation: scanPulse 1s ease-in-out infinite;
}
@keyframes scanPulse {
  0%,100% { box-shadow: 0 0 10px rgba(124,58,237,0.4); }
  50% { box-shadow: 0 0 30px rgba(124,58,237,0.8); }
}

/* Corner brackets */
.face-scan-corners { position: absolute; inset: 0; pointer-events: none; }
.fsc {
  position: absolute; width: 20px; height: 20px;
  border-color: var(--accent-purple); border-style: solid;
}
.fsc.tl { top: 10px; left: 10px; border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
.fsc.tr { top: 10px; right: 10px; border-width: 3px 3px 0 0; border-radius: 0 4px 0 0; }
.fsc.bl { bottom: 10px; left: 10px; border-width: 0 0 3px 3px; border-radius: 0 0 0 4px; }
.fsc.br { bottom: 10px; right: 10px; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }

/* Scan line animation */
.face-scan-ring.scanning::after {
  content: ''; position: absolute; left: -10px; right: -10px; height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-purple), transparent);
  top: 0; animation: scanLine 1.5s linear infinite;
}
@keyframes scanLine {
  0% { top: 0; opacity: 1; }
  100% { top: 140px; opacity: 0; }
}

/* Status bar */
.fid-status-bar {
  min-height: 28px; text-align: center; font-size: 0.82rem;
}
.fid-status {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 14px; border-radius: var(--radius-full);
}
.fid-status.loading { background: rgba(124,58,237,0.1); color: var(--accent-purple-light); }
.fid-status.ok { background: rgba(16,185,129,0.1); color: var(--accent-green); }
.fid-status.error { background: rgba(239,68,68,0.1); color: var(--accent-red); }

/* Instructions */
.fid-instructions {
  display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
  margin-top: 8px;
}
.fid-inst-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.78rem; color: var(--text-muted);
}
.fid-inst-item i { color: var(--accent-purple); }
    `;
    document.head.appendChild(s);
  }
};
