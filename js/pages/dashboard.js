// ===== DASHBOARD PAGE =====
const DashboardPage = {
  render() {
    const user = Store.get('currentUser');
    const main = document.getElementById('main-content');

    main.innerHTML = `
      <div class="page-wrapper">
        <!-- Header -->
        <div class="dash-header">
          <div>
            <h2>Good morning, ${user?.name?.split(' ')[0] || 'Innovator'} 👋</h2>
            <p>Here's what's happening in your innovation ecosystem today.</p>
          </div>
          <div class="dash-header-actions">
            <button class="btn btn-secondary btn-sm"><i class="fas fa-bell"></i> Notifications <span class="notif-dot"></span></button>
            <button class="btn btn-primary btn-sm" onclick="App.navigate('maker')"><i class="fas fa-plus"></i> New Startup</button>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="grid-4" style="margin-bottom:28px">
          ${[
            { icon: 'fa-rocket', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)', label: 'Startups', value: DB.startups.length, sub: '+2 this week' },
            { icon: 'fa-file-alt', color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'Resumes', value: DB.resumes.length, sub: 'AI scored' },
            { icon: 'fa-code', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', label: 'Hackathons', value: DB.hackathons.length, sub: '2 open now' },
            { icon: 'fa-users', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Network', value: '2,400+', sub: 'Active students' }
          ].map(s => `
            <div class="stat-card card-hover-lift">
              <div class="stat-icon" style="background:${s.bg};color:${s.color}">
                <i class="fas ${s.icon}"></i>
              </div>
              <div>
                <div class="stat-value">${s.value}</div>
                <div class="stat-label">${s.label}</div>
                <div style="font-size:0.72rem;color:var(--accent-green);margin-top:2px">${s.sub}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Main Grid -->
        <div class="dash-main-grid">
          <!-- Featured Startups -->
          <div class="dash-section">
            <div class="dash-section-header">
              <h3>🚀 Featured Startups</h3>
              <button class="btn btn-ghost btn-sm" onclick="App.navigate('investor')">View All <i class="fas fa-arrow-right"></i></button>
            </div>
            <div class="dash-startups">
              ${DB.startups.filter(s => s.featured).map(s => `
                <div class="dash-startup-card card-hover-lift" onclick="App.navigate('investor')">
                  <div class="dsc-header">
                    <div class="dsc-avatar">${Utils.renderAvatar(s.founderAvatar, 'md', s.name)}</div>
                    <div class="dsc-info">
                      <div class="dsc-name">${s.name} ${s.verified ? '<i class="fas fa-check-circle" style="color:var(--accent-blue);font-size:0.75rem"></i>' : ''}</div>
                      <div class="dsc-tagline">${s.tagline}</div>
                    </div>
                    <span class="badge ${Utils.stageBadge(s.stage)}">${s.stage}</span>
                  </div>
                  <div class="dsc-tags">
                    ${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                  </div>
                  <div class="dsc-funding">
                    <div class="dsc-funding-label">
                      <span>Funding Progress</span>
                      <span style="color:var(--accent-green);font-weight:600">${Utils.fundingProgress(s.raised, s.fundingGoal)}%</span>
                    </div>
                    <div class="progress-bar"><div class="progress-fill" style="width:${Utils.fundingProgress(s.raised, s.fundingGoal)}%"></div></div>
                    <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-muted);margin-top:6px">
                      <span>${Utils.formatCurrency(s.raised)} raised</span>
                      <span>Goal: ${Utils.formatCurrency(s.fundingGoal)}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right Column -->
          <div class="dash-right">
            <!-- Upcoming Hackathons -->
            <div class="dash-section" style="margin-bottom:20px">
              <div class="dash-section-header">
                <h3>⚡ Live Hackathons</h3>
                <button class="btn btn-ghost btn-sm" onclick="App.navigate('hackathon')">All <i class="fas fa-arrow-right"></i></button>
              </div>
              ${DB.hackathons.filter(h => h.status === 'open' || h.status === 'closing-soon').map(h => `
                <div class="dash-hack-card" onclick="App.navigate('hackathon')">
                  <div class="dhc-logo">${h.logo}</div>
                  <div class="dhc-info">
                    <div class="dhc-name">${h.name}</div>
                    <div class="dhc-prize">${h.prize} · ${h.mode}</div>
                  </div>
                  <span class="badge ${h.status === 'closing-soon' ? 'badge-red' : 'badge-green'}">${h.status === 'closing-soon' ? 'Closing' : 'Open'}</span>
                </div>
              `).join('')}
            </div>

            <!-- Top Resumes -->
            <div class="dash-section">
              <div class="dash-section-header">
                <h3>🌟 Top Talent</h3>
                <button class="btn btn-ghost btn-sm" onclick="App.navigate('maker')">All <i class="fas fa-arrow-right"></i></button>
              </div>
              ${DB.resumes.slice(0,3).map(r => `
                <div class="dash-resume-card" onclick="App.navigate('maker')">
                  ${Utils.renderAvatar(r.avatar, 'sm', r.name)}
                  <div class="drc-info">
                    <div class="drc-name">${r.name}</div>
                    <div class="drc-uni">${r.university}</div>
                  </div>
                  <div class="ai-score"><i class="fas fa-brain"></i> ${r.aiScore}%</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="dash-quick-actions">
          <h3 style="margin-bottom:16px">Quick Actions</h3>
          <div class="grid-4">
            ${[
              { icon: 'fa-rocket', label: 'Register Startup', color: '#7c3aed', action: "App.navigate('maker')" },
              { icon: 'fa-file-upload', label: 'Upload Resume', color: '#10b981', action: "App.navigate('maker')" },
              { icon: 'fa-search', label: 'Find Investors', color: '#f59e0b', action: "App.navigate('investor')" },
              { icon: 'fa-code', label: 'Join Hackathon', color: '#06b6d4', action: "App.navigate('hackathon')" }
            ].map(a => `
              <div class="quick-action-card" onclick="${a.action}">
                <div class="qa-icon" style="background:${a.color}22;color:${a.color}">
                  <i class="fas ${a.icon}"></i>
                </div>
                <span>${a.label}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    this.injectStyles();
  },

  injectStyles() {
    if (document.getElementById('dash-styles')) return;
    const s = document.createElement('style');
    s.id = 'dash-styles';
    s.textContent = `
.dash-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:16px; }
.dash-header h2 { margin-bottom:4px; }
.dash-header-actions { display:flex; gap:10px; }
.dash-main-grid { display:grid; grid-template-columns:1fr 340px; gap:24px; margin-bottom:28px; }
.dash-section { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; }
.dash-section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.dash-section-header h3 { font-size:1rem; }
.dash-startups { display:flex; flex-direction:column; gap:12px; }
.dash-startup-card {
  background:var(--bg-secondary); border:1px solid var(--border);
  border-radius:var(--radius-md); padding:16px; cursor:pointer; transition:var(--transition);
}
.dash-startup-card:hover { border-color:var(--border-hover); }
.dsc-header { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
.dsc-info { flex:1; }
.dsc-name { font-size:0.9rem; font-weight:600; display:flex; align-items:center; gap:6px; }
.dsc-tagline { font-size:0.78rem; color:var(--text-muted); margin-top:2px; }
.dsc-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; }
.dsc-funding-label { display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted); margin-bottom:6px; }
.dash-right { display:flex; flex-direction:column; gap:0; }
.dash-hack-card {
  display:flex; align-items:center; gap:12px; padding:12px;
  background:var(--bg-secondary); border:1px solid var(--border);
  border-radius:var(--radius-md); margin-bottom:8px; cursor:pointer; transition:var(--transition);
}
.dash-hack-card:hover { border-color:var(--border-hover); }
.dhc-logo { font-size:1.5rem; flex-shrink:0; }
.dhc-info { flex:1; }
.dhc-name { font-size:0.85rem; font-weight:600; }
.dhc-prize { font-size:0.75rem; color:var(--text-muted); margin-top:2px; }
.dash-resume-card {
  display:flex; align-items:center; gap:10px; padding:10px;
  background:var(--bg-secondary); border:1px solid var(--border);
  border-radius:var(--radius-md); margin-bottom:8px; cursor:pointer; transition:var(--transition);
}
.dash-resume-card:hover { border-color:var(--border-hover); }
.drc-info { flex:1; }
.drc-name { font-size:0.85rem; font-weight:600; }
.drc-uni { font-size:0.72rem; color:var(--text-muted); }
.dash-quick-actions { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; }
.quick-action-card {
  display:flex; flex-direction:column; align-items:center; gap:10px;
  padding:20px; background:var(--bg-secondary); border:1px solid var(--border);
  border-radius:var(--radius-lg); cursor:pointer; transition:var(--transition); text-align:center;
  font-size:0.85rem; font-weight:500;
}
.quick-action-card:hover { border-color:var(--border-hover); transform:translateY(-2px); }
.qa-icon { width:44px; height:44px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:1.2rem; }
@media(max-width:900px) { .dash-main-grid { grid-template-columns:1fr; } }
    `;
    document.head.appendChild(s);
  }
};
