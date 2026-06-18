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
  },

  _tokens(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
  },

  _overlapScore(a = [], b = []) {
    const left = a.map(x => String(x).toLowerCase());
    const right = b.map(x => String(x).toLowerCase());
    if (!left.length || !right.length) return 0;
    const hits = left.filter(x => right.some(y => x === y || x.includes(y) || y.includes(x)));
    return Math.round((hits.length / Math.max(left.length, 1)) * 100);
  },

  _extractKeywords(text) {
    const stop = ['the','and','for','with','that','this','from','into','your','their','have','will','are','our','using','build','make'];
    return [...new Set(this._tokens(text).filter(w => !stop.includes(w)))].slice(0, 10);
  },

  matchStudentToOpportunities(student) {
    const profile = student || DB.resumes[0];
    const skills = profile.skills || [];
    const roleText = `${profile.lookingFor || ''} ${(profile.preferredRoles || []).join(' ')}`;

    const investors = DB.investors.map(investor => {
      const focusScore = this._overlapScore(skills.concat(profile.tags || []), investor.focus);
      const aiBonus = skills.some(s => /ai|ml|machine|data|python/i.test(s)) && investor.focus.includes('AI') ? 20 : 0;
      const score = Math.min(100, Math.round(focusScore * 0.55 + aiBonus + (investor.activelyInvesting ? 15 : 5) + 15));
      return {
        type: 'Investor',
        name: investor.name,
        subtitle: investor.firm,
        score,
        reasons: [
          `${investor.focus.slice(0, 3).join(', ')} focus`,
          investor.activelyInvesting ? 'Actively investing' : 'Currently selective',
          `${investor.checkSize} check size`
        ],
        action: 'Prepare a focused intro with your strongest traction metric.'
      };
    });

    const hackathons = DB.hackathons.map(hackathon => {
      const skillScore = this._overlapScore(skills, hackathon.skills);
      const score = Math.min(100, Math.round(skillScore * 0.75 + (hackathon.status === 'open' ? 20 : 10)));
      return {
        type: 'Hackathon',
        name: hackathon.name,
        subtitle: hackathon.theme,
        score,
        reasons: [
          `${hackathon.skills.join(', ')} required`,
          `${hackathon.mode} mode`,
          `${hackathon.prize} prize pool`
        ],
        action: score >= 70 ? 'Register and use team matching.' : 'Add one missing core skill before applying.'
      };
    });

    const startupRoles = DB.startups.flatMap(startup => (startup.lookingFor || []).map(role => {
      const roleScore = this._overlapScore(skills.concat(this._tokens(roleText)), [role].concat(startup.skills || []));
      return {
        type: 'Startup Role',
        name: role,
        subtitle: startup.name,
        score: Math.min(100, Math.round(roleScore * 0.7 + (startup.verified ? 15 : 5) + (startup.featured ? 10 : 0))),
        reasons: [
          `${startup.category} startup`,
          `${startup.stage} stage`,
          `${startup.skills.slice(0, 3).join(', ')} team skills`
        ],
        action: 'Send a short contribution proposal and one relevant project.'
      };
    }));

    return investors.concat(hackathons, startupRoles)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9);
  },

  generatePitchDeck(input) {
    const name = (input?.name || 'Your Startup').trim();
    const idea = (input?.idea || '').trim();
    const category = input?.category || 'Technology';
    const audience = input?.audience || 'Seed investors';
    const keywords = this._extractKeywords(`${name} ${idea} ${category}`);
    const market = category === 'Other' ? 'student and early professional users' : `${category} buyers and campus adopters`;
    const strength = Math.min(96, 58 + Math.min(idea.length, 420) / 12 + keywords.length * 2);

    return {
      title: `${name} Pitch Deck`,
      qualityScore: Math.round(strength),
      audience,
      slides: [
        {
          title: 'Vision',
          bullets: [
            `${name} helps ${market} solve a high-frequency problem.`,
            `Core idea: ${idea || 'A focused startup concept ready for validation.'}`,
            `Positioning keywords: ${keywords.slice(0, 4).join(', ') || category}.`
          ],
          note: 'Open with the user pain and why this team can win.'
        },
        {
          title: 'Problem',
          bullets: [
            'Users rely on fragmented manual workflows.',
            'Existing options are either too expensive, too generic, or hard to adopt.',
            'Campuses need faster proof, trust, and measurable outcomes.'
          ],
          note: 'Use one story from a real student, founder, or customer interview.'
        },
        {
          title: 'Solution',
          bullets: [
            `A ${category} product with guided onboarding and measurable outcomes.`,
            'AI-assisted recommendations reduce time to first value.',
            'Campus-first distribution creates early trust and feedback loops.'
          ],
          note: 'Demo the smallest workflow that creates the aha moment.'
        },
        {
          title: 'Market',
          bullets: [
            `Primary segment: ${market}.`,
            'Expansion path: campus pilots, institutional partnerships, then B2B growth.',
            'Early wedge should focus on one reachable persona.'
          ],
          note: 'Replace broad TAM claims with bottom-up campus numbers.'
        },
        {
          title: 'Business Model',
          bullets: [
            'Start with freemium or pilot pricing to reduce adoption friction.',
            'Monetize through subscriptions, success fees, or institutional plans.',
            'Track activation, retention, and referral as leading metrics.'
          ],
          note: 'Tie pricing to the outcome users already understand.'
        },
        {
          title: 'Go-To-Market',
          bullets: [
            'Launch with 3 campus ambassadors and one flagship pilot.',
            'Use founder-led demos, hackathon communities, and faculty partners.',
            'Convert proof points into investor and partner introductions.'
          ],
          note: 'Show a 30-60-90 day acquisition plan.'
        },
        {
          title: 'Risks',
          bullets: [
            'Adoption risk if onboarding is too broad.',
            'Data or trust risk if outcomes are not transparent.',
            'Competitive risk from larger platforms copying the feature set.'
          ],
          note: 'Investors trust founders who know their weak spots.'
        },
        {
          title: 'Ask',
          bullets: [
            `Raise or resource ask: ${input?.fundingGoal ? `INR ${input.fundingGoal}` : 'pilot partners, mentors, and seed capital'}.`,
            'Use funds for product, pilots, and measurable traction.',
            'Target milestone: 5 paying pilots or 1,000 active student users.'
          ],
          note: 'End with the next milestone, not just the amount.'
        }
      ]
    };
  },

  simulateFailure(input) {
    const idea = `${input?.name || ''} ${input?.idea || ''} ${input?.category || ''}`;
    const tokens = this._extractKeywords(idea);
    const category = input?.category || 'Technology';
    const stage = input?.stage || 'Idea';
    const stageRisk = { Idea: 18, 'Pre-Seed': 14, Seed: 10, 'Series A': 7 }[stage] || 12;
    const riskBank = [
      ['Customer discovery gap', 'Users like the concept but do not switch behavior.', 68, 75, 'Run 15 problem interviews and track willingness to pay before building more.'],
      ['Distribution bottleneck', 'Campus adoption depends on slow admin approvals.', 54, 70, 'Build a student-led wedge that can spread without formal procurement.'],
      ['Weak differentiation', 'Competitors can copy the visible feature set quickly.', 46, 78, 'Create proprietary workflow data, community depth, or integrations.'],
      ['Team capability gap', 'The team lacks one key skill needed for the next milestone.', 58, 66, 'Recruit a specialist co-founder or advisor for the highest-risk function.'],
      ['Unit economics pressure', 'Acquisition or service costs rise faster than revenue.', 42, 72, 'Define one paid use case and measure payback during pilots.'],
      ['Trust and compliance friction', 'Users hesitate because data, privacy, or reliability is unclear.', 38, 80, 'Publish a simple trust model, consent flow, and escalation process.'],
      ['Investor narrative mismatch', 'The pitch sounds useful but not venture-scale yet.', 44, 62, 'Show repeatable growth signals and a larger expansion path.']
    ];

    const risks = riskBank.map((r, idx) => {
      const keywordBoost = tokens.length > idx ? (tokens[idx].charCodeAt(0) % 9) : 3;
      const probability = Math.min(92, r[2] + stageRisk - keywordBoost);
      const severity = Math.min(95, r[3] + (category === 'HealthTech' || category === 'FinTech' ? 6 : 0));
      return {
        title: r[0],
        detail: r[1],
        probability,
        severity,
        impact: Math.round((probability + severity) / 2),
        mitigation: r[4]
      };
    }).sort((a, b) => b.impact - a.impact);

    return {
      survivalScore: Math.max(8, 100 - Math.round(risks.slice(0, 4).reduce((sum, r) => sum + r.impact, 0) / 5)),
      summary: `${stage} ${category} ideas usually fail first through validation, distribution, or trust gaps.`,
      risks,
      nextExperiments: [
        'Run a fake-door landing page and measure sign-up intent.',
        'Interview 5 users who rejected the product and summarize objections.',
        'Price one pilot before adding new features.',
        'Recruit one teammate who directly lowers the top risk.'
      ]
    };
  },

  forecastCampusTrends() {
    const skillCounts = {};
    DB.resumes.forEach(r => (r.skills || []).forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    }));
    DB.startups.forEach(s => (s.skills || []).forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    }));

    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count], index) => ({
        skill,
        demand: Math.min(98, 58 + count * 9 + (8 - index) * 2),
        growth: Math.min(46, 12 + count * 5 + index)
      }));

    const trends = [
      { name: 'Applied AI copilots', category: 'AI', momentum: 94, signal: 'More startups are embedding workflow-specific AI instead of generic chat.' },
      { name: 'Climate operations', category: 'CleanTech', momentum: 82, signal: 'EV logistics, carbon tracking, and smart agriculture are gaining campus teams.' },
      { name: 'Rural health access', category: 'HealthTech', momentum: 78, signal: 'Low-bandwidth and assisted-care models remain strong in student innovation.' },
      { name: 'Financial literacy for Gen Z', category: 'FinTech', momentum: 74, signal: 'Gamified money products are moving from content to action-based tools.' },
      { name: 'Peer learning marketplaces', category: 'EdTech', momentum: 72, signal: 'Skill exchange and campus creator economies are converging.' }
    ];

    return { topSkills, trends };
  },

  matchCollaborators(profile, goal = 'cofounder') {
    const current = profile || DB.resumes[0];
    const currentSkills = current.skills || [];
    const founderNeeds = [...new Set(DB.startups.flatMap(s => s.lookingFor || []))];

    return DB.resumes
      .filter(person => person.id !== current.id)
      .map(person => {
        const shared = person.skills.filter(skill => currentSkills.some(s => s.toLowerCase() === skill.toLowerCase()));
        const complementary = person.skills.filter(skill => !currentSkills.some(s => s.toLowerCase() === skill.toLowerCase()));
        const roleFit = this._overlapScore(person.preferredRoles || [], founderNeeds.concat(goal));
        const score = Math.min(100, Math.round(shared.length * 10 + complementary.length * 8 + roleFit * 0.35 + (person.aiScore || 70) * 0.2));
        return {
          person,
          score,
          shared,
          complementary: complementary.slice(0, 4),
          reason: score >= 80 ? 'Strong co-founder fit' : score >= 65 ? 'Good teammate fit' : 'Useful specialist fit',
          opener: `Ask ${person.name.split(' ')[0]} to review a ${goal} milestone and share one project where ${person.skills[0]} mattered.`
        };
      })
      .sort((a, b) => b.score - a.score);
  },

  optimizeResumeLinkedIn(input) {
    const resume = input?.resume || null;
    const text = input?.text || '';
    const targetRole = input?.targetRole || (resume?.preferredRoles?.[0]) || 'Product-minded engineer';
    const skills = resume?.skills?.length ? resume.skills : this._extractKeywords(text).slice(0, 8);
    const experience = resume?.experience || [];
    const base = resume ? this.scoreResume(resume) : Math.min(90, 45 + skills.length * 5 + Math.min(text.length, 600) / 18);
    const optimizedScore = Math.min(98, Math.round(base + 12));

    return {
      originalScore: Math.round(base),
      optimizedScore,
      headline: `${targetRole} | ${skills.slice(0, 3).join(' + ') || 'AI + Product + Growth'} | Building measurable campus impact`,
      about: `I am a ${targetRole.toLowerCase()} focused on building practical products with measurable outcomes. My work combines ${skills.slice(0, 4).join(', ') || 'product thinking, execution, and collaboration'} to move ideas from prototype to adoption.`,
      bullets: [
        `Reframed projects around measurable outcomes, user impact, and technical ownership.`,
        `Grouped skills into role-relevant clusters: ${skills.slice(0, 6).join(', ') || 'core tools and strengths'}.`,
        experience.length ? `Strengthened experience section by making "${experience[0]}" outcome-led.` : 'Added space for one quantified internship, project, or leadership result.',
        'Added a sharper LinkedIn headline with target role, stack, and proof of direction.'
      ],
      keywords: [...new Set(skills.concat([targetRole, 'leadership', 'startup', 'collaboration']))].slice(0, 12),
      fixes: [
        'Start bullets with action verbs and end with a number where possible.',
        'Move strongest project into the top third of the resume.',
        'Replace generic objective text with a 2-line summary targeted to the role.'
      ]
    };
  },

  generateInvestorQuestions(startup) {
    const s = startup || DB.startups[0];
    return [
      `What painful problem does ${s.name} solve, and for whom?`,
      'How do you know users will pay or keep using it?',
      'What is your strongest unfair advantage against incumbents?',
      'What milestone will you hit with the next round of funding?',
      'Which risk could kill this startup in the next six months?'
    ];
  },

  analyzeInvestorAnswer(answer, question, cameraSignal = {}) {
    const words = this._tokens(answer);
    const clarity = Math.min(100, words.length * 3);
    const proofWords = ['users','revenue','pilot','paid','growth','retention','metric','customer','data','traction'];
    const proof = words.filter(w => proofWords.includes(w)).length * 12;
    const confidence = cameraSignal.confidence || 55;
    const score = Math.min(100, Math.round(clarity * 0.35 + proof * 0.35 + confidence * 0.3));
    const emotion = score >= 82 ? 'Excited' : score >= 66 ? 'Interested' : score >= 48 ? 'Skeptical' : 'Confused';

    return {
      score,
      emotion,
      sentiment: score >= 66 ? 'positive' : score >= 48 ? 'neutral' : 'negative',
      feedback: [
        score >= 66 ? 'Answer has enough structure to keep the investor engaged.' : 'Answer needs a sharper opening claim and a concrete proof point.',
        proof >= 24 ? 'Good use of traction or customer evidence.' : 'Add one number: users, revenue, pilots, retention, or waitlist.',
        confidence >= 65 ? 'Camera confidence looks steady.' : 'Look toward the camera and slow the pace before the next answer.'
      ],
      followUp: question?.includes('risk')
        ? 'Name the top risk, then show the experiment that reduces it.'
        : 'Close with the next milestone and why it matters.'
    };
  }
};
