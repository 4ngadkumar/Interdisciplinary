// ===== INNOVERSE AI API ROUTES (Simulated Backend) =====
const InnoVerseAIAPI = {
  STORAGE_KEY: 'innoverse_ai_activity',

  routes: {
    '/api/ai/skill-match': payload => AIEngine.matchStudentToOpportunities(payload?.student),
    '/api/ai/pitch-deck': payload => AIEngine.generatePitchDeck(payload),
    '/api/ai/failure-simulator': payload => AIEngine.simulateFailure(payload),
    '/api/ai/trend-forecast': () => AIEngine.forecastCampusTrends(),
    '/api/ai/collaboration-match': payload => AIEngine.matchCollaborators(payload?.profile, payload?.goal),
    '/api/ai/resume-linkedin-optimizer': payload => AIEngine.optimizeResumeLinkedIn(payload),
    '/api/ai/investor-questions': payload => AIEngine.generateInvestorQuestions(payload?.startup),
    '/api/ai/investor-emotion': payload => AIEngine.analyzeInvestorAnswer(payload?.answer, payload?.question, payload?.cameraSignal)
  },

  async request(route, payload = {}) {
    const handler = this.routes[route];
    if (!handler) throw new Error(`Unknown API route: ${route}`);

    const result = handler(payload);
    this._saveActivity(route, payload, result);

    return new Promise(resolve => {
      setTimeout(() => resolve({ ok: true, route, result }), 220);
    });
  },

  _saveActivity(route, payload, result) {
    const history = this.history();
    history.unshift({
      id: Utils.uid(),
      route,
      payload,
      result,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history.slice(0, 25)));
  },

  history() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }
};
