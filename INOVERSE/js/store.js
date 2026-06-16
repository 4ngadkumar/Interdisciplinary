// ===== GLOBAL STATE STORE =====
const Store = {
  state: {
    currentUser: null,
    currentPage: 'landing',
    isAuthenticated: false,
    notifications: [],
    theme: 'dark'
  },

  listeners: {},

  set(key, value) {
    this.state[key] = value;
    if (this.listeners[key]) {
      this.listeners[key].forEach(fn => fn(value));
    }
  },

  get(key) {
    return this.state[key];
  },

  on(key, fn) {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(fn);
  },

  login(user) {
    this.set('currentUser', user);
    this.set('isAuthenticated', true);
    localStorage.setItem('innoverse_user', JSON.stringify(user));
  },

  logout() {
    this.set('currentUser', null);
    this.set('isAuthenticated', false);
    localStorage.removeItem('innoverse_user');
  },

  init() {
    const saved = localStorage.getItem('innoverse_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        this.set('currentUser', user);
        this.set('isAuthenticated', true);
      } catch(e) {}
    }
  }
};
