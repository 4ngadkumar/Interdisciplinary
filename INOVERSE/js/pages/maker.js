// ===== MAKER HUB PAGE =====
const MakerPage = {
  activeTab: 'startup',
  uploadedResume: null,
  ideaCheckResult: null,

  render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-wrapper">
        <div class="page-header">
          <h2>🚀 Maker Hub</h2>
          <p>Register your startup or upload your resume to get discovered by investors and recruiters.</p>
        </div>
        <div class="tabs" style="margin-bottom:28px" id="maker-tabs">
          <button class="tab-btn ${this.activeTab==='startup'?'active':''}" onclick="MakerPage.switchTab('startup')">
            <i class="fas fa-rocket"></i> Register Startup
          </button>
          <button class="tab-btn ${this.activeTab==='resume'?'active':''}" onclick="MakerPage.switchTab('resume')">
            <i class="fas fa-file-alt"></i> Upload Resume
          </button>
          <button class="tab-btn ${this.activeTab==='mystartups'?'active':''}" onclick="MakerPage.switchTab('mystartups')">
            <i class="fas fa-list"></i> My Startups
          </button>
        </div>
        <div id="maker-tab-content"></div>
      </div>
    `;
    this.renderTab();
    this.injectStyles();
  },

  switchTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('#maker-tabs .tab-btn').forEach((b,i) => {
      b.classList.toggle('active', ['startup','resume','mystartups'][i] === tab);
    });
    this.renderTab();
  },

  renderTab() {
    const el = document.getElementById('maker-tab-content');
    if (this.activeTab === 'startup') this.renderStartupForm(el);
    else if (this.activeTab === 'resume') this.renderResumeUpload(el);
    else this.renderMyStartups(el);
  },

  renderStartupForm(el) {
    el.innerHTML = `
      <div class="maker-grid">
        <div class="maker-form-col">
          <div class="card">
            <h3 style="margin-bottom:4px">Register Your Startup</h3>
            <p style="font-size:0.85rem;margin-bottom:24px">Fill in the details below. Our AI will check for similar existing ideas.</p>
            <div id="idea-warning"></div>
            <div class="form-group">
              <label class="form-label">Startup Name *</label>
              <input type="text" class="form-input" id="s-name" placeholder="e.g. EduAI, GreenRoute..." oninput="MakerPage.onIdeaInput()"/>
            </div>
            <div class="form-group">
              <label class="form-label">One-line Tagline *</label>
              <input type="text" class="form-input" id="s-tagline" placeholder="What does your startup do in one sentence?"/>
            </div>
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" id="s-category" onchange="MakerPage.onIdeaInput()">
                <option value="">Select category</option>
                ${['EdTech','FinTech','HealthTech','CleanTech','AgriTech','SaaS','E-Commerce','Social','Gaming','Other'].map(c=>`<option>${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Description *</label>
              <textarea class="form-textarea" id="s-desc" rows="4" placeholder="Describe your startup, the problem it solves, and your solution..." oninput="MakerPage.onIdeaInput()"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Funding Stage</label>
              <select class="form-select" id="s-stage">
                ${['Idea','Pre-Seed','Seed','Series A','Series B'].map(s=>`<option>${s}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Funding Goal (₹)</label>
              <input type="number" class="form-input" id="s-goal" placeholder="e.g. 500000"/>
            </div>
            <div class="form-group">
              <label class="form-label">Skills Needed (comma separated)</label>
              <input type="text" class="form-input" id="s-skills" placeholder="React, Python, ML, Design..."/>
            </div>
            <div class="form-group">
              <label class="form-label">Roles You're Hiring For</label>
              <input type="text" class="form-input" id="s-roles" placeholder="ML Engineer, Designer, Marketing Lead..."/>
            </div>
            <div id="uniqueness-suggestions"></div>
            <button class="btn btn-maker" style="width:100%;justify-content:center;margin-top:8px" onclick="MakerPage.submitStartup()">
              <i class="fas fa-rocket"></i> Register Startup
            </button>
          </div>
        </div>
        <div class="maker-info-col">
          <div class="card" style="margin-bottom:20px">
            <h4 style="margin-bottom:12px"><i class="fas fa-brain" style="color:var(--accent-purple)"></i> AI Idea Checker</h4>
            <p style="font-size:0.85rem;margin-bottom:16px">As you type, our AI scans the database for similar ideas and warns you about potential duplicates.</p>
            <div id="ai-checker-status" class="ai-checker-idle">
              <i class="fas fa-search"></i>
              <span>Start typing to activate AI checker</span>
            </div>
          </div>
          <div class="card" style="margin-bottom:20px">
            <h4 style="margin-bottom:12px"><i class="fas fa-lightbulb" style="color:var(--accent-orange)"></i> Tips for Success</h4>
            <ul class="tips-list">
              <li><i class="fas fa-check-circle"></i> Be specific about your target market</li>
              <li><i class="fas fa-check-circle"></i> Highlight what makes you unique</li>
              <li><i class="fas fa-check-circle"></i> Include traction or early validation</li>
              <li><i class="fas fa-check-circle"></i> Mention your team's relevant experience</li>
              <li><i class="fas fa-check-circle"></i> Set a realistic funding goal</li>
            </ul>
          </div>
          <div class="card">
            <h4 style="margin-bottom:12px"><i class="fas fa-chart-bar" style="color:var(--accent-cyan)"></i> Platform Stats</h4>
            <div class="mini-stats">
              <div class="mini-stat"><span>${DB.startups.length}</span><small>Startups</small></div>
              <div class="mini-stat"><span>${DB.investors.length}</span><small>Investors</small></div>
              <div class="mini-stat"><span>₹4.2Cr</span><small>Raised</small></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  onIdeaInput: Utils.debounce ? null : null,

  _checkIdea() {
    const name = document.getElementById('s-name')?.value || '';
    const desc = document.getElementById('s-desc')?.value || '';
    const cat = document.getElementById('s-category')?.value || '';
    if (name.length < 3 && desc.length < 10) return;

    const result = AIEngine.checkIdeaSimilarity(name, desc, cat);
    this.ideaCheckResult = result;

    const warningEl = document.getElementById('idea-warning');
    const statusEl = document.getElementById('ai-checker-status');
    const suggestEl = document.getElementById('uniqueness-suggestions');

    if (result.isDuplicate) {
      warningEl.innerHTML = `
        <div class="warning-banner">
          <i class="fas fa-exclamation-triangle"></i>
          <div>
            <p><strong>Similar idea detected!</strong> ${result.warning}</p>
            <p style="margin-top:6px;font-size:0.8rem">You can still proceed, but make sure your idea has a unique angle. See suggestions below.</p>
          </div>
        </div>
      `;
      statusEl.innerHTML = `<div class="ai-checker-warning"><i class="fas fa-exclamation-circle"></i> ${result.similarity}% similar to "${result.matchedStartup?.name}"</div>`;
      const suggestions = AIEngine.suggestDifferentiators(name, desc);
      suggestEl.innerHTML = `
        <div class="card" style="background:rgba(124,58,237,0.05);border-color:rgba(124,58,237,0.2);margin-bottom:16px">
          <h4 style="margin-bottom:12px;font-size:0.9rem"><i class="fas fa-magic" style="color:var(--accent-purple)"></i> AI Differentiation Suggestions</h4>
          ${suggestions.map(s => `<div class="suggestion-item"><i class="fas fa-arrow-right"></i> ${s}</div>`).join('')}
        </div>
      `;
    } else if (name.length > 2 || desc.length > 10) {
      warningEl.innerHTML = `
        <div class="success-banner">
          <i class="fas fa-check-circle"></i>
          <p><strong>Idea looks unique!</strong> No significant overlap found with existing startups.</p>
        </div>
      `;
      statusEl.innerHTML = `<div class="ai-checker-ok"><i class="fas fa-check-circle"></i> Unique idea — no duplicates found</div>`;
      suggestEl.innerHTML = '';
    }
  },

  submitStartup() {
    const name = document.getElementById('s-name')?.value?.trim();
    const tagline = document.getElementById('s-tagline')?.value?.trim();
    const category = document.getElementById('s-category')?.value;
    const desc = document.getElementById('s-desc')?.value?.trim();
    const stage = document.getElementById('s-stage')?.value;
    const goal = parseInt(document.getElementById('s-goal')?.value) || 100000;
    const skills = document.getElementById('s-skills')?.value?.split(',').map(s=>s.trim()).filter(Boolean);
    const roles = document.getElementById('s-roles')?.value?.split(',').map(s=>s.trim()).filter(Boolean);

    if (!name || !tagline || !category || !desc) { Toast.error('Please fill all required fields'); return; }

    const user = Store.get('currentUser');
    const newStartup = {
      id: Date.now(), name, tagline, description: desc, category, stage,
      fundingGoal: goal, raised: 0, founder: user?.name || 'You',
      founderAvatar: user?.avatar || 'U', university: user?.university || '',
      skills: skills || [], teamSize: 1, lookingFor: roles || [],
      tags: [category], verified: false, featured: false,
      upvotes: 0, views: 0, createdAt: new Date().toISOString().split('T')[0],
      keywords: name.toLowerCase().split(' ').concat(desc.toLowerCase().split(' ').slice(0,5))
    };

    DB.startups.push(newStartup);
    Toast.success(`"${name}" registered successfully! 🚀`);
    this.switchTab('mystartups');
  },

  renderResumeUpload(el) {
    el.innerHTML = `
      <div class="maker-grid">
        <div class="maker-form-col">
          <div class="card">
            <h3 style="margin-bottom:4px">Upload Your Resume</h3>
            <p style="font-size:0.85rem;margin-bottom:24px">Our AI will score your resume and match it to relevant recruiters automatically.</p>
            <div class="upload-zone" id="resume-drop-zone" onclick="document.getElementById('resume-file').click()">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Drag & drop your resume here or <span>browse files</span></p>
              <p style="font-size:0.75rem;color:var(--text-muted);margin-top:8px">Supports PDF, DOC, DOCX (Max 5MB)</p>
              <input type="file" id="resume-file" accept=".pdf,.doc,.docx" style="display:none" onchange="MakerPage.handleResumeUpload(event)"/>
            </div>
            <div id="resume-preview" style="display:none"></div>
            <div class="divider-text" style="margin:20px 0">or fill manually</div>
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="r-name" placeholder="Your full name"/>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">University *</label>
                <input type="text" class="form-input" id="r-uni" placeholder="IIT Delhi..."/>
              </div>
              <div class="form-group">
                <label class="form-label">Degree</label>
                <input type="text" class="form-input" id="r-degree" placeholder="B.Tech CS"/>
              </div>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Year</label>
                <select class="form-select" id="r-year">
                  <option>1st Year</option><option>2nd Year</option>
                  <option>3rd Year</option><option>4th Year</option><option>Final Year</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">GPA / CGPA</label>
                <input type="number" class="form-input" id="r-gpa" placeholder="8.5" step="0.1" min="0" max="10"/>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Skills (comma separated) *</label>
              <input type="text" class="form-input" id="r-skills" placeholder="React, Python, Machine Learning, Figma..."/>
            </div>
            <div class="form-group">
              <label class="form-label">Preferred Roles</label>
              <input type="text" class="form-input" id="r-roles" placeholder="Software Engineer, ML Engineer..."/>
            </div>
            <div class="form-group">
              <label class="form-label">Experience (one per line)</label>
              <textarea class="form-textarea" id="r-exp" rows="3" placeholder="SDE Intern @ Google&#10;Research Intern @ IISc"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Looking For</label>
              <select class="form-select" id="r-looking">
                <option>Full-time</option><option>Internship</option>
                <option>Full-time / Internship</option><option>Co-founder</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Availability</label>
              <input type="text" class="form-input" id="r-avail" placeholder="Immediate / June 2024..."/>
            </div>
            <button class="btn btn-success" style="width:100%;justify-content:center;margin-top:8px" onclick="MakerPage.submitResume()">
              <i class="fas fa-paper-plane"></i> Submit Resume for AI Screening
            </button>
          </div>
        </div>
        <div class="maker-info-col">
          <div class="card" style="margin-bottom:20px">
            <h4 style="margin-bottom:12px"><i class="fas fa-robot" style="color:var(--accent-green)"></i> How AI Screening Works</h4>
            <div class="ai-steps">
              <div class="ai-step"><div class="ai-step-num">1</div><div><strong>Upload</strong><p>Submit your resume or fill the form</p></div></div>
              <div class="ai-step"><div class="ai-step-num">2</div><div><strong>AI Scores</strong><p>Our AI evaluates skills, experience, GPA, and projects</p></div></div>
              <div class="ai-step"><div class="ai-step-num">3</div><div><strong>Match</strong><p>Matched to recruiters based on their requirements</p></div></div>
              <div class="ai-step"><div class="ai-step-num">4</div><div><strong>Discover</strong><p>Recruiters see only relevant, AI-filtered profiles</p></div></div>
            </div>
          </div>
          <div class="card">
            <h4 style="margin-bottom:12px"><i class="fas fa-users" style="color:var(--accent-blue)"></i> Active Recruiters</h4>
            ${DB.recruiters.map(r => `
              <div class="recruiter-mini-card">
                ${Utils.renderAvatar(r.avatar, 'sm', r.company)}
                <div style="flex:1">
                  <div style="font-size:0.85rem;font-weight:600">${r.company}</div>
                  <div style="font-size:0.72rem;color:var(--text-muted)">${r.openings} openings · ${r.requirements.roles.slice(0,2).join(', ')}</div>
                </div>
                <span class="badge badge-green">${r.verified ? 'Verified' : ''}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    this.setupDragDrop();
  },

  setupDragDrop() {
    const zone = document.getElementById('resume-drop-zone');
    if (!zone) return;
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) this.processResumeFile(file);
    });
  },

  handleResumeUpload(e) {
    const file = e.target.files[0];
    if (file) this.processResumeFile(file);
  },

  processResumeFile(file) {
    const preview = document.getElementById('resume-preview');
    preview.style.display = 'block';
    preview.innerHTML = `
      <div class="resume-file-card">
        <i class="fas fa-file-pdf" style="color:var(--accent-red);font-size:1.5rem"></i>
        <div style="flex:1">
          <div style="font-size:0.875rem;font-weight:600">${file.name}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${(file.size/1024).toFixed(0)} KB · Uploaded</div>
        </div>
        <span class="badge badge-green"><i class="fas fa-check"></i> Ready</span>
      </div>
    `;
    this.uploadedResume = file;
    Toast.success('Resume uploaded! Fill in the details below and submit.');
  },

  submitResume() {
    const name = document.getElementById('r-name')?.value?.trim();
    const uni = document.getElementById('r-uni')?.value?.trim();
    const skills = document.getElementById('r-skills')?.value?.split(',').map(s=>s.trim()).filter(Boolean);
    const gpa = parseFloat(document.getElementById('r-gpa')?.value) || 8.0;

    if (!name || !uni || !skills?.length) { Toast.error('Please fill name, university, and skills'); return; }

    const roles = document.getElementById('r-roles')?.value?.split(',').map(s=>s.trim()).filter(Boolean) || [];
    const exp = document.getElementById('r-exp')?.value?.split('\n').filter(Boolean) || [];
    const degree = document.getElementById('r-degree')?.value || '';
    const year = document.getElementById('r-year')?.value || '3rd Year';
    const looking = document.getElementById('r-looking')?.value || 'Full-time';
    const avail = document.getElementById('r-avail')?.value || 'Immediate';

    const resume = {
      id: Date.now(), name, avatar: Utils.getInitials(name),
      university: uni, degree, year, skills, experience: exp,
      projects: [], gpa, lookingFor: looking, preferredRoles: roles,
      availability: avail, aiScore: AIEngine.scoreResume({ skills, experience: exp, projects: [], gpa, linkedin: '', github: '' }),
      tags: [], bio: '', linkedin: '', github: '',
      uploadedAt: new Date().toISOString().split('T')[0], status: 'active'
    };

    DB.resumes.push(resume);

    // Show AI match results
    this.showResumeMatchResults(resume);
  },

  showResumeMatchResults(resume) {
    const matches = DB.recruiters.map(r => ({
      recruiter: r,
      match: AIEngine.scoreResumeForRecruiter(resume, r)
    })).sort((a,b) => b.match.score - a.match.score);

    Modal.open(`
      <div style="text-align:center;margin-bottom:24px">
        <div style="font-size:3rem;margin-bottom:8px">🎉</div>
        <h3 class="modal-title">Resume Submitted!</h3>
        <p class="modal-subtitle">AI Score: <strong style="color:var(--accent-purple)">${resume.aiScore}/100</strong> · Matched to ${matches.filter(m=>m.match.recommended).length} recruiters</p>
      </div>
      <div class="progress-bar" style="margin-bottom:24px">
        <div class="progress-fill" style="width:${resume.aiScore}%;background:${resume.aiScore>=80?'var(--gradient-hack)':resume.aiScore>=60?'var(--gradient-primary)':'var(--gradient-investor)'}"></div>
      </div>
      <h4 style="margin-bottom:16px">AI Recruiter Matches</h4>
      ${matches.map(m => `
        <div class="match-result-card ${m.match.recommended ? 'match-recommended' : ''}">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
            ${Utils.renderAvatar(m.recruiter.avatar, 'sm', m.recruiter.company)}
            <div style="flex:1">
              <div style="font-size:0.9rem;font-weight:600">${m.recruiter.company}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${m.recruiter.openings} openings</div>
            </div>
            <div class="ai-score"><i class="fas fa-brain"></i> ${m.match.score}%</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span class="badge ${m.match.score>=80?'badge-green':m.match.score>=60?'badge-blue':'badge-orange'}">${m.match.label}</span>
            ${m.match.recommended ? '<span class="badge badge-purple"><i class="fas fa-check"></i> Recommended</span>' : ''}
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted)">${m.match.reasons.slice(0,2).join(' · ')}</div>
        </div>
      `).join('')}
      <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:20px" onclick="Modal.close()">
        <i class="fas fa-check"></i> Done
      </button>
    `, 'modal-box-lg');
    Toast.success('Resume submitted and AI screening complete!');
  },

  renderMyStartups(el) {
    const user = Store.get('currentUser');
    const myStartups = DB.startups.slice(-3); // Show last 3 as "mine" for demo
    el.innerHTML = `
      <div class="page-header" style="margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3>My Registered Startups</h3>
          <button class="btn btn-maker btn-sm" onclick="MakerPage.switchTab('startup')"><i class="fas fa-plus"></i> New Startup</button>
        </div>
      </div>
      ${myStartups.length === 0 ? `
        <div class="empty-state">
          <i class="fas fa-rocket"></i>
          <h3>No startups yet</h3>
          <p>Register your first startup to get discovered by investors.</p>
          <button class="btn btn-primary" style="margin-top:16px" onclick="MakerPage.switchTab('startup')">Register Startup</button>
        </div>
      ` : `
        <div class="grid-auto">
          ${myStartups.map(s => this.renderStartupCard(s)).join('')}
        </div>
      `}
    `;
  },

  renderStartupCard(s) {
    const pct = Utils.fundingProgress(s.raised, s.fundingGoal);
    const insights = AIEngine.generateStartupInsights(s);
    return `
      <div class="startup-card card-hover-lift">
        <div class="sc-header">
          <div style="display:flex;align-items:center;gap:12px;flex:1">
            ${Utils.renderAvatar(s.founderAvatar, 'md', s.name)}
            <div>
              <div class="sc-name">${s.name} ${s.verified?'<i class="fas fa-check-circle" style="color:var(--accent-blue);font-size:0.75rem"></i>':''}</div>
              <div class="sc-founder">${s.founder} · ${s.university}</div>
            </div>
          </div>
          <span class="badge ${Utils.stageBadge(s.stage)}">${s.stage}</span>
        </div>
        <p class="sc-tagline">${s.tagline}</p>
        <div class="sc-tags">${s.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div class="sc-funding">
          <div class="sc-funding-row">
            <span style="font-size:0.8rem;color:var(--text-muted)">Funding</span>
            <span style="font-size:0.8rem;font-weight:600;color:var(--accent-green)">${pct}%</span>
          </div>
          <div class="progress-bar" style="margin:6px 0"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-muted)">
            <span>${Utils.formatCurrency(s.raised)} raised</span><span>of ${Utils.formatCurrency(s.fundingGoal)}</span>
          </div>
        </div>
        ${insights.length > 0 ? `
          <div class="sc-insights">
            ${insights.slice(0,2).map(i=>`
              <div class="insight-item insight-${i.type}">
                <i class="fas ${i.type==='positive'?'fa-arrow-up':i.type==='warning'?'fa-exclamation':'fa-info-circle'}"></i>
                <span>${i.text}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div class="sc-footer">
          <div class="sc-stats">
            <span><i class="fas fa-heart"></i> ${s.upvotes}</span>
            <span><i class="fas fa-eye"></i> ${Utils.formatNumber(s.views)}</span>
            <span><i class="fas fa-users"></i> ${s.teamSize}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="MakerPage.viewStartupDetail(${s.id})">View Details</button>
        </div>
      </div>
    `;
  },

  viewStartupDetail(id) {
    const s = DB.startups.find(x => x.id === id);
    if (!s) return;
    const pct = Utils.fundingProgress(s.raised, s.fundingGoal);
    Modal.open(`
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
        ${Utils.renderAvatar(s.founderAvatar, 'lg', s.name)}
        <div>
          <h3 class="modal-title" style="margin-bottom:4px">${s.name}</h3>
          <p style="font-size:0.875rem">${s.tagline}</p>
          <div style="display:flex;gap:8px;margin-top:8px">
            <span class="badge ${Utils.stageBadge(s.stage)}">${s.stage}</span>
            <span class="badge badge-blue">${s.category}</span>
            ${s.verified?'<span class="badge badge-green"><i class="fas fa-check"></i> Verified</span>':''}
          </div>
        </div>
      </div>
      <p style="margin-bottom:20px">${s.description}</p>
      <div class="sc-funding" style="margin-bottom:20px">
        <div class="sc-funding-row"><span>Funding Progress</span><span style="color:var(--accent-green);font-weight:600">${pct}%</span></div>
        <div class="progress-bar" style="margin:8px 0"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-muted)">
          <span>${Utils.formatCurrency(s.raised)} raised</span><span>Goal: ${Utils.formatCurrency(s.fundingGoal)}</span>
        </div>
      </div>
      <div class="grid-2" style="margin-bottom:16px">
        <div><strong style="font-size:0.8rem;color:var(--text-muted)">FOUNDER</strong><p style="font-size:0.9rem;margin-top:4px">${s.founder}</p></div>
        <div><strong style="font-size:0.8rem;color:var(--text-muted)">UNIVERSITY</strong><p style="font-size:0.9rem;margin-top:4px">${s.university}</p></div>
        <div><strong style="font-size:0.8rem;color:var(--text-muted)">TEAM SIZE</strong><p style="font-size:0.9rem;margin-top:4px">${s.teamSize} members</p></div>
        <div><strong style="font-size:0.8rem;color:var(--text-muted)">REGISTERED</strong><p style="font-size:0.9rem;margin-top:4px">${s.createdAt}</p></div>
      </div>
      ${s.skills.length?`<div style="margin-bottom:16px"><strong style="font-size:0.8rem;color:var(--text-muted)">SKILLS NEEDED</strong><div class="tags-container" style="margin-top:8px">${s.skills.map(sk=>`<span class="tag">${sk}</span>`).join('')}</div></div>`:''}
      ${s.lookingFor.length?`<div><strong style="font-size:0.8rem;color:var(--text-muted)">HIRING FOR</strong><div class="tags-container" style="margin-top:8px">${s.lookingFor.map(r=>`<span class="badge badge-purple">${r}</span>`).join('')}</div></div>`:''}
      <div style="display:flex;gap:10px;margin-top:24px">
        <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="Toast.success('Interest sent to ${s.founder}!');Modal.close()"><i class="fas fa-handshake"></i> Express Interest</button>
        <button class="btn btn-secondary" onclick="Modal.close()">Close</button>
      </div>
    `, 'modal-box-lg');
  },

  injectStyles() {
    if (document.getElementById('maker-styles')) return;
    const s = document.createElement('style');
    s.id = 'maker-styles';
    s.textContent = `
.maker-grid { display:grid; grid-template-columns:1fr 340px; gap:24px; }
.maker-form-col {} .maker-info-col {}
.ai-checker-idle,.ai-checker-ok,.ai-checker-warning {
  display:flex; align-items:center; gap:10px; padding:12px;
  border-radius:var(--radius-md); font-size:0.85rem;
}
.ai-checker-idle { background:var(--bg-secondary); color:var(--text-muted); }
.ai-checker-ok { background:rgba(16,185,129,0.1); color:var(--accent-green); }
.ai-checker-warning { background:rgba(245,158,11,0.1); color:var(--accent-orange); }
.tips-list { list-style:none; display:flex; flex-direction:column; gap:8px; }
.tips-list li { display:flex; align-items:center; gap:8px; font-size:0.82rem; color:var(--text-secondary); }
.tips-list li i { color:var(--accent-green); font-size:0.7rem; }
.mini-stats { display:flex; gap:16px; }
.mini-stat { text-align:center; flex:1; }
.mini-stat span { display:block; font-size:1.3rem; font-weight:800; font-family:'Space Grotesk',sans-serif; }
.mini-stat small { font-size:0.72rem; color:var(--text-muted); }
.suggestion-item { display:flex; align-items:flex-start; gap:8px; font-size:0.82rem; color:var(--text-secondary); margin-bottom:8px; }
.suggestion-item i { color:var(--accent-purple); margin-top:2px; flex-shrink:0; }
.ai-steps { display:flex; flex-direction:column; gap:12px; }
.ai-step { display:flex; align-items:flex-start; gap:12px; }
.ai-step-num {
  width:24px; height:24px; border-radius:50%; background:var(--gradient-primary);
  display:flex; align-items:center; justify-content:center; font-size:0.72rem;
  font-weight:700; color:#fff; flex-shrink:0;
}
.ai-step strong { display:block; font-size:0.85rem; }
.ai-step p { font-size:0.78rem; color:var(--text-muted); margin-top:2px; }
.recruiter-mini-card { display:flex; align-items:center; gap:10px; padding:10px; background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-md); margin-bottom:8px; }
.resume-file-card { display:flex; align-items:center; gap:12px; padding:14px; background:rgba(16,185,129,0.05); border:1px solid rgba(16,185,129,0.2); border-radius:var(--radius-md); margin-top:16px; }
.startup-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; transition:var(--transition-slow); }
.startup-card:hover { border-color:var(--border-hover); transform:translateY(-4px); box-shadow:var(--shadow-lg); }
.sc-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.sc-name { font-size:0.95rem; font-weight:700; display:flex; align-items:center; gap:6px; }
.sc-founder { font-size:0.75rem; color:var(--text-muted); margin-top:2px; }
.sc-tagline { font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px; }
.sc-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }
.sc-funding { margin-bottom:14px; }
.sc-funding-row { display:flex; justify-content:space-between; margin-bottom:4px; }
.sc-insights { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
.insight-item { display:flex; align-items:center; gap:8px; font-size:0.78rem; padding:6px 10px; border-radius:var(--radius-sm); }
.insight-positive { background:rgba(16,185,129,0.1); color:var(--accent-green); }
.insight-warning { background:rgba(245,158,11,0.1); color:var(--accent-orange); }
.insight-info { background:rgba(37,99,235,0.1); color:var(--accent-blue-light); }
.sc-footer { display:flex; align-items:center; justify-content:space-between; }
.sc-stats { display:flex; gap:12px; font-size:0.78rem; color:var(--text-muted); }
.sc-stats span { display:flex; align-items:center; gap:4px; }
.match-result-card { background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-md); padding:14px; margin-bottom:10px; }
.match-recommended { border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.05); }
@media(max-width:900px) { .maker-grid { grid-template-columns:1fr; } }
    `;
    document.head.appendChild(s);
  }
};

// Setup debounced idea check after page loads
document.addEventListener('DOMContentLoaded', () => {
  MakerPage.onIdeaInput = Utils.debounce(() => MakerPage._checkIdea(), 600);
});
