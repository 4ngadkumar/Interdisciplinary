// ===== AI ENGINE (Simulated) =====
const AIEngine = {

  // Check if a startup idea already exists
  checkIdeaSimilarity(name, description, category) {
    const input = `${name} ${description} ${category}`.toLowerCase();
    const inputWords = input.split(/\s+/).filter(w => w.length > 3);

    let maxScore = 0;
    let matchedStartup = null;

    DB.startups.forEach(startup => {
      const existing = `${startup.name} ${startup.description} ${startup.tagline} ${startup.category} ${(startup.keywords || []).join(' ')}`.toLowerCase();
      const existingWords = existing.split(/\s+/).filter(w => w.length > 3);

      let matchCount = 0;
      inputWords.forEach(word => {
        if (existing.includes(word)) matchCount++;
      });

      // Also check keyword overlap
      const keywordMatches = (startup.keywords || []).filter(kw =>
        input.includes(kw.toLowerCase()) || kw.toLowerCase().split(' ').some(w => input.includes(w))
      ).length;

      const score = ((matchCount / Math.max(inputWords.length, 1)) * 0.6 + (keywordMatches / Math.max((startup.keywords || []).length, 1)) * 0.4) * 100;

      if (score > maxScore) {
        maxScore = score;
        matchedStartup = startup;
      }
    });

    return {
      isDuplicate: maxScore > 35,
      similarity: Math.round(maxScore),
      matchedStartup: maxScore > 35 ? matchedStartup : null,
      warning: maxScore > 35
        ? `This idea is ${Math.round(maxScore)}% similar to "${matchedStartup.name}" already on the platform.`
        : null
    };
  },

  // Score a resume against recruiter requirements
  scoreResumeForRecruiter(resume, recruiter) {
    const req = recruiter.requirements;
    let score = 0;
    let reasons = [];

    // Skills match (40%)
    const skillMatches = resume.skills.filter(s =>
      req.skills.some(rs => rs.toLowerCase() === s.toLowerCase() || rs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(rs.toLowerCase()))
    );
    const skillScore = (skillMatches.length / Math.max(req.skills.length, 1)) * 40;
    score += skillScore;
    if (skillMatches.length > 0) reasons.push(`${skillMatches.length} matching skills: ${skillMatches.slice(0,3).join(', ')}`);

    // Role match (30%)
    const roleMatches = resume.preferredRoles.filter(r =>
      req.roles.some(rr => rr.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(rr.toLowerCase()))
    );
    const roleScore = roleMatches.length > 0 ? 30 : 0;
    score += roleScore;
    if (roleMatches.length > 0) reasons.push(`Role match: ${roleMatches[0]}`);

    // GPA (15%)
    if (resume.gpa >= req.minGPA) {
      score += 15;
      reasons.push(`GPA ${resume.gpa} meets requirement`);
    }

    // University (15%)
    if (req.universities.length === 0 || req.universities.some(u => resume.university.includes(u))) {
      score += 15;
      reasons.push(`University: ${resume.university}`);
    }

    return {
      score: Math.min(Math.round(score), 100),
      reasons,
      recommended: score >= 55,
      label: score >= 80 ? 'Excellent Match' : score >= 60 ? 'Good Match' : score >= 40 ? 'Partial Match' : 'Low Match'
    };
  },

  // Match investors to startups
  matchInvestorToStartup(investor, startup) {
    let score = 0;

    // Category match
    if (investor.focus.includes(startup.category)) score += 40;
    else if (investor.focus.some(f => startup.tags.includes(f))) score += 20;

    // Stage match
    if (investor.stage.includes(startup.stage)) score += 35;

    // Traction bonus
    if (startup.raised > 0) score += 15;
    if (startup.verified) score += 10;

    return Math.min(score, 100);
  },

  // Generate AI insights for a startup
  generateStartupInsights(startup) {
    const insights = [];
    const fundingPct = (startup.raised / startup.fundingGoal) * 100;

    if (fundingPct > 60) insights.push({ type: 'positive', text: 'Strong funding traction — over 60% raised' });
    if (startup.verified) insights.push({ type: 'positive', text: 'Verified startup — higher investor trust' });
    if (startup.teamSize < 3) insights.push({ type: 'warning', text: 'Small team — consider expanding before Series A' });
    if (startup.upvotes > 100) insights.push({ type: 'positive', text: 'High community interest — strong product-market fit signals' });
    if (startup.lookingFor.length > 0) insights.push({ type: 'info', text: `Actively hiring: ${startup.lookingFor.join(', ')}` });

    return insights;
  },

  // Suggest unique differentiators for a startup idea
  suggestDifferentiators(name, description) {
    const suggestions = [
      "Focus on a specific underserved geographic market (Tier 2/3 cities)",
      "Add a community/social layer to increase retention",
      "Consider a B2B2C model for faster distribution",
      "Integrate vernacular language support for wider reach",
      "Add offline-first functionality for low-connectivity areas",
      "Build a marketplace model to create network effects",
      "Partner with government schemes for distribution",
      "Focus on a specific age group or demographic niche"
    ];
    // Return 3 random suggestions
    return suggestions.sort(() => Math.random() - 0.5).slice(0, 3);
  },

  // Score resume overall
  scoreResume(resume) {
    let score = 0;
    if (resume.skills.length >= 5) score += 20;
    else score += resume.skills.length * 4;
    if (resume.experience.length >= 2) score += 25;
    else score += resume.experience.length * 12;
    if (resume.projects.length >= 2) score += 20;
    else score += resume.projects.length * 10;
    if (resume.gpa >= 9.0) score += 20;
    else if (resume.gpa >= 8.0) score += 15;
    else if (resume.gpa >= 7.0) score += 10;
    if (resume.linkedin) score += 8;
    if (resume.github) score += 7;
    return Math.min(score, 100);
  }
};
