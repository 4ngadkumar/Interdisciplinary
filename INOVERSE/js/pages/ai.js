// ===== AI STUDIO PAGE =====
const AIPage = {
  activeTab: 'skill',
  skillMatches: [],
  deck: null,
  failureReport: null,
  trendReport: null,
  collaborationMatches: [],
  resumeReport: null,
  meetingQuestions: [],
  meetingIndex: 0,
  meetingFeedback: null,
  cameraStream: null,
  cameraTimer: null,
  cameraSignal: { confidence: 55, brightness: 0, movement: 0 },
  lastFrame: null,

  tabs: [
    { id: 'skill', icon: 'fa-wand-magic-sparkles', label: 'Skill Matcher' },
    { id: 'deck', icon: 'fa-file-powerpoint', label: 'Pitch Deck' },
    { id: 'failure', icon: 'fa-triangle-exclamation', label: 'Failure Simulator' },
    { id: 'trends', icon: 'fa-chart-simple', label: 'Trend Forecaster' },
    { id: 'collab', icon: 'fa-people-arrows', label: 'Collaboration Matcher' },
    { id: 'meeting', icon: 'fa-video', label: 'Investor Simulator' },
    { id: 'resume', icon: 'fa-id-card', label: 'Resume Optimizer' }
  ],

  render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-wrapper">
        <div class="page-header">
          <h2><i class="fas fa-brain"></i> AI Studio</h2>
          <p>Smart tools for matching, pitching, risk testing, hiring, campus trends, investor practice, and career optimization.</p>
        </div>

        <div class="grid-4" style="margin-bottom:28px">
          ${[
            { icon: 'fa-route', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)', label: 'AI Routes', value: Object.keys(InnoVerseAIAPI.routes).length },
            { icon: 'fa-rocket', color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'Startup Signals', value: DB.startups.length },
            { icon: 'fa-users', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', label: 'Talent Profiles', value: DB.resumes.length },
            { icon: 'fa-handshake', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Investor Network', value: DB.investors.length }
          ].map(s => `
            <div class="stat-card card-hover-lift">
              <div class="stat-icon" style="background:${s.bg};color:${s.color}"><i class="fas ${s.icon}"></i></div>
              <div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>
            </div>
          `).join('')}
        </div>

        <div class="tabs ai-tabs" id="ai-tabs" style="margin-bottom:28px">
          ${this.tabs.map(tab => `
            <button class="tab-btn ${this.activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}" onclick="AIPage.switchTab('${tab.id}')">
              <i class="fas ${tab.icon}"></i> ${tab.label}
            </button>
          `).join('')}
        </div>

        <div id="ai-tab-content"></div>
      </div>
    `;
    this.injectStyles();
    this.renderTab();
  },

  switchTab(tab) {
    if (this.activeTab === 'meeting' && tab !== 'meeting') this.stopCamera(false);
    this.activeTab = tab;
    document.querySelectorAll('#ai-tabs .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    this.renderTab();
  },

  renderTab() {
    const el = document.getElementById('ai-tab-content');
    if (!el) return;
    if (this.activeTab === 'skill') this.renderSkillMatcher(el);
    else if (this.activeTab === 'deck') this.renderDeckGenerator(el);
    else if (this.activeTab === 'failure') this.renderFailureSimulator(el);
    else if (this.activeTab === 'trends') this.renderTrendForecaster(el);
    else if (this.activeTab === 'collab') this.renderCollaborationMatcher(el);
    else if (this.activeTab === 'meeting') this.renderMeetingSimulator(el);
    else this.renderResumeOptimizer(el);
  },

  optionList(items, selectedId) {
    return items.map(item => `<option value="${item.id}" ${String(item.id) === String(selectedId) ? 'selected' : ''}>${Utils.escapeHtml(item.name)}</option>`).join('');
  },

  scoreBadge(score) {
    if (score >= 80) return 'badge-green';
    if (score >= 65) return 'badge-blue';
    if (score >= 45) return 'badge-orange';
    return 'badge-red';
  },

  renderSkillMatcher(el) {
    const selected = DB.resumes[0]?.id;
    el.innerHTML = `
      <div class="ai-workbench">
        <div class="card">
          <h3 style="margin-bottom:4px">AI Skill Matcher</h3>
          <p style="font-size:0.85rem;margin-bottom:20px">Match a student profile to investors, hackathons, and startup roles.</p>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Student Profile</label>
              <select class="form-select" id="skill-profile">${this.optionList(DB.resumes, selected)}</select>
            </div>
            <div class="form-group">
              <label class="form-label">Match Priority</label>
              <select class="form-select" id="skill-priority">
                <option>Best overall fit</option>
                <option>Investor access</option>
                <option>Hackathon wins</option>
                <option>Startup roles</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary" onclick="AIPage.runSkillMatcher()"><i class="fas fa-wand-magic-sparkles"></i> Run Smart Match</button>
        </div>
        <div class="card">
          <h4 style="margin-bottom:12px"><i class="fas fa-route" style="color:var(--accent-purple)"></i> API Route</h4>
          <div class="api-route">POST /api/ai/skill-match</div>
          <p style="font-size:0.82rem;margin-top:12px">Uses skills, preferred roles, startup needs, investor focus, and hackathon requirements.</p>
        </div>
      </div>
      <div id="skill-results" class="ai-results">${this.skillMatches.length ? this.renderSkillResults() : this.renderEmpty('fa-wand-magic-sparkles', 'Run the matcher to see ranked opportunities.')}</div>
    `;
  },

  async runSkillMatcher() {
    const id = document.getElementById('skill-profile')?.value;
    const student = DB.resumes.find(r => String(r.id) === String(id)) || DB.resumes[0];
    const box = document.getElementById('skill-results');
    if (box) box.innerHTML = this.renderLoading('Matching profile signals');
    const res = await InnoVerseAIAPI.request('/api/ai/skill-match', { student });
    this.skillMatches = res.result;
    if (box) box.innerHTML = this.renderSkillResults();
    Toast.success('AI skill matching complete.');
  },

  renderSkillResults() {
    return `
      <div class="grid-auto">
        ${this.skillMatches.map(match => `
          <div class="ai-result-card card-hover-lift">
            <div class="ai-card-top">
              <span class="badge badge-purple">${match.type}</span>
              <div class="ai-score"><i class="fas fa-brain"></i> ${match.score}%</div>
            </div>
            <h3 style="font-size:1rem;margin-bottom:4px">${Utils.escapeHtml(match.name)}</h3>
            <p style="font-size:0.8rem;margin-bottom:12px">${Utils.escapeHtml(match.subtitle)}</p>
            <div class="ai-reason-list">
              ${match.reasons.map(reason => `<div><i class="fas fa-check-circle"></i> ${Utils.escapeHtml(reason)}</div>`).join('')}
            </div>
            <div class="ai-next-step">${Utils.escapeHtml(match.action)}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderDeckGenerator(el) {
    el.innerHTML = `
      <div class="ai-workbench">
        <div class="card">
          <h3 style="margin-bottom:4px">AI Pitch Deck Generator</h3>
          <p style="font-size:0.85rem;margin-bottom:20px">Generate a professional investor-ready deck outline from a startup idea.</p>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Startup Name</label>
              <input class="form-input" id="deck-name" value="CampusFlow" placeholder="Startup name"/>
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select" id="deck-category">
                ${['EdTech','FinTech','HealthTech','CleanTech','AgriTech','SaaS','E-Commerce','Social','Gaming','Other'].map(c => `<option>${c}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Startup Idea</label>
            <textarea class="form-textarea" id="deck-idea" rows="4" placeholder="Describe the problem, user, and solution...">AI workflow assistant that helps campus founders validate ideas, form teams, and prepare investor-ready material.</textarea>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Audience</label>
              <select class="form-select" id="deck-audience">
                <option>Seed investors</option>
                <option>Angel investors</option>
                <option>Campus incubator</option>
                <option>Hackathon judges</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Funding Goal</label>
              <input class="form-input" id="deck-goal" placeholder="500000"/>
            </div>
          </div>
          <button class="btn btn-maker" onclick="AIPage.generateDeck()"><i class="fas fa-file-powerpoint"></i> Generate Pitch Deck</button>
        </div>
        <div class="card">
          <h4 style="margin-bottom:12px"><i class="fas fa-layer-group" style="color:var(--accent-pink)"></i> Output</h4>
          <p style="font-size:0.82rem;margin-bottom:14px">Creates slides, bullet points, speaker notes, investor ask, and a quality score.</p>
          <div class="api-route">POST /api/ai/pitch-deck</div>
        </div>
      </div>
      <div id="deck-results" class="ai-results">${this.deck ? this.renderDeckResults() : this.renderEmpty('fa-file-powerpoint', 'Generate a deck to preview the slide flow.')}</div>
    `;
  },

  async generateDeck() {
    const payload = {
      name: document.getElementById('deck-name')?.value,
      idea: document.getElementById('deck-idea')?.value,
      category: document.getElementById('deck-category')?.value,
      audience: document.getElementById('deck-audience')?.value,
      fundingGoal: document.getElementById('deck-goal')?.value
    };
    const box = document.getElementById('deck-results');
    if (box) box.innerHTML = this.renderLoading('Building pitch narrative');
    const res = await InnoVerseAIAPI.request('/api/ai/pitch-deck', payload);
    this.deck = res.result;
    if (box) box.innerHTML = this.renderDeckResults();
    Toast.success('Pitch deck generated.');
  },

  renderDeckResults() {
    return `
      <div class="ai-result-header">
        <div>
          <h3>${Utils.escapeHtml(this.deck.title)}</h3>
          <p>Audience: ${Utils.escapeHtml(this.deck.audience)}</p>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <div class="ai-score"><i class="fas fa-star"></i> ${this.deck.qualityScore}/100</div>
          <button class="btn btn-secondary btn-sm" onclick="AIPage.downloadDeck()"><i class="fas fa-download"></i> Download</button>
        </div>
      </div>
      <div class="deck-grid">
        ${this.deck.slides.map((slide, index) => `
          <div class="deck-slide card-hover-lift">
            <div class="deck-slide-num">${index + 1}</div>
            <h3>${Utils.escapeHtml(slide.title)}</h3>
            <ul>
              ${slide.bullets.map(b => `<li>${Utils.escapeHtml(b)}</li>`).join('')}
            </ul>
            <div class="speaker-note"><i class="fas fa-microphone-lines"></i> ${Utils.escapeHtml(slide.note)}</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  downloadDeck() {
    if (!this.deck) return;
    const lines = [
      this.deck.title,
      `Audience: ${this.deck.audience}`,
      `Quality Score: ${this.deck.qualityScore}/100`,
      '',
      ...this.deck.slides.flatMap((slide, index) => [
        `${index + 1}. ${slide.title}`,
        ...slide.bullets.map(b => `- ${b}`),
        `Speaker note: ${slide.note}`,
        ''
      ])
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.deck.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  },

  renderFailureSimulator(el) {
    el.innerHTML = `
      <div class="ai-workbench">
        <div class="card">
          <h3 style="margin-bottom:4px">AI Failure Simulator</h3>
          <p style="font-size:0.85rem;margin-bottom:20px">Stress-test startup ideas against real-world risks before you spend months building.</p>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Startup Name</label>
              <input class="form-input" id="fail-name" value="EduPilot" placeholder="Startup name"/>
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select" id="fail-category">
                ${['EdTech','FinTech','HealthTech','CleanTech','AgriTech','SaaS','Other'].map(c => `<option>${c}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Idea</label>
            <textarea class="form-textarea" id="fail-idea" rows="4" placeholder="Describe the idea...">Personalized AI mentor for first-year students that recommends skills, projects, internships, and peer collaborators.</textarea>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Stage</label>
              <select class="form-select" id="fail-stage">
                ${['Idea','Pre-Seed','Seed','Series A'].map(c => `<option>${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Team Size</label>
              <input class="form-input" type="number" id="fail-team" value="3"/>
            </div>
          </div>
          <button class="btn btn-danger" onclick="AIPage.simulateFailure()"><i class="fas fa-triangle-exclamation"></i> Simulate Failure Modes</button>
        </div>
        <div class="card">
          <h4 style="margin-bottom:12px"><i class="fas fa-shield-halved" style="color:var(--accent-red)"></i> What It Tests</h4>
          <div class="ai-reason-list">
            <div><i class="fas fa-check-circle"></i> Validation and willingness to pay</div>
            <div><i class="fas fa-check-circle"></i> Distribution and team gaps</div>
            <div><i class="fas fa-check-circle"></i> Trust, economics, and investor narrative</div>
          </div>
          <div class="api-route" style="margin-top:16px">POST /api/ai/failure-simulator</div>
        </div>
      </div>
      <div id="failure-results" class="ai-results">${this.failureReport ? this.renderFailureResults() : this.renderEmpty('fa-triangle-exclamation', 'Run the simulator to see startup failure risks.')}</div>
    `;
  },

  async simulateFailure() {
    const payload = {
      name: document.getElementById('fail-name')?.value,
      idea: document.getElementById('fail-idea')?.value,
      category: document.getElementById('fail-category')?.value,
      stage: document.getElementById('fail-stage')?.value,
      teamSize: document.getElementById('fail-team')?.value
    };
    const box = document.getElementById('failure-results');
    if (box) box.innerHTML = this.renderLoading('Running failure simulation');
    const res = await InnoVerseAIAPI.request('/api/ai/failure-simulator', payload);
    this.failureReport = res.result;
    if (box) box.innerHTML = this.renderFailureResults();
    Toast.warning('Failure simulation complete.');
  },

  renderFailureResults() {
    return `
      <div class="ai-result-header">
        <div>
          <h3>Failure Simulation Report</h3>
          <p>${Utils.escapeHtml(this.failureReport.summary)}</p>
        </div>
        <div class="ai-score"><i class="fas fa-heart-pulse"></i> Survival ${this.failureReport.survivalScore}%</div>
      </div>
      <div class="grid-auto">
        ${this.failureReport.risks.map(risk => `
          <div class="risk-card">
            <div class="ai-card-top">
              <span class="badge ${this.scoreBadge(100 - risk.impact)}">${risk.impact}% impact</span>
              <span class="badge badge-orange">P${risk.probability} / S${risk.severity}</span>
            </div>
            <h3 style="font-size:1rem;margin-bottom:8px">${Utils.escapeHtml(risk.title)}</h3>
            <p style="font-size:0.82rem;margin-bottom:12px">${Utils.escapeHtml(risk.detail)}</p>
            <div class="progress-bar" style="margin-bottom:12px"><div class="progress-fill" style="width:${risk.impact}%;background:var(--gradient-investor)"></div></div>
            <div class="ai-next-step">${Utils.escapeHtml(risk.mitigation)}</div>
          </div>
        `).join('')}
      </div>
      <div class="card" style="margin-top:20px">
        <h4 style="margin-bottom:12px">Next Experiments</h4>
        <div class="ai-reason-list">
          ${this.failureReport.nextExperiments.map(item => `<div><i class="fas fa-flask"></i> ${Utils.escapeHtml(item)}</div>`).join('')}
        </div>
      </div>
    `;
  },

  renderTrendForecaster(el) {
    el.innerHTML = `
      <div class="ai-workbench">
        <div class="card">
          <h3 style="margin-bottom:4px">AI Campus Trend Forecaster</h3>
          <p style="font-size:0.85rem;margin-bottom:20px">Forecast emerging campus startup themes and in-demand skills from platform signals.</p>
          <button class="btn btn-primary" onclick="AIPage.forecastTrends()"><i class="fas fa-chart-simple"></i> Forecast Campus Trends</button>
        </div>
        <div class="card">
          <h4 style="margin-bottom:12px"><i class="fas fa-signal" style="color:var(--accent-cyan)"></i> Signals</h4>
          <div class="ai-reason-list">
            <div><i class="fas fa-check-circle"></i> Startup categories and hiring needs</div>
            <div><i class="fas fa-check-circle"></i> Resume skills and role demand</div>
            <div><i class="fas fa-check-circle"></i> Hackathon themes and prizes</div>
          </div>
          <div class="api-route" style="margin-top:16px">GET /api/ai/trend-forecast</div>
        </div>
      </div>
      <div id="trend-results" class="ai-results">${this.trendReport ? this.renderTrendResults() : this.renderEmpty('fa-chart-simple', 'Forecast trends to see momentum and skill demand.')}</div>
    `;
  },

  async forecastTrends() {
    const box = document.getElementById('trend-results');
    if (box) box.innerHTML = this.renderLoading('Reading campus signals');
    const res = await InnoVerseAIAPI.request('/api/ai/trend-forecast');
    this.trendReport = res.result;
    if (box) box.innerHTML = this.renderTrendResults();
    Toast.success('Campus trends forecasted.');
  },

  renderTrendResults() {
    return `
      <div class="dash-main-grid ai-trend-grid">
        <div class="dash-section">
          <div class="dash-section-header"><h3>Emerging Trends</h3><span class="badge badge-cyan">Forecast</span></div>
          ${this.trendReport.trends.map(trend => `
            <div class="trend-row">
              <div style="flex:1">
                <div class="trend-name">${Utils.escapeHtml(trend.name)}</div>
                <div class="trend-signal">${Utils.escapeHtml(trend.signal)}</div>
              </div>
              <div style="width:120px">
                <div style="display:flex;justify-content:space-between;font-size:0.72rem;margin-bottom:6px">
                  <span>Momentum</span><span>${trend.momentum}%</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${trend.momentum}%;background:var(--gradient-hack)"></div></div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="dash-section">
          <div class="dash-section-header"><h3>In-Demand Skills</h3><span class="badge badge-purple">Live</span></div>
          ${this.trendReport.topSkills.map(skill => `
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:6px">
                <span>${Utils.escapeHtml(skill.skill)}</span><span style="color:var(--accent-purple)">${skill.demand}%</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width:${skill.demand}%"></div></div>
              <div style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Projected growth +${skill.growth}%</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderCollaborationMatcher(el) {
    el.innerHTML = `
      <div class="ai-workbench">
        <div class="card">
          <h3 style="margin-bottom:4px">Smart Collaboration Matcher</h3>
          <p style="font-size:0.85rem;margin-bottom:20px">Find co-founders or teammates based on shared goals, complementary skills, and profile strength.</p>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Your Profile</label>
              <select class="form-select" id="collab-profile">${this.optionList(DB.resumes, DB.resumes[0]?.id)}</select>
            </div>
            <div class="form-group">
              <label class="form-label">Goal</label>
              <select class="form-select" id="collab-goal">
                <option value="cofounder">Find co-founder</option>
                <option value="hackathon teammate">Hackathon teammate</option>
                <option value="product designer">Product designer</option>
                <option value="growth partner">Growth partner</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary" onclick="AIPage.matchCollaborators()"><i class="fas fa-people-arrows"></i> Find Matches</button>
        </div>
        <div class="card">
          <h4 style="margin-bottom:12px"><i class="fas fa-user-group" style="color:var(--accent-blue)"></i> Matching Model</h4>
          <p style="font-size:0.82rem;margin-bottom:12px">Balances skill overlap with complementary capability, role interest, and AI profile score.</p>
          <div class="api-route">POST /api/ai/collaboration-match</div>
        </div>
      </div>
      <div id="collab-results" class="ai-results">${this.collaborationMatches.length ? this.renderCollaborationResults() : this.renderEmpty('fa-people-arrows', 'Find collaborators to see ranked co-founder and teammate fits.')}</div>
    `;
  },

  async matchCollaborators() {
    const id = document.getElementById('collab-profile')?.value;
    const profile = DB.resumes.find(r => String(r.id) === String(id)) || DB.resumes[0];
    const goal = document.getElementById('collab-goal')?.value;
    const box = document.getElementById('collab-results');
    if (box) box.innerHTML = this.renderLoading('Comparing skill graphs');
    const res = await InnoVerseAIAPI.request('/api/ai/collaboration-match', { profile, goal });
    this.collaborationMatches = res.result;
    if (box) box.innerHTML = this.renderCollaborationResults();
    Toast.success('Collaboration matches ready.');
  },

  renderCollaborationResults() {
    return `
      <div class="grid-auto">
        ${this.collaborationMatches.map(match => `
          <div class="person-card card-hover-lift">
            <div class="pc-header">
              ${Utils.renderAvatar(match.person.avatar, 'lg', match.person.name)}
              <div style="flex:1">
                <div class="pc-name">${Utils.escapeHtml(match.person.name)}</div>
                <div class="pc-uni">${Utils.escapeHtml(match.person.university)}</div>
                <div class="pc-degree">${Utils.escapeHtml(match.reason)}</div>
              </div>
              <div class="ai-score"><i class="fas fa-brain"></i> ${match.score}%</div>
            </div>
            <div style="margin-bottom:12px">
              <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:6px">COMPLEMENTARY SKILLS</div>
              <div class="tags-container">${match.complementary.map(s => `<span class="tag">${Utils.escapeHtml(s)}</span>`).join('')}</div>
            </div>
            <div class="ai-next-step">${Utils.escapeHtml(match.opener)}</div>
            <button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="Toast.success('Collaboration invite sent to ${Utils.escapeHtml(match.person.name)}!')"><i class="fas fa-user-plus"></i> Invite</button>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderMeetingSimulator(el) {
    const startupOptions = this.optionList(DB.startups, DB.startups[0]?.id);
    const question = this.meetingQuestions[this.meetingIndex] || 'Start the meeting to receive the first investor question.';
    el.innerHTML = `
      <div class="meeting-layout">
        <div class="card">
          <div class="meeting-header">
            <div>
              <h3 style="margin-bottom:4px">Virtual Investor Meeting Simulator</h3>
              <p style="font-size:0.85rem">Practice investor Q&A with live camera-based confidence feedback and investor emotion analysis.</p>
            </div>
            <span class="badge ${this.cameraStream ? 'badge-green' : 'badge-orange'}">${this.cameraStream ? 'Camera On' : 'Camera Off'}</span>
          </div>

          <div class="grid-2" style="margin-bottom:16px">
            <div class="form-group">
              <label class="form-label">Startup</label>
              <select class="form-select" id="meeting-startup">${startupOptions}</select>
            </div>
            <div class="form-group">
              <label class="form-label">Meeting Style</label>
              <select class="form-select" id="meeting-style">
                <option>Seed pitch</option>
                <option>Campus demo day</option>
                <option>Angel intro</option>
              </select>
            </div>
          </div>

          <div class="investor-screen">
            <div class="virtual-investor ${this.meetingFeedback?.sentiment || 'neutral'}">
              <i class="fas fa-user-tie"></i>
            </div>
            <div style="flex:1">
              <div class="investor-emotion">${this.meetingFeedback?.emotion || 'Waiting'}</div>
              <div class="investor-question">${Utils.escapeHtml(question)}</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Your Answer</label>
            <textarea class="form-textarea" id="meeting-answer" rows="5" placeholder="Answer the investor question with traction, proof, and next milestone..."></textarea>
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-secondary" onclick="AIPage.startCamera()"><i class="fas fa-camera"></i> Start Camera</button>
            <button class="btn btn-primary" onclick="AIPage.startMeeting()"><i class="fas fa-play"></i> Start Meeting</button>
            <button class="btn btn-investor" onclick="AIPage.analyzeMeetingAnswer()"><i class="fas fa-face-smile"></i> Analyze Emotion</button>
            <button class="btn btn-ghost" onclick="AIPage.nextMeetingQuestion()"><i class="fas fa-arrow-right"></i> Next Question</button>
          </div>
        </div>

        <div class="meeting-side">
          <div class="card">
            <h4 style="margin-bottom:12px"><i class="fas fa-video" style="color:var(--accent-cyan)"></i> Camera Signal</h4>
            <div class="camera-box">
              <video id="meeting-video" autoplay muted playsinline></video>
              <canvas id="meeting-canvas" style="display:none"></canvas>
              ${this.cameraStream ? '' : '<div class="camera-placeholder"><i class="fas fa-camera"></i><span>Camera preview</span></div>'}
            </div>
            <div style="margin-top:14px">
              <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:6px">
                <span>Live confidence</span><span id="camera-confidence">${this.cameraSignal.confidence}%</span>
              </div>
              <div class="progress-bar"><div id="camera-confidence-fill" class="progress-fill" style="width:${this.cameraSignal.confidence}%;background:var(--gradient-hack)"></div></div>
            </div>
          </div>

          <div class="card" id="meeting-feedback-card">
            ${this.renderMeetingFeedback()}
          </div>
        </div>
      </div>
    `;
    if (this.cameraStream) {
      setTimeout(() => {
        const video = document.getElementById('meeting-video');
        if (video) video.srcObject = this.cameraStream;
      }, 50);
    }
  },

  renderMeetingFeedback() {
    if (!this.meetingFeedback) {
      return `
        <h4 style="margin-bottom:12px"><i class="fas fa-face-meh" style="color:var(--accent-orange)"></i> Investor Emotion Analyzer</h4>
        <p style="font-size:0.82rem">Start the camera and analyze an answer to receive live investor emotion, answer score, and coaching feedback.</p>
        <div class="api-route" style="margin-top:16px">POST /api/ai/investor-emotion</div>
      `;
    }
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <h4>Investor Feedback</h4>
        <div class="ai-score"><i class="fas fa-brain"></i> ${this.meetingFeedback.score}%</div>
      </div>
      <div class="emotion-pill emotion-${this.meetingFeedback.sentiment}">
        <i class="fas fa-face-smile"></i> ${Utils.escapeHtml(this.meetingFeedback.emotion)}
      </div>
      <div class="ai-reason-list" style="margin-top:14px">
        ${this.meetingFeedback.feedback.map(item => `<div><i class="fas fa-comment-dots"></i> ${Utils.escapeHtml(item)}</div>`).join('')}
      </div>
      <div class="ai-next-step" style="margin-top:14px">${Utils.escapeHtml(this.meetingFeedback.followUp)}</div>
    `;
  },

  async startMeeting() {
    const id = document.getElementById('meeting-startup')?.value;
    const startup = DB.startups.find(s => String(s.id) === String(id)) || DB.startups[0];
    const res = await InnoVerseAIAPI.request('/api/ai/investor-questions', { startup });
    this.meetingQuestions = res.result;
    this.meetingIndex = 0;
    this.meetingFeedback = null;
    this.renderTab();
    Toast.info('Investor meeting started.');
  },

  nextMeetingQuestion() {
    if (!this.meetingQuestions.length) {
      Toast.info('Start the meeting first.');
      return;
    }
    this.meetingIndex = (this.meetingIndex + 1) % this.meetingQuestions.length;
    this.meetingFeedback = null;
    this.renderTab();
  },

  async analyzeMeetingAnswer() {
    const answer = document.getElementById('meeting-answer')?.value || '';
    if (answer.trim().length < 20) {
      Toast.warning('Add a fuller answer before analyzing.');
      return;
    }
    const question = this.meetingQuestions[this.meetingIndex] || '';
    const res = await InnoVerseAIAPI.request('/api/ai/investor-emotion', {
      answer,
      question,
      cameraSignal: this.cameraSignal
    });
    this.meetingFeedback = res.result;
    const card = document.getElementById('meeting-feedback-card');
    if (card) card.innerHTML = this.renderMeetingFeedback();
    const emotion = document.querySelector('.investor-emotion');
    if (emotion) emotion.textContent = this.meetingFeedback.emotion;
    Toast.success('Investor emotion analyzed.');
  },

  async startCamera() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        Toast.error('Camera is not available in this browser.');
        return;
      }
      this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      const video = document.getElementById('meeting-video');
      if (video) video.srcObject = this.cameraStream;
      this.startCameraLoop();
      this.renderTab();
      Toast.success('Camera started.');
    } catch (e) {
      Toast.error('Camera permission was blocked or unavailable.');
    }
  },

  startCameraLoop() {
    clearInterval(this.cameraTimer);
    this.cameraTimer = setInterval(() => this.readCameraSignal(), 900);
  },

  readCameraSignal() {
    const video = document.getElementById('meeting-video');
    const canvas = document.getElementById('meeting-canvas');
    if (!video || !canvas || !video.videoWidth) return;

    const w = 80;
    const h = Math.max(45, Math.round((video.videoHeight / video.videoWidth) * w));
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let brightness = 0;
    let movement = 0;

    for (let i = 0; i < data.length; i += 4) {
      const value = (data[i] + data[i + 1] + data[i + 2]) / 3;
      brightness += value;
      if (this.lastFrame) movement += Math.abs(value - this.lastFrame[i / 4]);
    }

    const pixels = data.length / 4;
    brightness = Math.round(brightness / pixels);
    movement = this.lastFrame ? Math.round(movement / pixels) : 12;
    this.lastFrame = Array.from({ length: pixels }, (_, idx) => {
      const i = idx * 4;
      return (data[i] + data[i + 1] + data[i + 2]) / 3;
    });

    const lightScore = Math.max(0, 100 - Math.abs(135 - brightness));
    const movementScore = Math.max(35, 100 - Math.min(65, movement * 3));
    const confidence = Math.max(20, Math.min(96, Math.round(lightScore * 0.55 + movementScore * 0.45)));
    this.cameraSignal = { confidence, brightness, movement };

    const label = document.getElementById('camera-confidence');
    const fill = document.getElementById('camera-confidence-fill');
    if (label) label.textContent = `${confidence}%`;
    if (fill) fill.style.width = `${confidence}%`;
  },

  stopCamera(showToast = true) {
    clearInterval(this.cameraTimer);
    this.cameraTimer = null;
    this.lastFrame = null;
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
      if (showToast) Toast.info('Camera stopped.');
    }
  },

  renderResumeOptimizer(el) {
    el.innerHTML = `
      <div class="ai-workbench">
        <div class="card">
          <h3 style="margin-bottom:4px">AI Resume & LinkedIn Optimizer</h3>
          <p style="font-size:0.85rem;margin-bottom:20px">Improve resume positioning, LinkedIn headline, summary, keywords, and role fit.</p>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Existing Profile</label>
              <select class="form-select" id="resume-profile">${this.optionList(DB.resumes, DB.resumes[0]?.id)}</select>
            </div>
            <div class="form-group">
              <label class="form-label">Target Role</label>
              <input class="form-input" id="resume-role" value="AI Product Engineer" placeholder="Target role"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Paste Resume or LinkedIn Text</label>
            <textarea class="form-textarea" id="resume-text" rows="5" placeholder="Paste text for extra optimization context..."></textarea>
          </div>
          <button class="btn btn-success" onclick="AIPage.optimizeResume()"><i class="fas fa-id-card"></i> Optimize Profile</button>
        </div>
        <div class="card">
          <h4 style="margin-bottom:12px"><i class="fas fa-link" style="color:var(--accent-green)"></i> Optimizes</h4>
          <div class="ai-reason-list">
            <div><i class="fas fa-check-circle"></i> Resume score and bullet framing</div>
            <div><i class="fas fa-check-circle"></i> LinkedIn headline and About section</div>
            <div><i class="fas fa-check-circle"></i> Skills and recruiter keywords</div>
          </div>
          <div class="api-route" style="margin-top:16px">POST /api/ai/resume-linkedin-optimizer</div>
        </div>
      </div>
      <div id="resume-results" class="ai-results">${this.resumeReport ? this.renderResumeResults() : this.renderEmpty('fa-id-card', 'Optimize a profile to see rewritten resume and LinkedIn guidance.')}</div>
    `;
  },

  async optimizeResume() {
    const id = document.getElementById('resume-profile')?.value;
    const resume = DB.resumes.find(r => String(r.id) === String(id)) || DB.resumes[0];
    const payload = {
      resume,
      targetRole: document.getElementById('resume-role')?.value,
      text: document.getElementById('resume-text')?.value
    };
    const box = document.getElementById('resume-results');
    if (box) box.innerHTML = this.renderLoading('Optimizing resume and LinkedIn');
    const res = await InnoVerseAIAPI.request('/api/ai/resume-linkedin-optimizer', payload);
    this.resumeReport = res.result;
    if (box) box.innerHTML = this.renderResumeResults();
    Toast.success('Resume and LinkedIn optimized.');
  },

  renderResumeResults() {
    return `
      <div class="ai-result-header">
        <div>
          <h3>Optimization Report</h3>
          <p>Score improved from ${this.resumeReport.originalScore}/100 to ${this.resumeReport.optimizedScore}/100.</p>
        </div>
        <div class="ai-score"><i class="fas fa-arrow-up"></i> +${this.resumeReport.optimizedScore - this.resumeReport.originalScore}</div>
      </div>
      <div class="grid-2">
        <div class="card">
          <h4 style="margin-bottom:12px">LinkedIn Headline</h4>
          <div class="optimized-copy">${Utils.escapeHtml(this.resumeReport.headline)}</div>
          <h4 style="margin:18px 0 12px">LinkedIn About</h4>
          <div class="optimized-copy">${Utils.escapeHtml(this.resumeReport.about)}</div>
        </div>
        <div class="card">
          <h4 style="margin-bottom:12px">Resume Fixes</h4>
          <div class="ai-reason-list">
            ${this.resumeReport.bullets.map(item => `<div><i class="fas fa-pen"></i> ${Utils.escapeHtml(item)}</div>`).join('')}
          </div>
          <h4 style="margin:18px 0 12px">Recruiter Keywords</h4>
          <div class="tags-container">${this.resumeReport.keywords.map(k => `<span class="tag">${Utils.escapeHtml(k)}</span>`).join('')}</div>
        </div>
      </div>
    `;
  },

  renderEmpty(icon, text) {
    return `
      <div class="empty-state">
        <i class="fas ${icon}"></i>
        <h3>Ready</h3>
        <p>${Utils.escapeHtml(text)}</p>
      </div>
    `;
  },

  renderLoading(text) {
    return `
      <div class="empty-state">
        <span class="spinner" style="margin:0 auto 16px"></span>
        <h3>${Utils.escapeHtml(text)}</h3>
        <p>Nova is processing platform signals.</p>
      </div>
    `;
  },

  injectStyles() {
    if (document.getElementById('ai-page-styles')) return;
    const s = document.createElement('style');
    s.id = 'ai-page-styles';
    s.textContent = `
.ai-tabs { overflow-x:auto; }
.ai-tabs .tab-btn { min-width:150px; white-space:nowrap; }
.ai-workbench { display:grid; grid-template-columns:1fr 320px; gap:24px; margin-bottom:24px; }
.ai-results { margin-top:8px; }
.api-route { font-family:monospace; font-size:0.78rem; color:var(--accent-purple-light); background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-md); padding:10px 12px; }
.ai-result-card,.risk-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; transition:var(--transition-slow); }
.ai-result-card:hover,.risk-card:hover { border-color:var(--border-hover); transform:translateY(-4px); box-shadow:var(--shadow-lg); }
.ai-card-top { display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:14px; }
.ai-reason-list { display:flex; flex-direction:column; gap:8px; }
.ai-reason-list div { display:flex; align-items:flex-start; gap:8px; font-size:0.82rem; color:var(--text-secondary); }
.ai-reason-list i { color:var(--accent-purple); margin-top:3px; width:14px; flex-shrink:0; }
.ai-next-step { font-size:0.82rem; color:var(--text-secondary); background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px; margin-top:14px; }
.ai-result-header { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:20px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; }
.deck-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px; }
.deck-slide { position:relative; min-height:260px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:22px; transition:var(--transition-slow); }
.deck-slide:hover { border-color:var(--border-hover); transform:translateY(-4px); box-shadow:var(--shadow-lg); }
.deck-slide-num { width:30px; height:30px; border-radius:var(--radius-md); background:var(--gradient-primary); color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:800; margin-bottom:14px; }
.deck-slide h3 { font-size:1rem; margin-bottom:12px; }
.deck-slide ul { padding-left:18px; color:var(--text-secondary); font-size:0.82rem; display:flex; flex-direction:column; gap:8px; margin-bottom:14px; }
.speaker-note { font-size:0.78rem; color:var(--text-muted); border-top:1px solid var(--border); padding-top:12px; margin-top:auto; }
.trend-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px; background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-md); margin-bottom:10px; }
.trend-name { font-size:0.9rem; font-weight:700; }
.trend-signal { font-size:0.78rem; color:var(--text-muted); margin-top:2px; }
.meeting-layout { display:grid; grid-template-columns:1fr 340px; gap:24px; }
.meeting-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:20px; }
.investor-screen { display:flex; align-items:center; gap:16px; background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-lg); padding:18px; margin-bottom:20px; }
.virtual-investor { width:64px; height:64px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem; color:#fff; background:var(--gradient-primary); box-shadow:var(--shadow-glow-purple); flex-shrink:0; }
.virtual-investor.positive { background:var(--gradient-hack); box-shadow:0 0 40px rgba(16,185,129,0.25); }
.virtual-investor.negative { background:var(--gradient-investor); box-shadow:0 0 40px rgba(239,68,68,0.2); }
.investor-emotion { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:1.1rem; margin-bottom:4px; }
.investor-question { color:var(--text-secondary); font-size:0.9rem; }
.camera-box { position:relative; aspect-ratio:4/3; background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; display:flex; align-items:center; justify-content:center; }
.camera-box video { width:100%; height:100%; object-fit:cover; transform:scaleX(-1); }
.camera-placeholder { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; color:var(--text-muted); background:var(--bg-secondary); }
.camera-placeholder i { font-size:2rem; opacity:0.5; }
.emotion-pill { display:inline-flex; align-items:center; gap:8px; padding:8px 14px; border-radius:var(--radius-full); font-size:0.82rem; font-weight:700; }
.emotion-positive { background:rgba(16,185,129,0.15); color:var(--accent-green); border:1px solid rgba(16,185,129,0.25); }
.emotion-neutral { background:rgba(245,158,11,0.15); color:var(--accent-orange); border:1px solid rgba(245,158,11,0.25); }
.emotion-negative { background:rgba(239,68,68,0.15); color:#f87171; border:1px solid rgba(239,68,68,0.25); }
.optimized-copy { background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-md); padding:14px; font-size:0.86rem; color:var(--text-secondary); line-height:1.6; }
@media(max-width:1100px) { .ai-workbench,.meeting-layout,.ai-trend-grid { grid-template-columns:1fr; } }
@media(max-width:700px) { .ai-result-header,.trend-row,.meeting-header { flex-direction:column; align-items:flex-start; } }
    `;
    document.head.appendChild(s);
  }
};
