// ===== NETWORK PAGE =====
const NetworkPage = {
  render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-wrapper">
        <div class="page-header">
          <h2>🌐 Campus Network</h2>
          <p>Connect with students, founders, mentors, and industry professionals across campuses.</p>
        </div>

        <!-- Search -->
        <div class="search-bar" style="max-width:500px;margin-bottom:28px">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search by name, skill, university..." oninput="NetworkPage.filterPeople(this.value)"/>
        </div>

        <!-- Skill Filters -->
        <div class="chip-filters" id="skill-filters">
          ${['All','React','Python','Machine Learning','Design','Blockchain','Flutter','IoT'].map(skill=>`
            <div class="chip ${skill==='All'?'active':''}" onclick="NetworkPage.filterBySkill('${skill}',this)">${skill}</div>
          `).join('')}
        </div>

        <!-- People Grid -->
        <div class="grid-auto" id="people-grid">
          ${this.renderPeople(DB.resumes)}
        </div>
      </div>
    `;
    this.injectStyles();
  },

  renderPeople(people) {
    return people.map(p => `
      <div class="person-card card-hover-lift">
        <div class="pc-header">
          ${Utils.renderAvatar(p.avatar, 'lg', p.name)}
          <div style="flex:1">
            <div class="pc-name">${p.name}</div>
            <div class="pc-uni">${p.university}</div>
            <div class="pc-degree">${p.degree} · ${p.year}</div>
          </div>
          <div class="ai-score"><i class="fas fa-brain"></i> ${p.aiScore}%</div>
        </div>
        ${p.bio ? `<p class="pc-bio">${p.bio}</p>` : ''}
        <div class="pc-skills">${p.skills.slice(0,4).map(s=>`<span class="tag">${s}</span>`).join('')}${p.skills.length>4?`<span class="tag">+${p.skills.length-4}</span>`:''}</div>
        <div class="pc-meta">
          <span><i class="fas fa-briefcase"></i> ${p.lookingFor}</span>
          <span><i class="fas fa-star"></i> GPA ${p.gpa}</span>
        </div>
        <div class="pc-footer">
          <div style="display:flex;gap:8px">
            ${p.linkedin?`<a href="#" class="btn btn-ghost btn-sm btn-icon" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`:''}
            ${p.github?`<a href="#" class="btn btn-ghost btn-sm btn-icon" title="GitHub"><i class="fab fa-github"></i></a>`:''}
          </div>
          <button class="btn btn-primary btn-sm" onclick="Toast.success('Connection request sent to ${p.name}!')">
            <i class="fas fa-user-plus"></i> Connect
          </button>
        </div>
      </div>
    `).join('');
  },

  filterPeople(query) {
    const q = query.toLowerCase();
    const filtered = DB.resumes.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.university.toLowerCase().includes(q) ||
      p.skills.some(s => s.toLowerCase().includes(q))
    );
    document.getElementById('people-grid').innerHTML = this.renderPeople(filtered);
  },

  filterBySkill(skill, el) {
    document.querySelectorAll('#skill-filters .chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    const filtered = skill === 'All' ? DB.resumes : DB.resumes.filter(p =>
      p.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
    document.getElementById('people-grid').innerHTML = this.renderPeople(filtered);
  },

  injectStyles() {
    if (document.getElementById('network-styles')) return;
    const s = document.createElement('style');
    s.id = 'network-styles';
    s.textContent = `
.person-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; transition:var(--transition-slow); }
.person-card:hover { border-color:var(--border-hover); transform:translateY(-4px); box-shadow:var(--shadow-lg); }
.pc-header { display:flex; align-items:flex-start; gap:14px; margin-bottom:14px; }
.pc-name { font-size:1rem; font-weight:700; }
.pc-uni { font-size:0.8rem; color:var(--text-secondary); margin-top:2px; }
.pc-degree { font-size:0.75rem; color:var(--text-muted); margin-top:2px; }
.pc-bio { font-size:0.82rem; color:var(--text-secondary); margin-bottom:12px; line-height:1.5; }
.pc-skills { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; }
.pc-meta { display:flex; gap:12px; font-size:0.78rem; color:var(--text-muted); margin-bottom:14px; }
.pc-meta span { display:flex; align-items:center; gap:4px; }
.pc-footer { display:flex; align-items:center; justify-content:space-between; }
    `;
    document.head.appendChild(s);
  }
};
