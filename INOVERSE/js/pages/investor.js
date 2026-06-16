// ===== INVESTOR ZONE PAGE =====
const InvestorPage = {
  activeTab: 'startups',
  filterCategory: 'All',
  filterStage: 'All',
  searchQuery: '',

  render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-wrapper">
        <div class="page-header">
          <h2>📈 Investor Zone</h2>
          <p>Discover AI-curated student startups and connect with the next generation of founders.</p>
        </div>
        <div class="tabs" style="margin-bottom:28px" id="investor-tabs">
          <button class="tab-btn ${this.activeTab==='startups'?'active':''}" onclick="InvestorPage.switchTab('startups')">
            <i class="fas fa-rocket"></i> Browse Startups
          </button>
          <button class="tab-btn ${this.activeTab==='resumes'?'active':''}" onclick="InvestorPage.switchTab('resumes')">
            <i class="fas fa-file-alt"></i> Talent Pool
          </button>
          <button class="tab-btn ${this.activeTab==='investors'?'active':''}" onclick="InvestorPage.switchTab('investors')">
            <i class="fas fa-chart-line"></i> Investors
          </button>
        </div>
        <div id="investor-tab-content"></div>
      </div>
    `;
    this.renderTab();
    this.injectStyles();
  },

  switchTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('#investor-tabs .tab-btn').forEach((b,i) => {
      b.classList.toggle('active', ['startups','resumes','investors'][i] === tab);
    });
    this.renderTab();
  },

  renderTab() {
    const el = document.getElementById('investor-tab-content');
    if (this.activeTab === 'startups') this.renderStartups(el);
    else if (this.activeTab === 'resumes') this.renderTalentPool(el);
    else this.renderInvestors(el);
  },

  renderStartups(el) {
    const categories = ['All', ...new Set(DB.startups.map(s => s.category))];
    const stages = ['All', 'Idea', 'Pre-Seed', 'Seed', 'Series A'];
    let filtered = DB.startups.filter(s => {
      const catOk = this.filterCategory === 'All' || s.category === this.filterCategory;
      const stageOk = this.filterStage === 'All' || s.stage === this.filterStage;
      const searchOk = !this.searchQuery || s.name.toLowerCase().includes(this.searchQuery) || s.tagline.toLowerCase().includes(this.searchQuery);
      return catOk && stageOk && searchOk;
    });

    el.innerHTML = `
      <!-- Search & Filters -->
      <div class="investor-toolbar">
        <div class="search-bar" style="flex:1;max-width:400px">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search startups..." value="${this.searchQuery}"
            oninput="InvestorPage.searchQuery=this.value.toLowerCase();InvestorPage.renderTab()"/>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <select class="form-select" style="width:auto;padding:8px 14px" onchange="InvestorPage.filterCategory=this.value;InvestorPage.renderTab()">
            ${categories.map(c=>`<option ${c===this.filterCategory?'selected':''}>${c}</option>`).join('')}
          </select>
          <select class="form-select" style="width:auto;padding:8px 14px" onchange="InvestorPage.filterStage=this.value;InvestorPage.renderTab()">
            ${stages.map(s=>`<option ${s===this.filterStage?'selected':''}>${s}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- AI Insight Banner -->
      <div class="ai-insight-banner">
        <i class="fas fa-brain"></i>
        <div>
          <strong>AI Curation Active</strong>
          <span>Startups are ranked by traction, team quality, and market potential. Verified startups are highlighted.</span>
        </div>
      </div>

      <!-- Results Count -->
      <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:16px">
        Showing <strong style="color:var(--text-primary)">${filtered.length}</strong> startups
      </div>

      <!-- Startup Grid -->
      <div class="grid-auto">
        ${filtered.length === 0 ? `
          <div class="empty-state" style="grid-column:1/-1">
            <i class="fas fa-search"></i><h3>No startups found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ` : filtered.map(s => this.renderStartupCard(s)).join('')}
      </div>
    `;
  },

  renderStartupCard(s) {
    const pct = Utils.fundingProgress(s.raised, s.fundingGoal);
    // AI match score for first investor
    const matchScore = AIEngine.matchInvestorToStartup(DB.investors[0], s);
    return `
      <div class="inv-startup-card card-hover-lift" onclick="InvestorPage.viewStartup(${s.id})">
        <div class="isc-header">
          <div style="display:flex;align-items:center;gap:10px;flex:1">
            ${Utils.renderAvatar(s.founderAvatar, 'md', s.name)}
            <div>
              <div class="isc-name">${s.name} ${s.verified?'<i class="fas fa-check-circle" style="color:var(--accent-blue);font-size:0.72rem"></i>':''}</div>
              <div class="isc-uni">${s.university}</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
            <span class="badge ${Utils.stageBadge(s.stage)}">${s.stage}</span>
            ${s.featured?'<span class="badge badge-orange"><i class="fas fa-star"></i> Featured</span>':''}
          </div>
        </div>
        <p class="isc-tagline">${s.tagline}</p>
        <div class="isc-tags">${s.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div class="isc-funding">
          <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:6px">
            <span style="color:var(--text-muted)">Funding</span>
            <span style="color:var(--accent-green);font-weight:600">${pct}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-muted);margin-top:6px">
            <span>${Utils.formatCurrency(s.raised)}</span><span>${Utils.formatCurrency(s.fundingGoal)}</span>
          </div>
        </div>
        <div class="isc-footer">
          <div class="ai-score"><i class="fas fa-brain"></i> ${matchScore}% match</div>
          <div style="display:flex;gap:10px;font-size:0.78rem;color:var(--text-muted)">
            <span><i class="fas fa-heart"></i> ${s.upvotes}</span>
            <span><i class="fas fa-eye"></i> ${Utils.formatNumber(s.views)}</span>
          </div>
        </div>
      </div>
    `;
  },

  viewStartup(id) {
    const s = DB.startups.find(x => x.id === id);
    if (!s) return;
    const pct = Utils.fundingProgress(s.raised, s.fundingGoal);
    const insights = AIEngine.generateStartupInsights(s);
    const investorMatches = DB.investors.map(inv => ({
      inv, score: AIEngine.matchInvestorToStartup(inv, s)
    })).sort((a,b) => b.score - a.score);

    Modal.open(`
      <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:20px">
        ${Utils.renderAvatar(s.founderAvatar, 'lg', s.name)}
        <div style="flex:1">
          <h3 class="modal-title" style="margin-bottom:4px">${s.name}</h3>
          <p style="font-size:0.875rem;margin-bottom:8px">${s.tagline}</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            <span class="badge ${Utils.stageBadge(s.stage)}">${s.stage}</span>
            <span class="badge badge-blue">${s.category}</span>
            ${s.verified?'<span class="badge badge-green"><i class="fas fa-check"></i> Verified</span>':''}
            ${s.featured?'<span class="badge badge-orange"><i class="fas fa-star"></i> Featured</span>':''}
          </div>
        </div>
      </div>
      <p style="margin-bottom:20px;font-size:0.9rem">${s.description}</p>
      <div class="grid-2" style="margin-bottom:20px">
        <div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,0.15);color:var(--accent-green)"><i class="fas fa-rupee-sign"></i></div><div><div class="stat-value" style="font-size:1.2rem">${Utils.formatCurrency(s.raised)}</div><div class="stat-label">Raised</div></div></div>
        <div class="stat-card"><div class="stat-icon" style="background:rgba(124,58,237,0.15);color:var(--accent-purple)"><i class="fas fa-bullseye"></i></div><div><div class="stat-value" style="font-size:1.2rem">${Utils.formatCurrency(s.fundingGoal)}</div><div class="stat-label">Goal</div></div></div>
      </div>
      <div class="progress-bar" style="margin-bottom:20px"><div class="progress-fill" style="width:${pct}%"></div></div>
      ${insights.length?`<div style="margin-bottom:20px"><h4 style="margin-bottom:10px;font-size:0.9rem">AI Insights</h4>${insights.map(i=>`<div class="insight-item insight-${i.type}" style="margin-bottom:6px"><i class="fas ${i.type==='positive'?'fa-arrow-up':i.type==='warning'?'fa-exclamation':'fa-info-circle'}"></i><span>${i.text}</span></div>`).join('')}</div>`:''}
      ${s.lookingFor.length?`<div style="margin-bottom:20px"><h4 style="margin-bottom:10px;font-size:0.9rem">Hiring For</h4><div class="tags-container">${s.lookingFor.map(r=>`<span class="badge badge-purple">${r}</span>`).join('')}</div></div>`:''}
      <div style="display:flex;gap:10px;margin-top:8px">
        <button class="btn btn-investor" style="flex:1;justify-content:center" onclick="Toast.success('Investment interest sent to ${s.founder}!');Modal.close()"><i class="fas fa-handshake"></i> Express Interest</button>
        <button class="btn btn-secondary" onclick="Modal.close()">Close</button>
      </div>
    `, 'modal-box-lg');
  },

  renderTalentPool(el) {
    el.innerHTML = `
      <div class="investor-toolbar" style="margin-bottom:20px">
        <div class="search-bar" style="flex:1;max-width:400px">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search by skill, university..." oninput="InvestorPage.filterResumes(this.value)"/>
        </div>
      </div>
      <div class="ai-insight-banner" style="margin-bottom:20px">
        <i class="fas fa-robot"></i>
        <div>
          <strong>AI Resume Screening</strong>
          <span>Resumes are AI-scored and matched to recruiter requirements. Only relevant profiles are shown.</span>
        </div>
      </div>
      <div class="grid-auto" id="resume-grid">
        ${DB.resumes.map(r => this.renderResumeCard(r)).join('')}
      </div>
    `;
  },

  filterResumes(query) {
    const q = query.toLowerCase();
    const grid = document.getElementById('resume-grid');
    if (!grid) return;
    const filtered = DB.resumes.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.university.toLowerCase().includes(q) ||
      r.skills.some(s => s.toLowerCase().includes(q))
    );
    grid.innerHTML = filtered.map(r => this.renderResumeCard(r)).join('');
  },

  renderResumeCard(r) {
    const recruiterMatch = AIEngine.scoreResumeForRecruiter(r, DB.recruiters[0]);
    return `
      <div class="resume-card card-hover-lift" onclick="InvestorPage.viewResume(${r.id})">
        <div class="rc-header">
          ${Utils.renderAvatar(r.avatar, 'lg', r.name)}
          <div style="flex:1">
            <div class="rc-name">${r.name}</div>
            <div class="rc-uni">${r.university}</div>
            <div class="rc-degree">${r.degree} · ${r.year}</div>
          </div>
          <div style="text-align:right">
            <div class="ai-score" style="margin-bottom:6px"><i class="fas fa-brain"></i> ${r.aiScore}%</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">AI Score</div>
          </div>
        </div>
        <div class="rc-skills">${r.skills.slice(0,5).map(s=>`<span class="tag">${s}</span>`).join('')}${r.skills.length>5?`<span class="tag">+${r.skills.length-5}</span>`:''}</div>
        <div class="rc-meta">
          <span><i class="fas fa-briefcase"></i> ${r.lookingFor}</span>
          <span><i class="fas fa-calendar"></i> ${r.availability}</span>
          <span><i class="fas fa-star"></i> GPA ${r.gpa}</span>
        </div>
        <div class="rc-footer">
          <span class="badge ${recruiterMatch.score>=80?'badge-green':recruiterMatch.score>=60?'badge-blue':'badge-orange'}">${recruiterMatch.label}</span>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();Toast.success('Profile sent to recruiters!')">
            <i class="fas fa-paper-plane"></i> Contact
          </button>
        </div>
      </div>
    `;
  },

  viewResume(id) {
    const r = DB.resumes.find(x => x.id === id);
    if (!r) return;
    const matches = DB.recruiters.map(rec => ({
      rec, match: AIEngine.scoreResumeForRecruiter(r, rec)
    }));
    Modal.open(`
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
        ${Utils.renderAvatar(r.avatar, 'xl', r.name)}
        <div>
          <h3 class="modal-title">${r.name}</h3>
          <p style="font-size:0.875rem">${r.university} · ${r.degree}</p>
          <p style="font-size:0.875rem;color:var(--text-muted)">${r.year} · GPA ${r.gpa}</p>
          <div style="display:flex;gap:8px;margin-top:8px">
            <div class="ai-score"><i class="fas fa-brain"></i> AI Score: ${r.aiScore}/100</div>
          </div>
        </div>
      </div>
      <div style="margin-bottom:16px"><h4 style="margin-bottom:10px;font-size:0.9rem">Skills</h4><div class="tags-container">${r.skills.map(s=>`<span class="tag">${s}</span>`).join('')}</div></div>
      ${r.experience.length?`<div style="margin-bottom:16px"><h4 style="margin-bottom:10px;font-size:0.9rem">Experience</h4>${r.experience.map(e=>`<div style="font-size:0.875rem;padding:8px 0;border-bottom:1px solid var(--border)">${e}</div>`).join('')}</div>`:''}
      <div style="margin-bottom:16px"><h4 style="margin-bottom:10px;font-size:0.9rem">Looking For</h4><p style="font-size:0.875rem">${r.lookingFor} · Available ${r.availability}</p></div>
      <div style="margin-bottom:20px"><h4 style="margin-bottom:10px;font-size:0.9rem">Recruiter Match Analysis</h4>
        ${matches.map(m=>`
          <div class="match-result-card ${m.match.recommended?'match-recommended':''}">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              ${Utils.renderAvatar(m.rec.avatar,'sm',m.rec.company)}
              <div style="flex:1"><div style="font-size:0.875rem;font-weight:600">${m.rec.company}</div></div>
              <div class="ai-score"><i class="fas fa-brain"></i> ${m.match.score}%</div>
            </div>
            <span class="badge ${m.match.score>=80?'badge-green':m.match.score>=60?'badge-blue':'badge-orange'}">${m.match.label}</span>
          </div>
        `).join('')}
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="Toast.success('Profile forwarded to recruiters!');Modal.close()"><i class="fas fa-paper-plane"></i> Forward to Recruiters</button>
        <button class="btn btn-secondary" onclick="Modal.close()">Close</button>
      </div>
    `, 'modal-box-lg');
  },

  renderInvestors(el) {
    el.innerHTML = `
      <div class="grid-auto">
        ${DB.investors.map(inv => `
          <div class="investor-card card-hover-lift">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
              ${Utils.renderAvatar(inv.avatar, 'lg', inv.name)}
              <div>
                <div style="font-size:1rem;font-weight:700">${inv.name}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">${inv.firm}</div>
                ${inv.verified?'<span class="badge badge-blue" style="margin-top:6px"><i class="fas fa-check"></i> Verified</span>':''}
              </div>
            </div>
            <p style="font-size:0.85rem;margin-bottom:16px">${inv.bio}</p>
            <div style="margin-bottom:12px">
              <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:6px">FOCUS AREAS</div>
              <div class="tags-container">${inv.focus.map(f=>`<span class="tag">${f}</span>`).join('')}</div>
            </div>
            <div class="grid-2" style="margin-bottom:16px">
              <div><div style="font-size:0.72rem;color:var(--text-muted)">CHECK SIZE</div><div style="font-size:0.85rem;font-weight:600;margin-top:4px">${inv.checkSize}</div></div>
              <div><div style="font-size:0.72rem;color:var(--text-muted)">PORTFOLIO</div><div style="font-size:0.85rem;font-weight:600;margin-top:4px">${inv.portfolio} companies</div></div>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-investor btn-sm" style="flex:1;justify-content:center" onclick="Toast.info('Connection request sent to ${inv.name}!')">
                <i class="fas fa-handshake"></i> Connect
              </button>
              <span class="badge ${inv.activelyInvesting?'badge-green':'badge-orange'}" style="align-self:center">
                ${inv.activelyInvesting?'Actively Investing':'Paused'}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  injectStyles() {
    if (document.getElementById('investor-styles')) return;
    const s = document.createElement('style');
    s.id = 'investor-styles';
    s.textContent = `
.investor-toolbar { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:20px; }
.ai-insight-banner {
  display:flex; align-items:center; gap:12px; padding:14px 18px;
  background:rgba(124,58,237,0.08); border:1px solid rgba(124,58,237,0.2);
  border-radius:var(--radius-md); margin-bottom:20px; font-size:0.85rem;
}
.ai-insight-banner i { color:var(--accent-purple); font-size:1.2rem; flex-shrink:0; }
.ai-insight-banner strong { color:var(--accent-purple-light); margin-right:8px; }
.inv-startup-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; cursor:pointer; transition:var(--transition-slow); }
.inv-startup-card:hover { border-color:var(--border-hover); transform:translateY(-4px); box-shadow:var(--shadow-lg); }
.isc-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
.isc-name { font-size:0.95rem; font-weight:700; display:flex; align-items:center; gap:6px; }
.isc-uni { font-size:0.72rem; color:var(--text-muted); margin-top:2px; }
.isc-tagline { font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px; }
.isc-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
.isc-funding { margin-bottom:14px; }
.isc-footer { display:flex; align-items:center; justify-content:space-between; }
.resume-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; cursor:pointer; transition:var(--transition-slow); }
.resume-card:hover { border-color:var(--border-hover); transform:translateY(-4px); box-shadow:var(--shadow-lg); }
.rc-header { display:flex; align-items:flex-start; gap:14px; margin-bottom:14px; }
.rc-name { font-size:1rem; font-weight:700; }
.rc-uni { font-size:0.8rem; color:var(--text-secondary); margin-top:2px; }
.rc-degree { font-size:0.75rem; color:var(--text-muted); margin-top:2px; }
.rc-skills { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; }
.rc-meta { display:flex; flex-wrap:wrap; gap:12px; font-size:0.78rem; color:var(--text-muted); margin-bottom:14px; }
.rc-meta span { display:flex; align-items:center; gap:4px; }
.rc-footer { display:flex; align-items:center; justify-content:space-between; }
.investor-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; transition:var(--transition-slow); }
.investor-card:hover { border-color:rgba(245,158,11,0.3); transform:translateY(-4px); box-shadow:0 0 40px rgba(245,158,11,0.1); }
    `;
    document.head.appendChild(s);
  }
};
