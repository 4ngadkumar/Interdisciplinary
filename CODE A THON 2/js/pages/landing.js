// ===== LANDING PAGE =====
const LandingPage = {
  render() {
    const el = document.getElementById('page-landing');
    el.innerHTML = `
      <div class="landing-wrapper">
        <!-- Navbar -->
        <nav class="landing-nav">
          <div class="landing-nav-inner">
            <div class="landing-logo">
              <div class="logo-icon"><i class="fas fa-infinity"></i></div>
              <span>InnoVerse</span>
            </div>
            <div class="landing-nav-links">
              <a href="#features">Features</a>
              <a href="#ecosystem">Ecosystem</a>
              <a href="#stats">Stats</a>
            </div>
            <div class="landing-nav-actions">
              <button class="btn btn-ghost btn-sm" onclick="AuthPage.show('login')">Sign In</button>
              <button class="btn btn-primary btn-sm" onclick="AuthPage.show('register')">Get Started</button>
            </div>
          </div>
        </nav>

        <!-- Hero -->
        <section class="hero-section">
          <div class="hero-orb hero-orb-1"></div>
          <div class="hero-orb hero-orb-2"></div>
          <div class="hero-orb hero-orb-3"></div>
          <div class="hero-content">
            <div class="hero-badge animate-fadeInDown">
              <i class="fas fa-bolt"></i> AI-Powered Campus Innovation
            </div>
            <h1 class="hero-title animate-fadeInUp delay-1">
              Where Student<br/>
              <span class="gradient-text">Ideas Become</span><br/>
              Startups
            </h1>
            <p class="hero-subtitle animate-fadeInUp delay-2">
              Connect with co-founders, find investors, showcase your skills,<br/>
              and compete in hackathons — all in one ecosystem.
            </p>
            <div class="hero-actions animate-fadeInUp delay-3">
              <button class="btn btn-primary btn-lg" onclick="AuthPage.show('register')">
                <i class="fas fa-rocket"></i> Launch Your Journey
              </button>
              <button class="btn btn-secondary btn-lg" onclick="AuthPage.show('login')">
                <i class="fas fa-play"></i> Explore Platform
              </button>
            </div>
            <div class="hero-stats animate-fadeInUp delay-4">
              <div class="hero-stat"><span class="hero-stat-num">2,400+</span><span>Students</span></div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat"><span class="hero-stat-num">180+</span><span>Startups</span></div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat"><span class="hero-stat-num">₹4.2Cr</span><span>Raised</span></div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat"><span class="hero-stat-num">48</span><span>Hackathons</span></div>
            </div>
          </div>
          <div class="hero-visual animate-fadeInRight delay-2">
            <div class="hero-card-stack">
              <div class="floating-card card-1">
                <div class="fc-header">
                  <div class="avatar avatar-sm" style="background:var(--gradient-primary)">AM</div>
                  <div><div class="fc-name">EduAI</div><div class="fc-sub">EdTech · Seed</div></div>
                </div>
                <div class="fc-progress">
                  <div class="fc-progress-label"><span>Funding</span><span>64%</span></div>
                  <div class="progress-bar"><div class="progress-fill" style="width:64%"></div></div>
                </div>
              </div>
              <div class="floating-card card-2">
                <i class="fas fa-brain" style="color:var(--accent-purple);font-size:1.2rem"></i>
                <div class="fc-ai-text">AI Match Score</div>
                <div class="fc-ai-score">94%</div>
              </div>
              <div class="floating-card card-3">
                <div class="fc-hack-badge"><i class="fas fa-code"></i> HackIndia 2024</div>
                <div class="fc-hack-prize">₹10,00,000 Prize</div>
                <div class="fc-hack-days">Deadline in 5 days</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Role Cards -->
        <section class="roles-section" id="ecosystem">
          <div class="section-inner">
            <div class="section-label">WHO IS IT FOR</div>
            <h2 class="section-title">Built for Every <span class="gradient-text">Innovator</span></h2>
            <p class="section-subtitle">Whether you're building, funding, or hiring — InnoVerse has your back.</p>
            <div class="roles-grid">
              <div class="role-feature-card maker-card" onclick="AuthPage.show('register')">
                <div class="rfc-icon maker-icon"><i class="fas fa-rocket"></i></div>
                <h3>Maker</h3>
                <p>Register your startup, upload your resume, find co-founders, and get discovered by investors and recruiters.</p>
                <ul class="rfc-list">
                  <li><i class="fas fa-check"></i> Register & pitch your startup</li>
                  <li><i class="fas fa-check"></i> AI duplicate idea detection</li>
                  <li><i class="fas fa-check"></i> Resume upload for recruiters</li>
                  <li><i class="fas fa-check"></i> Team formation tools</li>
                </ul>
                <div class="rfc-cta">Start Building <i class="fas fa-arrow-right"></i></div>
              </div>
              <div class="role-feature-card investor-card" onclick="AuthPage.show('register')">
                <div class="rfc-icon investor-icon"><i class="fas fa-chart-line"></i></div>
                <h3>Investor</h3>
                <p>Discover vetted student startups, review AI-matched opportunities, and connect with the next generation of founders.</p>
                <ul class="rfc-list">
                  <li><i class="fas fa-check"></i> AI-curated startup feed</li>
                  <li><i class="fas fa-check"></i> Verified startup profiles</li>
                  <li><i class="fas fa-check"></i> Direct founder connect</li>
                  <li><i class="fas fa-check"></i> Portfolio tracking</li>
                </ul>
                <div class="rfc-cta">Start Investing <i class="fas fa-arrow-right"></i></div>
              </div>
              <div class="role-feature-card recruiter-card" onclick="AuthPage.show('register')">
                <div class="rfc-icon recruiter-icon"><i class="fas fa-users"></i></div>
                <h3>Recruiter</h3>
                <p>Access AI-screened student resumes matched to your exact requirements. Hire top campus talent faster.</p>
                <ul class="rfc-list">
                  <li><i class="fas fa-check"></i> AI resume screening</li>
                  <li><i class="fas fa-check"></i> Skill-based matching</li>
                  <li><i class="fas fa-check"></i> University filters</li>
                  <li><i class="fas fa-check"></i> Direct outreach</li>
                </ul>
                <div class="rfc-cta">Start Hiring <i class="fas fa-arrow-right"></i></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="features-section" id="features">
          <div class="section-inner">
            <div class="section-label">FEATURES</div>
            <h2 class="section-title">Everything You Need to <span class="gradient-text">Innovate</span></h2>
            <div class="features-grid">
              ${[
                { icon: 'fa-brain', color: '#7c3aed', title: 'AI Matching', desc: 'Smart algorithms match resumes to recruiters and startups to investors based on compatibility.' },
                { icon: 'fa-shield-alt', color: '#10b981', title: 'Idea Validation', desc: 'AI checks your startup idea against existing ones and warns you about duplicates before you register.' },
                { icon: 'fa-users', color: '#2563eb', title: 'Team Formation', desc: 'Find co-founders and teammates with complementary skills for your startup or hackathon.' },
                { icon: 'fa-code', color: '#06b6d4', title: 'Hackathon Portal', desc: 'Discover and register for hackathons. Get AI-matched with teammates based on required skills.' },
                { icon: 'fa-file-alt', color: '#ec4899', title: 'Smart Resume', desc: 'Upload your resume and let AI score it, suggest improvements, and match you to the right opportunities.' },
                { icon: 'fa-network-wired', color: '#f59e0b', title: 'Campus Network', desc: 'Build your professional network with students, alumni, mentors, and industry professionals.' }
              ].map(f => `
                <div class="feature-card">
                  <div class="feature-icon" style="background:${f.color}22;color:${f.color}">
                    <i class="fas ${f.icon}"></i>
                  </div>
                  <h4>${f.title}</h4>
                  <p>${f.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Stats -->
        <section class="stats-section" id="stats">
          <div class="section-inner">
            <div class="stats-banner">
              <div class="stats-banner-bg"></div>
              <div class="stats-content">
                <h2>Join India's Fastest Growing <span class="gradient-text">Student Innovation Network</span></h2>
                <div class="stats-row">
                  ${[
                    { num: '2,400+', label: 'Active Students', icon: 'fa-users' },
                    { num: '180+', label: 'Registered Startups', icon: 'fa-rocket' },
                    { num: '₹4.2Cr', label: 'Total Funding Raised', icon: 'fa-rupee-sign' },
                    { num: '48', label: 'Hackathons Hosted', icon: 'fa-code' },
                    { num: '320+', label: 'Successful Hires', icon: 'fa-briefcase' },
                    { num: '95%', label: 'Satisfaction Rate', icon: 'fa-star' }
                  ].map(s => `
                    <div class="stat-item">
                      <i class="fas ${s.icon}"></i>
                      <div class="stat-num">${s.num}</div>
                      <div class="stat-lbl">${s.label}</div>
                    </div>
                  `).join('')}
                </div>
                <button class="btn btn-primary btn-lg" onclick="AuthPage.show('register')" style="margin-top:32px">
                  <i class="fas fa-rocket"></i> Join InnoVerse Today
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="landing-footer">
          <div class="section-inner">
            <div class="footer-inner">
              <div class="footer-brand">
                <div class="landing-logo"><div class="logo-icon"><i class="fas fa-infinity"></i></div><span>InnoVerse</span></div>
                <p>Empowering student innovators across India's top campuses.</p>
              </div>
              <div class="footer-links">
                <div class="footer-col"><h5>Platform</h5><a>Maker Hub</a><a>Investor Zone</a><a>Hackathons</a><a>Network</a></div>
                <div class="footer-col"><h5>Company</h5><a>About</a><a>Blog</a><a>Careers</a><a>Contact</a></div>
                <div class="footer-col"><h5>Legal</h5><a onclick="AuthPage.show('register')">Privacy</a><a onclick="AuthPage.show('register')">Terms</a><a onclick="AuthPage.show('register')">Cookies</a></div>
              </div>
            </div>
            <div class="footer-bottom">
              <span>© 2024 InnoVerse. Built with ❤️ for student innovators.</span>
            </div>
          </div>
        </footer>
      </div>
    `;
    this.injectStyles();
  },

  injectStyles() {
    if (document.getElementById('landing-styles')) return;
    const s = document.createElement('style');
    s.id = 'landing-styles';
    s.textContent = `
.landing-wrapper { min-height: 100vh; background: var(--bg-primary); }
.landing-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  background: rgba(10,10,15,0.8); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.landing-nav-inner {
  max-width: 1200px; margin: 0 auto; padding: 16px 32px;
  display: flex; align-items: center; gap: 32px;
}
.landing-logo {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Space Grotesk',sans-serif; font-weight: 700; font-size: 1.1rem;
}
.landing-nav-links { display: flex; gap: 24px; flex: 1; justify-content: center; }
.landing-nav-links a { color: var(--text-secondary); font-size: 0.875rem; cursor: pointer; transition: var(--transition); }
.landing-nav-links a:hover { color: var(--text-primary); }
.landing-nav-actions { display: flex; gap: 10px; }
.hero-section {
  min-height: 100vh; display: flex; align-items: center;
  padding: 120px 32px 80px; max-width: 1200px; margin: 0 auto;
  position: relative; gap: 60px;
}
.hero-content { flex: 1; z-index: 1; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 16px; border-radius: var(--radius-full);
  background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3);
  color: var(--accent-purple-light); font-size: 0.8rem; font-weight: 600;
  margin-bottom: 24px;
}
.hero-title { font-size: clamp(2.5rem,5vw,4rem); line-height: 1.1; margin-bottom: 20px; }
.hero-subtitle { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 32px; line-height: 1.7; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }
.hero-stats { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.hero-stat { text-align: center; }
.hero-stat-num { display: block; font-size: 1.4rem; font-weight: 800; font-family: 'Space Grotesk',sans-serif; }
.hero-stat span:last-child { font-size: 0.75rem; color: var(--text-muted); }
.hero-stat-divider { width: 1px; height: 32px; background: var(--border); }
.hero-visual { flex: 0 0 400px; position: relative; height: 400px; }
.hero-card-stack { position: relative; width: 100%; height: 100%; }
.floating-card {
  position: absolute; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 16px; box-shadow: var(--shadow-lg);
  animation: float 4s ease-in-out infinite;
}
.card-1 { width: 220px; top: 20px; left: 20px; animation-delay: 0s; }
.card-2 { width: 140px; top: 160px; right: 20px; animation-delay: -1.5s; text-align: center; }
.card-3 { width: 200px; bottom: 20px; left: 60px; animation-delay: -3s; }
.fc-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.fc-name { font-size: 0.875rem; font-weight: 600; }
.fc-sub { font-size: 0.72rem; color: var(--text-muted); }
.fc-progress-label { display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 6px; }
.fc-ai-text { font-size: 0.72rem; color: var(--text-muted); margin: 8px 0 4px; }
.fc-ai-score { font-size: 1.8rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.fc-hack-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 600; color: var(--accent-cyan); margin-bottom: 8px; }
.fc-hack-prize { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
.fc-hack-days { font-size: 0.72rem; color: var(--accent-orange); }
.section-inner { max-width: 1200px; margin: 0 auto; padding: 80px 32px; }
.section-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.15em; color: var(--accent-purple); text-transform: uppercase; margin-bottom: 12px; }
.section-title { font-size: clamp(1.8rem,3vw,2.5rem); margin-bottom: 16px; }
.section-subtitle { color: var(--text-secondary); font-size: 1rem; margin-bottom: 48px; }
.roles-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
.role-feature-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-xl); padding: 32px; cursor: pointer;
  transition: var(--transition-slow);
}
.role-feature-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
.maker-card:hover { border-color: rgba(124,58,237,0.4); box-shadow: var(--shadow-glow-purple); }
.investor-card:hover { border-color: rgba(245,158,11,0.4); box-shadow: 0 0 40px rgba(245,158,11,0.2); }
.recruiter-card:hover { border-color: rgba(6,182,212,0.4); box-shadow: 0 0 40px rgba(6,182,212,0.2); }
.rfc-icon {
  width: 56px; height: 56px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; margin-bottom: 20px;
}
.maker-icon { background: rgba(124,58,237,0.15); color: var(--accent-purple); }
.investor-icon { background: rgba(245,158,11,0.15); color: var(--accent-orange); }
.recruiter-icon { background: rgba(6,182,212,0.15); color: var(--accent-cyan); }
.role-feature-card h3 { margin-bottom: 12px; }
.role-feature-card p { font-size: 0.875rem; margin-bottom: 20px; }
.rfc-list { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.rfc-list li { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary); }
.rfc-list li i { color: var(--accent-green); font-size: 0.7rem; }
.rfc-cta { font-size: 0.875rem; font-weight: 600; color: var(--accent-purple); display: flex; align-items: center; gap: 6px; }
.features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.feature-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 24px; transition: var(--transition);
}
.feature-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
.feature-icon {
  width: 44px; height: 44px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; margin-bottom: 16px;
}
.feature-card h4 { margin-bottom: 8px; }
.feature-card p { font-size: 0.85rem; }
.stats-section { background: var(--bg-secondary); }
.stats-banner { position: relative; border-radius: var(--radius-xl); overflow: hidden; padding: 60px; text-align: center; background: var(--bg-card); border: 1px solid var(--border); }
.stats-banner-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 70%); }
.stats-content { position: relative; z-index: 1; }
.stats-content h2 { margin-bottom: 40px; }
.stats-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 40px; }
.stat-item { text-align: center; }
.stat-item i { font-size: 1.5rem; color: var(--accent-purple); margin-bottom: 8px; display: block; }
.stat-num { font-size: 2rem; font-weight: 800; font-family: 'Space Grotesk',sans-serif; }
.stat-lbl { font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; }
.landing-footer { background: var(--bg-secondary); border-top: 1px solid var(--border); }
.footer-inner { display: flex; gap: 60px; padding-bottom: 40px; }
.footer-brand { flex: 1; }
.footer-brand p { font-size: 0.875rem; margin-top: 12px; }
.footer-links { display: flex; gap: 40px; }
.footer-col { display: flex; flex-direction: column; gap: 10px; }
.footer-col h5 { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-secondary); margin-bottom: 4px; }
.footer-col a { font-size: 0.85rem; color: var(--text-muted); cursor: pointer; transition: var(--transition); }
.footer-col a:hover { color: var(--text-primary); }
.footer-bottom { border-top: 1px solid var(--border); padding-top: 20px; font-size: 0.8rem; color: var(--text-muted); }
@media(max-width:900px) {
  .hero-section { flex-direction: column; padding-top: 100px; }
  .hero-visual { display: none; }
  .roles-grid, .features-grid { grid-template-columns: 1fr; }
  .footer-inner { flex-direction: column; }
}
    `;
    document.head.appendChild(s);
  }
};
