// ===== HACKATHON PORTAL PAGE =====
const HackathonPage = {
  filter: 'all',

  render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-wrapper">
        <div class="page-header">
          <h2>⚡ Hackathon Portal</h2>
          <p>Discover hackathons, form teams, and compete for prizes. AI matches you with the right teammates.</p>
        </div>

        <!-- Stats -->
        <div class="grid-4" style="margin-bottom:28px">
          ${[
            { icon:'fa-code', color:'#06b6d4', bg:'rgba(6,182,212,0.15)', label:'Total Hackathons', value: DB.hackathons.length },
            { icon:'fa-door-open', color:'#10b981', bg:'rgba(16,185,129,0.15)', label:'Open Now', value: DB.hackathons.filter(h=>h.status==='open').length },
            { icon:'fa-users', color:'#7c3aed', bg:'rgba(124,58,237,0.15)', label:'Total Participants', value: DB.hackathons.reduce((a,h)=>a+h.registered,0) },
            { icon:'fa-trophy', color:'#f59e0b', bg:'rgba(245,158,11,0.15)', label:'Total Prize Pool', value: '₹26L+' }
          ].map(s=>`
            <div class="stat-card card-hover-lift">
              <div class="stat-icon" style="background:${s.bg};color:${s.color}"><i class="fas ${s.icon}"></i></div>
              <div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>
            </div>
          `).join('')}
        </div>

        <!-- Filter Chips -->
        <div class="chip-filters">
          ${['all','open','closing-soon','upcoming'].map(f=>`
            <div class="chip ${this.filter===f?'active':''}" onclick="HackathonPage.filter='${f}';HackathonPage.renderList()">
              ${f==='all'?'All':f==='open'?'Open':f==='closing-soon'?'Closing Soon':'Upcoming'}
            </div>
          `).join('')}
        </div>

        <div id="hackathon-list"></div>
      </div>
    `;
    this.renderList();
    this.injectStyles();
  },

  renderList() {
    const el = document.getElementById('hackathon-list');
    const filtered = this.filter === 'all' ? DB.hackathons : DB.hackathons.filter(h => h.status === this.filter);
    el.innerHTML = `
      <div class="hack-grid">
        ${filtered.map(h => this.renderCard(h)).join('')}
      </div>
    `;
  },

  renderCard(h) {
    const statusColors = { open: 'badge-green', 'closing-soon': 'badge-red', upcoming: 'badge-blue' };
    const statusLabels = { open: 'Open', 'closing-soon': 'Closing Soon', upcoming: 'Upcoming' };
    const daysLeft = Math.max(0, Math.ceil((new Date(h.deadline) - new Date()) / 86400000));

    return `
      <div class="hack-card card-hover-lift ${h.featured?'hack-featured':''}">
        ${h.featured?'<div class="hack-featured-badge"><i class="fas fa-star"></i> Featured</div>':''}
        <div class="hack-card-header">
          <div class="hack-logo">${h.logo}</div>
          <div style="flex:1">
            <div class="hack-name">${h.name}</div>
            <div class="hack-organizer">${h.organizer}</div>
          </div>
          <span class="badge ${statusColors[h.status]}">${statusLabels[h.status]}</span>
        </div>
        <p class="hack-desc">${h.description}</p>
        <div class="hack-tags">${h.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div class="hack-details">
          <div class="hack-detail"><i class="fas fa-trophy"></i><span>${h.prize}</span></div>
          <div class="hack-detail"><i class="fas fa-users"></i><span>Team: ${h.teamSize}</span></div>
          <div class="hack-detail"><i class="fas fa-laptop"></i><span>${h.mode}</span></div>
          <div class="hack-detail"><i class="fas fa-map-marker-alt"></i><span>${h.location}</span></div>
        </div>
        <div class="hack-timeline">
          <div class="hack-timeline-item">
            <span class="htl-label">Deadline</span>
            <span class="htl-value ${daysLeft <= 7 ? 'htl-urgent' : ''}">${h.deadline} ${daysLeft > 0 ? `(${daysLeft}d left)` : '(Closed)'}</span>
          </div>
          <div class="hack-timeline-item">
            <span class="htl-label">Event Date</span>
            <span class="htl-value">${h.eventDate}</span>
          </div>
        </div>
        <div class="hack-footer">
          <div class="hack-registered">
            <div class="progress-bar" style="width:120px">
              <div class="progress-fill" style="width:${Math.min((h.registered/h.participants)*100,100)}%;background:var(--gradient-hack)"></div>
            </div>
            <span style="font-size:0.75rem;color:var(--text-muted)">${h.registered}/${h.participants} registered</span>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary btn-sm" onclick="HackathonPage.findTeam(${h.id})">
              <i class="fas fa-users"></i> Find Team
            </button>
            <button class="btn btn-primary btn-sm ${h.status==='upcoming'?'':'btn-success'}" onclick="HackathonPage.register(${h.id})">
              ${h.status==='upcoming'?'<i class="fas fa-bell"></i> Notify Me':'<i class="fas fa-rocket"></i> Register'}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  register(id) {
    const h = DB.hackathons.find(x => x.id === id);
    if (!h) return;
    Modal.open(`
      <h3 class="modal-title">${h.logo} Register for ${h.name}</h3>
      <p class="modal-subtitle">${h.organizer} · ${h.mode} · ${h.location}</p>
      <div class="success-banner"><i class="fas fa-check-circle"></i><p>You're eligible to register! Team size: ${h.teamSize}</p></div>
      <div class="form-group">
        <label class="form-label">Team Name</label>
        <input type="text" class="form-input" id="hack-team-name" placeholder="Enter your team name"/>
      </div>
      <div class="form-group">
        <label class="form-label">Team Members (emails, comma separated)</label>
        <input type="text" class="form-input" id="hack-members" placeholder="teammate@uni.edu, ..."/>
      </div>
      <div class="form-group">
        <label class="form-label">Project Idea (optional)</label>
        <textarea class="form-textarea" id="hack-idea" rows="3" placeholder="Brief description of what you plan to build..."></textarea>
      </div>
      <div style="background:var(--bg-secondary);border-radius:var(--radius-md);padding:14px;margin-bottom:20px">
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px">REQUIRED SKILLS</div>
        <div class="tags-container">${h.skills.map(s=>`<span class="tag">${s}</span>`).join('')}</div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="HackathonPage.confirmRegister(${h.id})">
          <i class="fas fa-rocket"></i> Confirm Registration
        </button>
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      </div>
    `);
  },

  confirmRegister(id) {
    const h = DB.hackathons.find(x => x.id === id);
    h.registered++;
    Modal.close();
    Toast.success(`Successfully registered for ${h.name}! 🎉`);
  },

  findTeam(id) {
    const h = DB.hackathons.find(x => x.id === id);
    if (!h) return;
    const suggestedTeammates = DB.resumes.filter(r =>
      r.skills.some(s => h.skills.some(hs => hs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(hs.toLowerCase())))
    ).slice(0, 3);

    Modal.open(`
      <h3 class="modal-title">🤝 Find Teammates for ${h.name}</h3>
      <p class="modal-subtitle">AI-matched teammates based on required skills: ${h.skills.join(', ')}</p>
      <div class="ai-insight-banner" style="margin-bottom:20px">
        <i class="fas fa-brain"></i>
        <div><strong>AI Matching</strong><span>These students have skills that match this hackathon's requirements.</span></div>
      </div>
      ${suggestedTeammates.length === 0 ? '<p style="color:var(--text-muted)">No matches found. Try posting in the network.</p>' :
        suggestedTeammates.map(r => `
          <div class="teammate-card">
            ${Utils.renderAvatar(r.avatar, 'md', r.name)}
            <div style="flex:1">
              <div style="font-size:0.9rem;font-weight:600">${r.name}</div>
              <div style="font-size:0.78rem;color:var(--text-muted)">${r.university} · ${r.year}</div>
              <div class="tags-container" style="margin-top:6px">${r.skills.slice(0,3).map(s=>`<span class="tag">${s}</span>`).join('')}</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="Toast.success('Invite sent to ${r.name}!')">
              <i class="fas fa-user-plus"></i> Invite
            </button>
          </div>
        `).join('')
      }
      <button class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:16px" onclick="Modal.close()">Close</button>
    `, 'modal-box-lg');
  },

  injectStyles() {
    if (document.getElementById('hack-styles')) return;
    const s = document.createElement('style');
    s.id = 'hack-styles';
    s.textContent = `
.hack-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:20px; }
.hack-card {
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--radius-lg); padding:24px; position:relative;
  transition:var(--transition-slow);
}
.hack-card:hover { border-color:var(--border-hover); transform:translateY(-4px); box-shadow:var(--shadow-lg); }
.hack-featured { border-color:rgba(245,158,11,0.3); }
.hack-featured-badge {
  position:absolute; top:16px; right:16px;
  background:var(--gradient-investor); color:#fff;
  font-size:0.7rem; font-weight:700; padding:3px 10px;
  border-radius:var(--radius-full); display:flex; align-items:center; gap:4px;
}
.hack-card-header { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
.hack-logo { font-size:2rem; flex-shrink:0; }
.hack-name { font-size:1rem; font-weight:700; }
.hack-organizer { font-size:0.78rem; color:var(--text-muted); margin-top:2px; }
.hack-desc { font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px; line-height:1.6; }
.hack-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
.hack-details { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px; }
.hack-detail { display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--text-secondary); }
.hack-detail i { color:var(--accent-purple); width:14px; }
.hack-timeline { background:var(--bg-secondary); border-radius:var(--radius-md); padding:12px; margin-bottom:16px; display:flex; gap:20px; }
.hack-timeline-item { flex:1; }
.htl-label { display:block; font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px; }
.htl-value { font-size:0.82rem; font-weight:600; }
.htl-urgent { color:var(--accent-red); }
.hack-footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.hack-registered { display:flex; align-items:center; gap:8px; }
.teammate-card { display:flex; align-items:center; gap:12px; padding:14px; background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-md); margin-bottom:10px; }
    `;
    document.head.appendChild(s);
  }
};
