// ===== PROFILE PAGE =====
const ProfilePage = {
  editing: false,

  render() {
    const user = Store.get('currentUser');
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-wrapper">
        <div class="profile-hero">
          <div class="profile-cover"></div>
          <div class="profile-info">
            <div class="profile-avatar-wrap">
              ${Utils.renderAvatar(user?.avatar || 'U', 'xl', user?.name || '')}
              <div class="profile-avatar-edit" onclick="Toast.info('Photo upload coming soon!')">
                <i class="fas fa-camera"></i>
              </div>
            </div>
            <div class="profile-details">
              <h2 style="margin-bottom:4px">${user?.name || 'Your Name'}</h2>
              <p style="font-size:0.9rem;margin-bottom:8px">${user?.university || 'University'}</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <span class="role-pill role-${user?.role || 'maker'}">${user?.role || 'maker'}</span>
                <span class="badge badge-green"><i class="fas fa-check-circle"></i> Active</span>
              </div>
            </div>
            <div class="profile-actions">
              <button class="btn btn-primary btn-sm" onclick="ProfilePage.toggleEdit()">
                <i class="fas fa-edit"></i> Edit Profile
              </button>
              <button class="btn btn-secondary btn-sm" onclick="Toast.success('Profile link copied!')">
                <i class="fas fa-share-alt"></i> Share
              </button>
            </div>
          </div>
        </div>

        <div class="profile-grid">
          <!-- Left: Info -->
          <div class="profile-left">
            <div class="card" style="margin-bottom:20px" id="profile-edit-card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <h3>About</h3>
                <button class="btn btn-ghost btn-sm" onclick="ProfilePage.toggleEdit()">
                  <i class="fas fa-${this.editing?'save':'edit'}"></i> ${this.editing?'Save':'Edit'}
                </button>
              </div>
              ${this.editing ? `
                <div class="form-group">
                  <label class="form-label">Bio</label>
                  <textarea class="form-textarea" id="edit-bio" rows="3" placeholder="Tell us about yourself...">${user?.bio || ''}</textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Skills (comma separated)</label>
                  <input type="text" class="form-input" id="edit-skills" value="${(user?.skills || []).join(', ')}" placeholder="React, Python, ML..."/>
                </div>
                <div class="form-group">
                  <label class="form-label">LinkedIn URL</label>
                  <input type="text" class="form-input" id="edit-linkedin" placeholder="linkedin.com/in/yourname"/>
                </div>
                <div class="form-group">
                  <label class="form-label">GitHub URL</label>
                  <input type="text" class="form-input" id="edit-github" placeholder="github.com/yourname"/>
                </div>
                <button class="btn btn-primary btn-sm" onclick="ProfilePage.saveProfile()">
                  <i class="fas fa-save"></i> Save Changes
                </button>
              ` : `
                <p style="font-size:0.875rem;margin-bottom:16px">${user?.bio || 'No bio yet. Click Edit to add one.'}</p>
                ${(user?.skills || []).length > 0 ? `
                  <div style="margin-bottom:16px">
                    <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:8px">SKILLS</div>
                    <div class="tags-container">${(user?.skills || []).map(s=>`<span class="tag">${s}</span>`).join('')}</div>
                  </div>
                ` : ''}
                <div style="display:flex;gap:12px">
                  <a href="#" class="btn btn-ghost btn-sm"><i class="fab fa-linkedin"></i> LinkedIn</a>
                  <a href="#" class="btn btn-ghost btn-sm"><i class="fab fa-github"></i> GitHub</a>
                </div>
              `}
            </div>

            <!-- Stats Card -->
            <div class="card">
              <h3 style="margin-bottom:16px">Activity Stats</h3>
              <div class="profile-stats">
                ${[
                  { label:'Connections', value: user?.connections || 0, icon:'fa-users', color:'#7c3aed' },
                  { label:'Startups', value: (user?.startups || []).length, icon:'fa-rocket', color:'#10b981' },
                  { label:'Hackathons', value: (user?.hackathons || []).length, icon:'fa-code', color:'#06b6d4' },
                  { label:'Profile Views', value: 142, icon:'fa-eye', color:'#f59e0b' }
                ].map(s=>`
                  <div class="profile-stat-item">
                    <div class="psi-icon" style="background:${s.color}22;color:${s.color}"><i class="fas ${s.icon}"></i></div>
                    <div class="psi-value">${s.value}</div>
                    <div class="psi-label">${s.label}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right: Activity -->
          <div class="profile-right">
            <!-- My Startups -->
            <div class="card" style="margin-bottom:20px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <h3>My Startups</h3>
                <button class="btn btn-primary btn-sm" onclick="App.navigate('maker')"><i class="fas fa-plus"></i> New</button>
              </div>
              ${DB.startups.slice(0,2).map(s=>`
                <div class="profile-startup-item" onclick="App.navigate('maker')">
                  ${Utils.renderAvatar(s.founderAvatar,'sm',s.name)}
                  <div style="flex:1">
                    <div style="font-size:0.875rem;font-weight:600">${s.name}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted)">${s.category} · ${s.stage}</div>
                  </div>
                  <span class="badge ${Utils.stageBadge(s.stage)}">${Utils.fundingProgress(s.raised,s.fundingGoal)}%</span>
                </div>
              `).join('')}
            </div>

            <!-- Hackathons -->
            <div class="card" style="margin-bottom:20px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
                <h3>Hackathons</h3>
                <button class="btn btn-ghost btn-sm" onclick="App.navigate('hackathon')">Browse <i class="fas fa-arrow-right"></i></button>
              </div>
              ${DB.hackathons.slice(0,2).map(h=>`
                <div class="profile-startup-item">
                  <div style="font-size:1.5rem">${h.logo}</div>
                  <div style="flex:1">
                    <div style="font-size:0.875rem;font-weight:600">${h.name}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted)">${h.prize} · ${h.mode}</div>
                  </div>
                  <span class="badge badge-green">Registered</span>
                </div>
              `).join('')}
            </div>

            <!-- Skill Progress -->
            <div class="card" style="margin-bottom:20px">
              <h3 style="margin-bottom:16px">Skill Strength</h3>
              ${[
                { skill:'Technical Skills', pct:85 },
                { skill:'Communication', pct:72 },
                { skill:'Leadership', pct:60 },
                { skill:'Problem Solving', pct:90 }
              ].map(s=>`
                <div style="margin-bottom:14px">
                  <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:6px">
                    <span>${s.skill}</span><span style="color:var(--accent-purple)">${s.pct}%</span>
                  </div>
                  <div class="progress-bar"><div class="progress-fill" style="width:${s.pct}%"></div></div>
                </div>
              `).join('')}
            </div>

            <!-- Face ID Card -->
            <div class="card" id="face-id-profile-card">
              ${ProfilePage.renderFaceIdCard(user)}
            </div>
          </div>
        </div>
      </div>
    `;
    this.injectStyles();
  },

  toggleEdit() {
    this.editing = !this.editing;
    this.render();
  },

  renderFaceIdCard(user) {
    const hasface = FaceID.hasDescriptor(user?.id);
    return `
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
        <div style="width:44px;height:44px;border-radius:var(--radius-md);background:${hasface?'rgba(16,185,129,0.15)':'rgba(124,58,237,0.15)'};display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:${hasface?'var(--accent-green)':'var(--accent-purple)'}">
          <i class="fas fa-${hasface?'check-circle':'id-badge'}"></i>
        </div>
        <div style="flex:1">
          <h3 style="font-size:1rem;margin-bottom:2px">Face ID</h3>
          <p style="font-size:0.8rem;margin:0">${hasface?'Face ID is set up and active':'Not configured yet'}</p>
        </div>
        <span class="badge ${hasface?'badge-green':'badge-orange'}">${hasface?'Active':'Off'}</span>
      </div>
      <p style="font-size:0.82rem;margin-bottom:16px">
        ${hasface
          ? 'Your face is registered. You can sign in instantly without a password.'
          : 'Set up Face ID to sign in instantly using your camera — no password needed.'}
      </p>
      <div style="display:flex;gap:10px">
        ${hasface ? `
          <button class="btn btn-secondary btn-sm" onclick="ProfilePage.setupFaceId()">
            <i class="fas fa-sync-alt"></i> Re-register Face
          </button>
          <button class="btn btn-danger btn-sm" onclick="ProfilePage.removeFaceId()">
            <i class="fas fa-trash"></i> Remove
          </button>
        ` : `
          <button class="btn btn-primary btn-sm" onclick="ProfilePage.setupFaceId()">
            <i class="fas fa-camera"></i> Set Up Face ID
          </button>
        `}
      </div>
    `;
  },

  setupFaceId() {
    const user = Store.get('currentUser');
    // Show face registration inside a modal
    Modal.open(`
      <div id="face-reg-modal-content">
        <h3 class="modal-title">Set Up Face ID</h3>
        <p class="modal-subtitle">Register your face for instant sign-in</p>
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
        <div class="fid-instructions" style="margin:12px 0">
          <div class="fid-inst-item"><i class="fas fa-sun"></i><span>Good lighting</span></div>
          <div class="fid-inst-item"><i class="fas fa-eye"></i><span>Look at camera</span></div>
          <div class="fid-inst-item"><i class="fas fa-user"></i><span>Face centered</span></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:8px">
          <button class="btn btn-primary" style="flex:1;justify-content:center" id="fid-capture-btn"
            onclick="ProfilePage.doCaptureFace(${user?.id})">
            <i class="fas fa-camera"></i> Capture Face
          </button>
          <button class="btn btn-secondary" onclick="FaceID.stopCamera();Modal.close()">Cancel</button>
        </div>
      </div>
    `);
    // Init camera after modal renders
    setTimeout(() => AuthPage._initCamera('fid-model-status', 'fid-status-bar'), 100);
  },

  async doCaptureFace(userId) {
    const btn = document.getElementById('fid-capture-btn');
    const statusEl = document.getElementById('fid-status-bar');
    const video = document.getElementById('fid-video');
    const canvas = document.getElementById('fid-canvas');
    if (!video || !FaceID.modelsLoaded) { Toast.warning('Models still loading…'); return; }
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Capturing…'; }
    document.getElementById('scan-ring')?.classList.add('scanning');

    const descriptor = await FaceID.captureDescriptor(video, canvas, statusEl);

    document.getElementById('scan-ring')?.classList.remove('scanning');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-camera"></i> Capture Face'; }

    if (descriptor) {
      FaceID.saveDescriptor(userId, descriptor);
      FaceID.stopCamera();
      Modal.close();
      Toast.success('Face ID registered successfully!');
      // Refresh the face id card
      const card = document.getElementById('face-id-profile-card');
      if (card) card.innerHTML = this.renderFaceIdCard(Store.get('currentUser'));
    }
  },

  removeFaceId() {
    Modal.confirm('Remove Face ID', 'This will delete your stored face data. You can re-register anytime.', () => {
      const user = Store.get('currentUser');
      const all = FaceID.getAllDescriptors();
      delete all[user?.id];
      localStorage.setItem(FaceID.STORAGE_KEY, JSON.stringify(all));
      Toast.success('Face ID removed.');
      const card = document.getElementById('face-id-profile-card');
      if (card) card.innerHTML = this.renderFaceIdCard(user);
    }, true);
  },

  saveProfile() {
    const user = Store.get('currentUser');
    const bio = document.getElementById('edit-bio')?.value || '';
    const skills = document.getElementById('edit-skills')?.value?.split(',').map(s=>s.trim()).filter(Boolean) || [];
    const updated = { ...user, bio, skills };
    Store.login(updated);
    this.editing = false;
    this.render();
    Toast.success('Profile updated!');
  },

  injectStyles() {
    if (document.getElementById('profile-styles')) return;
    const s = document.createElement('style');
    s.id = 'profile-styles';
    s.textContent = `
.profile-hero { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-xl); overflow:hidden; margin-bottom:24px; }
.profile-cover { height:120px; background:var(--gradient-primary); opacity:0.6; }
.profile-info { display:flex; align-items:flex-end; gap:20px; padding:0 24px 24px; flex-wrap:wrap; }
.profile-avatar-wrap { position:relative; margin-top:-40px; }
.profile-avatar-edit {
  position:absolute; bottom:0; right:0; width:28px; height:28px;
  background:var(--bg-card); border:2px solid var(--border); border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:0.7rem; cursor:pointer; color:var(--text-muted);
}
.profile-details { flex:1; padding-top:8px; }
.profile-actions { display:flex; gap:8px; margin-left:auto; align-self:flex-end; }
.profile-grid { display:grid; grid-template-columns:320px 1fr; gap:24px; }
.profile-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.profile-stat-item { text-align:center; padding:16px; background:var(--bg-secondary); border-radius:var(--radius-md); }
.psi-icon { width:36px; height:36px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; margin:0 auto 8px; }
.psi-value { font-size:1.4rem; font-weight:800; font-family:'Space Grotesk',sans-serif; }
.psi-label { font-size:0.72rem; color:var(--text-muted); margin-top:2px; }
.profile-startup-item { display:flex; align-items:center; gap:12px; padding:10px; background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-md); margin-bottom:8px; cursor:pointer; transition:var(--transition); }
.profile-startup-item:hover { border-color:var(--border-hover); }
@media(max-width:900px) { .profile-grid { grid-template-columns:1fr; } }
    `;
    document.head.appendChild(s);
  }
};
