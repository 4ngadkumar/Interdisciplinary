// ===== MAIN APP CONTROLLER =====
const App = {
  init() {
    Store.init();

    if (Store.get('isAuthenticated')) {
      this.showApp();
    } else {
      this.showLanding();
    }
  },

  showLanding() {
    document.getElementById('page-landing').classList.remove('hidden');
    document.getElementById('app-shell').classList.add('hidden');
    LandingPage.render();
    AIAgent.mount();
    ThemeSwitcher._mount(); // ensure palette button is present
  },

  showApp() {
    document.getElementById('page-landing').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    Store.set('currentPage', 'dashboard');
    Sidebar.render();
    this.navigate('dashboard');
    AIAgent.mount();
    ThemeSwitcher._mount(); // ensure palette button is present
  },

  navigate(page) {
    Store.set('currentPage', page);
    Sidebar.render();

    // Scroll to top
    const main = document.getElementById('main-content');
    if (main) main.scrollTop = 0;

    switch(page) {
      case 'dashboard': DashboardPage.render(); break;
      case 'maker':     MakerPage.render();     break;
      case 'investor':  InvestorPage.render();  break;
      case 'hackathon': HackathonPage.render(); break;
      case 'network':   NetworkPage.render();   break;
      case 'ai':        AIPage.render();        break;
      case 'profile':   ProfilePage.render();   break;
      case 'terms':     TermsPage.render();     break;
      default:          DashboardPage.render();
    }
  },

  logout() {
    Modal.confirm(
      'Sign Out',
      'Are you sure you want to sign out of InnoVerse?',
      () => {
        Store.logout();
        App.showLanding();
        Toast.info('Signed out successfully.');
      }
    );
  }
};

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', () => {
  // Show loader immediately
  Loader.show();

  // Apply saved theme before anything renders
  ThemeSwitcher.init();

  // Setup debounced idea checker
  MakerPage.onIdeaInput = Utils.debounce(() => MakerPage._checkIdea(), 600);

  // Init app after loader animates
  setTimeout(() => {
    App.init();
    Loader.hide(400);
  }, 2400);
});
