// ===== UTILITY FUNCTIONS =====
const Utils = {
  // Format numbers
  formatNumber(n) {
    if (n >= 10000000) return (n / 10000000).toFixed(1) + 'Cr';
    if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  },

  // Format currency
  formatCurrency(n) {
    if (n >= 10000000) return '₹' + (n / 10000000).toFixed(1) + 'Cr';
    if (n >= 100000) return '₹' + (n / 100000).toFixed(0) + 'L';
    if (n >= 1000) return '₹' + (n / 1000).toFixed(0) + 'K';
    return '₹' + n;
  },

  // Time ago
  timeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 2592000) return Math.floor(diff / 86400) + 'd ago';
    return Math.floor(diff / 2592000) + 'mo ago';
  },

  // Generate avatar initials
  getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  },

  // Avatar color from name
  avatarColor(name) {
    const colors = [
      'linear-gradient(135deg,#7c3aed,#2563eb)',
      'linear-gradient(135deg,#ec4899,#7c3aed)',
      'linear-gradient(135deg,#f59e0b,#ef4444)',
      'linear-gradient(135deg,#06b6d4,#10b981)',
      'linear-gradient(135deg,#10b981,#2563eb)',
      'linear-gradient(135deg,#f59e0b,#ec4899)'
    ];
    let hash = 0;
    for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) % colors.length;
    return colors[Math.abs(hash)];
  },

  // Render avatar element
  renderAvatar(initials, size = 'md', name = '') {
    const bg = this.avatarColor(name || initials);
    return `<div class="avatar avatar-${size}" style="background:${bg}">${initials}</div>`;
  },

  // Funding progress percentage
  fundingProgress(raised, goal) {
    return Math.min(Math.round((raised / goal) * 100), 100);
  },

  // Stage badge color
  stageBadge(stage) {
    const map = {
      'Idea': 'badge-purple', 'Pre-Seed': 'badge-blue',
      'Seed': 'badge-green', 'Series A': 'badge-orange', 'Series B': 'badge-red'
    };
    return map[stage] || 'badge-blue';
  },

  // Debounce
  debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  // Escape HTML
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // Random ID
  uid() {
    return Math.random().toString(36).slice(2, 9);
  },

  // Animate counter
  animateCounter(el, target, duration = 1000) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target; clearInterval(timer); return; }
      el.textContent = Math.floor(start);
    }, 16);
  },

  // Stagger animate children
  staggerAnimate(parent, cls = 'animate-fadeInUp', delay = 80) {
    const children = parent.querySelectorAll(':scope > *');
    children.forEach((child, i) => {
      child.style.opacity = '0';
      child.style.animationDelay = `${i * delay}ms`;
      child.classList.add(cls);
    });
  }
};
