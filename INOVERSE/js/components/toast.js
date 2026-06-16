// ===== TOAST NOTIFICATIONS =====
const Toast = {
  show(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    const id = Utils.uid();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = `toast-${id}`;
    toast.innerHTML = `
      <i class="fas ${icons[type]} toast-icon"></i>
      <span class="toast-message">${message}</span>
      <i class="fas fa-times toast-close" onclick="Toast.remove('${id}')"></i>
    `;

    container.appendChild(toast);

    setTimeout(() => Toast.remove(id), duration);
    return id;
  },

  remove(id) {
    const toast = document.getElementById(`toast-${id}`);
    if (!toast) return;
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  },

  success(msg) { return this.show(msg, 'success'); },
  error(msg) { return this.show(msg, 'error'); },
  warning(msg) { return this.show(msg, 'warning'); },
  info(msg) { return this.show(msg, 'info'); }
};
