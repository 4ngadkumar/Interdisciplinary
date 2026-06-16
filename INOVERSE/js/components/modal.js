// ===== GLOBAL MODAL =====
const Modal = {
  open(content, size = '') {
    const overlay = document.getElementById('global-modal');
    overlay.innerHTML = `
      <div class="modal-box ${size}" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="Modal.close()"><i class="fas fa-times"></i></button>
        ${content}
      </div>
    `;
    overlay.classList.remove('hidden');
    overlay.onclick = () => Modal.close();
    document.body.style.overflow = 'hidden';
  },

  close() {
    const overlay = document.getElementById('global-modal');
    overlay.classList.add('hidden');
    overlay.innerHTML = '';
    document.body.style.overflow = '';
  },

  confirm(title, message, onConfirm, danger = false) {
    this.open(`
      <h3 class="modal-title">${title}</h3>
      <p class="modal-subtitle">${message}</p>
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:24px">
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" onclick="Modal.close();(${onConfirm.toString()})()">Confirm</button>
      </div>
    `);
  }
};
