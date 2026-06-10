// ===== SIDEBAR =====
const Sidebar = {
  render() {
    const user = Store.get('currentUser');
    const page = Store.get('currentPage');

    const navItems = [
      { id: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
      { id: 'maker', icon: 'fa-rocket', label: 'Maker Hub', badge: 'NEW' },
      { id: 'investor', icon: 'fa-chart-line', label: 'Investor Zone' },
      { id: 'hackathon', icon: 'fa-code', label: 'Hackathons' },
      { id: 'network', icon: 'fa-users', label: 'Network' },
      { id: 'profile', icon: 'fa-user', label: 'My Profile' },
      { id: 'terms', icon: 'fa-file-contract', label: 'Terms & Conditions' },
    ];

    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = `
      <div class="sidebar-inner">
        <!-- Logo -->
        <div class="sidebar-logo">
          <div class="logo-icon">
            <i class="fas fa-infinity"></i>
          </div>
          <div class="logo-text">
            <span class="logo-name">InnoVerse</span>
            <span class="logo-tagline">Campus Ecosystem</span>
          </div>
        </div>

        <!-- User Card -->
        <div class="sidebar-user">
          ${Utils.renderAvatar(user?.avatar || 'U', 'md', user?.name || '')}
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${user?.name || 'User'}</div>
            <div class="sidebar-user-role">
              <span class="role-pill role-${user?.role || 'maker'}">${user?.role || 'maker'}</span>
            </div>
          </div>
        </div>

        <!-- Nav -->
        <nav class="sidebar-nav">
          <div class="nav-section-label">MAIN MENU</div>
          ${navItems.map(item => `
            <div class="nav-item ${page === item.id ? 'active' : ''}" onclick="App.navigate('${item.id}')">
              <div class="nav-item-icon"><i class="fas ${item.icon}"></i></div>
              <span class="nav-item-label">${item.label}</span>
              ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
            </div>
          `).join('')}
        </nav>

        <!-- Bottom -->
        <div class="sidebar-bottom">
          <div class="nav-item" onclick="App.logout()">
            <div class="nav-item-icon"><i class="fas fa-sign-out-alt"></i></div>
            <span class="nav-item-label">Logout</span>
          </div>
        </div>
      </div>
    `;
  }
};

// Sidebar CSS injected
const sidebarStyle = document.createElement('style');
sidebarStyle.textContent = `
#sidebar {
  width: 260px; min-height: 100vh; background: var(--bg-secondary);
  border-right: 1px solid var(--border); position: fixed; left: 0; top: 0;
  z-index: 100; display: flex; flex-direction: column;
}
.sidebar-inner {
  display: flex; flex-direction: column; height: 100vh; padding: 20px 12px;
}
.sidebar-logo {
  display: flex; align-items: center; gap: 12px; padding: 8px 8px 20px;
  border-bottom: 1px solid var(--border); margin-bottom: 16px;
}
.logo-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--gradient-primary); display: flex; align-items: center;
  justify-content: center; font-size: 1rem; color: #fff; flex-shrink: 0;
}
.logo-name { display: block; font-family: 'Space Grotesk',sans-serif; font-weight: 700; font-size: 1rem; }
.logo-tagline { display: block; font-size: 0.68rem; color: var(--text-muted); }
.sidebar-user {
  display: flex; align-items: center; gap: 10px;
  padding: 12px; background: var(--bg-glass); border: 1px solid var(--border);
  border-radius: var(--radius-md); margin-bottom: 20px;
}
.sidebar-user-name { font-size: 0.875rem; font-weight: 600; }
.role-pill {
  font-size: 0.68rem; font-weight: 600; padding: 2px 8px;
  border-radius: var(--radius-full); text-transform: uppercase; letter-spacing: 0.05em;
}
.role-maker { background: rgba(124,58,237,0.2); color: var(--accent-purple-light); }
.role-investor { background: rgba(245,158,11,0.2); color: #fbbf24; }
.role-recruiter { background: rgba(6,182,212,0.2); color: #22d3ee; }
.nav-section-label {
  font-size: 0.65rem; font-weight: 700; color: var(--text-muted);
  letter-spacing: 0.1em; padding: 0 8px; margin-bottom: 8px;
}
.sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.nav-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  border-radius: var(--radius-md); cursor: pointer; transition: var(--transition);
  color: var(--text-secondary); font-size: 0.875rem; font-weight: 500;
  position: relative;
}
.nav-item:hover { background: var(--bg-glass); color: var(--text-primary); }
.nav-item.active {
  background: rgba(124,58,237,0.15); color: var(--accent-purple-light);
  border: 1px solid rgba(124,58,237,0.2);
}
.nav-item.active .nav-item-icon { color: var(--accent-purple); }
.nav-item-icon { width: 20px; text-align: center; font-size: 0.9rem; }
.nav-item-label { flex: 1; }
.nav-badge {
  font-size: 0.6rem; font-weight: 700; padding: 2px 6px;
  background: var(--gradient-primary); color: #fff;
  border-radius: var(--radius-full); letter-spacing: 0.05em;
}
.sidebar-bottom { border-top: 1px solid var(--border); padding-top: 12px; margin-top: 8px; }
`;
document.head.appendChild(sidebarStyle);
