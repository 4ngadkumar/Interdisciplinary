// ===== TERMS & CONDITIONS PAGE =====
const TermsPage = {
  render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-wrapper">
        <div class="terms-header">
          <div class="terms-header-icon"><i class="fas fa-file-contract"></i></div>
          <div>
            <h2>Terms &amp; Conditions</h2>
            <p>Last updated: 25 May 2026 &nbsp;·&nbsp; Effective: 25 May 2026</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.print()">
            <i class="fas fa-print"></i> Print
          </button>
        </div>

        <div class="terms-layout">
          <!-- Sticky TOC -->
          <aside class="terms-toc" id="terms-toc">
            <div class="toc-title">Contents</div>
            <nav>
              ${[
                ['1','Acceptance of Terms'],
                ['2','Platform Description'],
                ['3','Eligibility'],
                ['4','User Accounts &amp; Security'],
                ['5','Maker &amp; Startup Registration'],
                ['6','Investor &amp; Recruiter Access'],
                ['7','Revenue Share &amp; Platform Fee'],
                ['8','Intellectual Property'],
                ['9','AI Features &amp; Data Processing'],
                ['10','Biometric Data (Face ID)'],
                ['11','Privacy &amp; Data Protection'],
                ['12','Prohibited Conduct'],
                ['13','Disclaimers &amp; Limitation of Liability'],
                ['14','Indemnification'],
                ['15','Termination'],
                ['16','Governing Law'],
                ['17','Amendments'],
                ['18','Contact Information'],
              ].map(([n,t]) => `
                <a class="toc-link" href="#sec-${n}" onclick="TermsPage.scrollTo('sec-${n}')">
                  <span class="toc-num">${n}</span>${t}
                </a>
              `).join('')}
            </nav>
          </aside>

          <!-- Main Content -->
          <article class="terms-body" id="terms-body">
            <div class="terms-preamble">
              <i class="fas fa-shield-alt"></i>
              <p>Please read these Terms &amp; Conditions carefully before using the InnoVerse platform.
              By accessing or using InnoVerse, you confirm that you have read, understood, and agree
              to be bound by these Terms. If you do not agree, you must not use the platform.</p>
            </div>
            ${TermsPage.sections()}
          </article>
        </div>
      </div>
    `;
    this.injectStyles();
    this.initScrollSpy();
  },

  scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  initScrollSpy() {
    const body = document.getElementById('terms-body');
    if (!body) return;
    body.addEventListener('scroll', () => {
      const sections = body.querySelectorAll('.terms-section');
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < 300) {
          document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.toc-link[href="#${sec.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    });
  },

  sections() {
    return `
<!-- 1 -->
<section class="terms-section" id="sec-1">
  <div class="terms-section-num">01</div>
  <h3>Acceptance of Terms</h3>
  <p>These Terms &amp; Conditions ("Terms") constitute a legally binding agreement between you ("User", "you", or "your") and <strong>InnoVerse Technologies Private Limited</strong> ("InnoVerse", "we", "us", or "our"), governing your access to and use of the InnoVerse platform, including all associated websites, mobile applications, APIs, and services (collectively, the "Platform").</p>
  <p>By registering an account, clicking "I Agree", or otherwise accessing the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy, which is incorporated herein by reference. These Terms apply to all users, including Makers, Investors, Recruiters, and visitors.</p>
</section>

<!-- 2 -->
<section class="terms-section" id="sec-2">
  <div class="terms-section-num">02</div>
  <h3>Platform Description</h3>
  <p>InnoVerse is an AI-powered campus innovation ecosystem designed to connect student entrepreneurs, investors, recruiters, and mentors. The Platform provides the following core services:</p>
  <ul class="terms-list">
    <li><strong>Maker Hub:</strong> Startup registration, idea validation, resume upload, and team formation tools.</li>
    <li><strong>Investor Zone:</strong> Curated startup discovery, AI-matched investment opportunities, and talent pool access.</li>
    <li><strong>Hackathon Portal:</strong> Discovery, registration, and team formation for hackathons and innovation challenges.</li>
    <li><strong>Campus Network:</strong> Professional networking, skill showcasing, and peer collaboration.</li>
    <li><strong>AI Services:</strong> Automated resume screening, idea similarity detection, and investor-startup matching.</li>
    <li><strong>Biometric Authentication:</strong> Optional Face ID sign-in and hand gesture verification.</li>
  </ul>
  <p>InnoVerse acts solely as an intermediary platform. We do not guarantee investment outcomes, employment, or the success of any startup registered on the Platform.</p>
</section>

<!-- 3 -->
<section class="terms-section" id="sec-3">
  <div class="terms-section-num">03</div>
  <h3>Eligibility</h3>
  <p>To use the Platform, you must:</p>
  <ul class="terms-list">
    <li>Be at least <strong>18 years of age</strong>, or the age of majority in your jurisdiction.</li>
    <li>Be a currently enrolled student, faculty member, alumni, investor, or industry professional.</li>
    <li>Have the legal capacity to enter into a binding contract.</li>
    <li>Not be prohibited from using the Platform under applicable law.</li>
  </ul>
  <p>By using the Platform, you represent and warrant that you meet all eligibility requirements. InnoVerse reserves the right to verify eligibility and suspend accounts that do not comply.</p>
</section>

<!-- 4 -->
<section class="terms-section" id="sec-4">
  <div class="terms-section-num">04</div>
  <h3>User Accounts &amp; Security</h3>
  <p>You are responsible for maintaining the confidentiality of your account credentials, including your password and any biometric authentication data. You agree to:</p>
  <ul class="terms-list">
    <li>Provide accurate, current, and complete registration information.</li>
    <li>Promptly update your information if it changes.</li>
    <li>Notify InnoVerse immediately of any unauthorised access to your account.</li>
    <li>Not share your account credentials with any third party.</li>
    <li>Accept full responsibility for all activities conducted under your account.</li>
  </ul>
  <p>InnoVerse shall not be liable for any loss or damage arising from your failure to comply with these security obligations.</p>
</section>

<!-- 5 -->
<section class="terms-section" id="sec-5">
  <div class="terms-section-num">05</div>
  <h3>Maker &amp; Startup Registration</h3>
  <p>Users registering as Makers and submitting startup ideas or profiles agree to the following:</p>
  <ul class="terms-list">
    <li>All submitted information is accurate, original, and does not infringe upon any third-party intellectual property rights.</li>
    <li>You grant InnoVerse a non-exclusive, royalty-free, worldwide licence to display, promote, and distribute your startup profile on the Platform.</li>
    <li>InnoVerse's AI-powered idea similarity detection is provided as a guidance tool only and does not constitute a legal determination of novelty or patentability.</li>
    <li>Duplicate or substantially similar ideas flagged by the AI system may be subject to additional review before publication.</li>
    <li>Resume data uploaded to the Platform may be processed by AI systems to generate match scores and recommendations for recruiters.</li>
  </ul>
</section>

<!-- 6 -->
<section class="terms-section" id="sec-6">
  <div class="terms-section-num">06</div>
  <h3>Investor &amp; Recruiter Access</h3>
  <p>Users accessing the Platform as Investors or Recruiters agree that:</p>
  <ul class="terms-list">
    <li>All investment decisions are made independently and at your sole discretion. InnoVerse does not provide financial, legal, or investment advice.</li>
    <li>AI match scores and recommendations are algorithmic outputs and do not constitute endorsements or guarantees.</li>
    <li>You will not use candidate or startup data obtained through the Platform for any purpose other than legitimate investment or recruitment activities.</li>
    <li>You will comply with all applicable employment, data protection, and anti-discrimination laws when accessing talent profiles.</li>
    <li>Verified status on the Platform is subject to periodic review and may be revoked at InnoVerse's discretion.</li>
  </ul>
</section>

<!-- 7 — REVENUE SHARE -->
<section class="terms-section terms-section-highlight" id="sec-7">
  <div class="terms-section-num">07</div>
  <div class="terms-highlight-badge"><i class="fas fa-rupee-sign"></i> Revenue Share</div>
  <h3>Revenue Share &amp; Platform Fee</h3>
  <p>In consideration of the services provided by InnoVerse — including AI-powered matching, startup visibility, investor introductions, and recruiter access — the following revenue sharing arrangement applies to all commercial activities facilitated through the Platform:</p>

  <div class="terms-fee-box">
    <div class="terms-fee-icon"><i class="fas fa-percentage"></i></div>
    <div>
      <div class="terms-fee-title">1% Annual Platform Revenue Share</div>
      <div class="terms-fee-desc">
        Each registered startup, business entity, or commercial user that generates revenue as a direct or indirect result of connections, introductions, investments, or hires facilitated through the InnoVerse Platform agrees to remit to InnoVerse Technologies Private Limited a fee equal to <strong>one percent (1%) of their gross annual profit</strong> attributable to Platform-facilitated activities, payable annually within ninety (90) days of the close of each financial year.
      </div>
    </div>
  </div>

  <p>The following additional terms govern this revenue share arrangement:</p>
  <ul class="terms-list">
    <li><strong>Scope:</strong> The 1% fee applies to gross profit generated from any investment secured, hire made, partnership formed, or commercial transaction initiated through a connection originating on the InnoVerse Platform.</li>
    <li><strong>Attribution Period:</strong> The revenue share obligation applies for a period of three (3) years from the date of the initial Platform-facilitated connection or transaction.</li>
    <li><strong>Reporting:</strong> Users subject to this obligation must submit an annual self-declaration of applicable revenue within sixty (60) days of their financial year-end. InnoVerse reserves the right to request supporting documentation.</li>
    <li><strong>Payment:</strong> Fees are payable in Indian Rupees (INR) via bank transfer or such other method as InnoVerse may designate. Late payments shall accrue interest at 1.5% per month.</li>
    <li><strong>Exemptions:</strong> Startups with annual gross profit below ₹5,00,000 (Five Lakh Rupees) in a given financial year are exempt from the revenue share obligation for that year.</li>
    <li><strong>Audit Rights:</strong> InnoVerse reserves the right, upon thirty (30) days' written notice, to audit relevant financial records to verify compliance with this clause.</li>
    <li><strong>Non-Waiver:</strong> Failure by InnoVerse to enforce this provision in any instance shall not constitute a waiver of its rights.</li>
  </ul>
  <p>This revenue share arrangement is a material condition of your use of the Platform. Continued use of the Platform constitutes acceptance of this obligation.</p>
</section>

<!-- 8 -->
<section class="terms-section" id="sec-8">
  <div class="terms-section-num">08</div>
  <h3>Intellectual Property</h3>
  <p>All content, features, and functionality of the Platform — including but not limited to software, algorithms, design, text, graphics, logos, and AI models — are the exclusive property of InnoVerse Technologies Private Limited and are protected by applicable intellectual property laws.</p>
  <p>You retain ownership of content you submit to the Platform. By submitting content, you grant InnoVerse a non-exclusive, worldwide, royalty-free licence to use, reproduce, modify, and display such content solely for the purpose of operating and improving the Platform.</p>
  <p>You may not copy, modify, distribute, sell, or lease any part of the Platform or its content without prior written consent from InnoVerse.</p>
</section>

<!-- 9 -->
<section class="terms-section" id="sec-9">
  <div class="terms-section-num">09</div>
  <h3>AI Features &amp; Data Processing</h3>
  <p>The Platform employs artificial intelligence and machine learning technologies to provide matching, scoring, and recommendation services. You acknowledge and agree that:</p>
  <ul class="terms-list">
    <li>AI-generated scores, matches, and recommendations are probabilistic outputs and may not be accurate in all cases.</li>
    <li>InnoVerse does not guarantee the accuracy, completeness, or fitness for purpose of any AI-generated output.</li>
    <li>Your data, including profile information, skills, and activity on the Platform, may be used to train and improve AI models, subject to applicable data protection laws.</li>
    <li>You may opt out of AI-based processing by contacting us at <strong>privacy@innoverse.in</strong>, subject to limitations on Platform functionality.</li>
  </ul>
</section>

<!-- 10 -->
<section class="terms-section" id="sec-10">
  <div class="terms-section-num">10</div>
  <h3>Biometric Data (Face ID &amp; Gesture Verification)</h3>
  <p>The Platform offers optional biometric authentication features, including Face ID and hand gesture verification. By enabling these features, you expressly consent to:</p>
  <ul class="terms-list">
    <li>The collection and local processing of facial geometry data and hand landmark data for authentication purposes.</li>
    <li>Storage of biometric descriptors in your browser's local storage on your device. This data is <strong>never transmitted to InnoVerse servers</strong>.</li>
    <li>The use of TensorFlow.js and MediaPipe libraries, which process biometric data entirely on-device.</li>
  </ul>
  <p>You may delete your biometric data at any time through the Profile settings. InnoVerse does not retain biometric data on its servers and is not responsible for data stored locally on your device.</p>
</section>

<!-- 11 -->
<section class="terms-section" id="sec-11">
  <div class="terms-section-num">11</div>
  <h3>Privacy &amp; Data Protection</h3>
  <p>InnoVerse is committed to protecting your personal data in accordance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and applicable data protection regulations.</p>
  <p>Our Privacy Policy, available at <strong>innoverse.in/privacy</strong>, describes how we collect, use, store, and share your personal information. By using the Platform, you consent to the data practices described in the Privacy Policy.</p>
</section>

<!-- 12 -->
<section class="terms-section" id="sec-12">
  <div class="terms-section-num">12</div>
  <h3>Prohibited Conduct</h3>
  <p>You agree not to engage in any of the following activities:</p>
  <ul class="terms-list">
    <li>Submitting false, misleading, or fraudulent information, including fake startup registrations or fabricated credentials.</li>
    <li>Attempting to circumvent, disable, or interfere with the Platform's security features or AI systems.</li>
    <li>Scraping, harvesting, or systematically extracting data from the Platform without prior written consent.</li>
    <li>Using the Platform to spam, harass, or send unsolicited communications to other users.</li>
    <li>Impersonating any person or entity, or misrepresenting your affiliation with any organisation.</li>
    <li>Uploading malicious code, viruses, or any content that could harm the Platform or its users.</li>
    <li>Using the Platform for any unlawful purpose or in violation of applicable laws and regulations.</li>
  </ul>
  <p>Violation of these prohibitions may result in immediate account suspension, termination, and legal action.</p>
</section>

<!-- 13 -->
<section class="terms-section" id="sec-13">
  <div class="terms-section-num">13</div>
  <h3>Disclaimers &amp; Limitation of Liability</h3>
  <p>The Platform is provided on an "as is" and "as available" basis without warranties of any kind, express or implied. InnoVerse expressly disclaims all warranties, including merchantability, fitness for a particular purpose, and non-infringement.</p>
  <p>To the maximum extent permitted by applicable law, InnoVerse shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use the Platform.</p>
  <p>InnoVerse's total aggregate liability to you for any claims arising under these Terms shall not exceed the greater of (a) the total fees paid by you to InnoVerse in the twelve (12) months preceding the claim, or (b) ₹10,000 (Ten Thousand Rupees).</p>
</section>

<!-- 14 -->
<section class="terms-section" id="sec-14">
  <div class="terms-section-num">14</div>
  <h3>Indemnification</h3>
  <p>You agree to indemnify, defend, and hold harmless InnoVerse Technologies Private Limited, its directors, officers, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or in connection with: (a) your use of the Platform; (b) your violation of these Terms; (c) your violation of any third-party rights; or (d) any content you submit to the Platform.</p>
</section>

<!-- 15 -->
<section class="terms-section" id="sec-15">
  <div class="terms-section-num">15</div>
  <h3>Termination</h3>
  <p>InnoVerse reserves the right to suspend or terminate your account and access to the Platform at any time, with or without notice, for any reason, including but not limited to violation of these Terms.</p>
  <p>Upon termination, your right to use the Platform ceases immediately. Revenue share obligations accrued prior to termination remain enforceable. Provisions of these Terms that by their nature should survive termination shall continue in full force and effect.</p>
</section>

<!-- 16 -->
<section class="terms-section" id="sec-16">
  <div class="terms-section-num">16</div>
  <h3>Governing Law &amp; Dispute Resolution</h3>
  <p>These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of <strong>New Delhi, India</strong>.</p>
  <p>Prior to initiating legal proceedings, the parties agree to attempt resolution through good-faith negotiation for a period of thirty (30) days. If unresolved, disputes shall be referred to binding arbitration under the Arbitration and Conciliation Act, 1996.</p>
</section>

<!-- 17 -->
<section class="terms-section" id="sec-17">
  <div class="terms-section-num">17</div>
  <h3>Amendments</h3>
  <p>InnoVerse reserves the right to modify these Terms at any time. We will provide notice of material changes by updating the "Last Updated" date at the top of this page and, where appropriate, by sending an email notification to registered users.</p>
  <p>Your continued use of the Platform following the effective date of any amendment constitutes your acceptance of the revised Terms. If you do not agree to the amended Terms, you must discontinue use of the Platform.</p>
</section>

<!-- 18 -->
<section class="terms-section" id="sec-18">
  <div class="terms-section-num">18</div>
  <h3>Contact Information</h3>
  <p>For questions, concerns, or notices regarding these Terms, please contact:</p>
  <div class="terms-contact-box">
    <div class="tcb-row"><i class="fas fa-building"></i><span><strong>InnoVerse Technologies Private Limited</strong></span></div>
    <div class="tcb-row"><i class="fas fa-map-marker-alt"></i><span>91 Springboard, Connaught Place, New Delhi — 110001, India</span></div>
    <div class="tcb-row"><i class="fas fa-envelope"></i><span>legal@innoverse.in</span></div>
    <div class="tcb-row"><i class="fas fa-shield-alt"></i><span>privacy@innoverse.in (Data Protection Officer)</span></div>
    <div class="tcb-row"><i class="fas fa-phone"></i><span>+91 11 4567 8900</span></div>
  </div>
</section>

<div class="terms-acceptance-box">
  <i class="fas fa-check-circle"></i>
  <div>
    <strong>You have accepted these Terms</strong>
    <p>By using InnoVerse, you confirm your acceptance of these Terms &amp; Conditions, including the 1% annual revenue share obligation described in Section 7.</p>
  </div>
</div>
    `;
  },

  injectStyles() {
    if (document.getElementById('terms-styles')) return;
    const s = document.createElement('style');
    s.id = 'terms-styles';
    s.textContent = `
.terms-header {
  display: flex; align-items: center; gap: 20px; margin-bottom: 32px;
  padding: 24px 28px; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
}
.terms-header-icon {
  width: 56px; height: 56px; border-radius: 14px; flex-shrink: 0;
  background: var(--gradient-primary); display: flex; align-items: center;
  justify-content: center; font-size: 1.4rem; color: #fff;
  box-shadow: 0 8px 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
}
.terms-header h2 { margin-bottom: 4px; }
.terms-header p { font-size: 0.82rem; color: var(--text-muted); }
.terms-header .btn { margin-left: auto; flex-shrink: 0; }

.terms-layout { display: grid; grid-template-columns: 240px 1fr; gap: 28px; align-items: start; }

/* TOC */
.terms-toc {
  position: sticky; top: 24px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04);
  max-height: calc(100vh - 80px); overflow-y: auto;
}
.toc-title {
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--accent-purple); margin-bottom: 12px;
}
.toc-link {
  display: flex; align-items: center; gap: 8px; padding: 7px 10px;
  border-radius: var(--radius-sm); font-size: 0.78rem; color: var(--text-muted);
  cursor: pointer; transition: var(--transition); text-decoration: none;
  border-left: 2px solid transparent;
}
.toc-link:hover { color: var(--text-primary); background: var(--bg-glass); }
.toc-link.active { color: var(--accent-purple-light); border-left-color: var(--accent-purple); background: rgba(124,58,237,0.08); }
.toc-num {
  font-size: 0.65rem; font-weight: 700; color: var(--text-muted);
  min-width: 18px;
}

/* Body */
.terms-body { display: flex; flex-direction: column; gap: 0; }
.terms-preamble {
  display: flex; align-items: flex-start; gap: 14px; padding: 20px 24px;
  background: rgba(124,58,237,0.07); border: 1px solid rgba(124,58,237,0.2);
  border-radius: var(--radius-lg); margin-bottom: 24px;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.15);
}
.terms-preamble i { color: var(--accent-purple); font-size: 1.2rem; margin-top: 2px; flex-shrink: 0; }
.terms-preamble p { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.7; }

.terms-section {
  padding: 28px 32px; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); margin-bottom: 16px; position: relative;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04);
  transition: box-shadow 0.3s ease;
  scroll-margin-top: 24px;
}
.terms-section:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
}
.terms-section-num {
  position: absolute; top: 20px; right: 24px;
  font-size: 2.5rem; font-weight: 900; color: rgba(255,255,255,0.03);
  font-family: 'Space Grotesk', sans-serif; line-height: 1; pointer-events: none;
  user-select: none;
}
.terms-section h3 {
  font-size: 1.05rem; margin-bottom: 14px; color: var(--text-primary);
  display: flex; align-items: center; gap: 10px;
}
.terms-section p { font-size: 0.875rem; line-height: 1.8; color: var(--text-secondary); margin-bottom: 12px; }
.terms-section p:last-child { margin-bottom: 0; }

/* Highlighted Revenue Share section */
.terms-section-highlight {
  border-color: rgba(245,158,11,0.3);
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(245,158,11,0.04) 100%);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 40px rgba(245,158,11,0.08),
    inset 0 1px 0 rgba(255,255,255,0.05);
}
.terms-highlight-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: var(--radius-full);
  background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3);
  color: #fbbf24; font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px;
}
.terms-fee-box {
  display: flex; align-items: flex-start; gap: 16px;
  background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25);
  border-radius: var(--radius-lg); padding: 20px; margin: 16px 0;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.15), 0 0 20px rgba(245,158,11,0.06);
}
.terms-fee-icon {
  width: 44px; height: 44px; border-radius: var(--radius-md); flex-shrink: 0;
  background: linear-gradient(135deg,#f59e0b,#ef4444); display: flex;
  align-items: center; justify-content: center; font-size: 1.2rem; color: #fff;
  box-shadow: 0 6px 16px rgba(245,158,11,0.4);
}
.terms-fee-title { font-size: 1rem; font-weight: 700; margin-bottom: 8px; color: #fbbf24; }
.terms-fee-desc { font-size: 0.875rem; line-height: 1.8; color: var(--text-secondary); }

/* Lists */
.terms-list { list-style: none; display: flex; flex-direction: column; gap: 8px; margin: 12px 0; }
.terms-list li {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 0.875rem; color: var(--text-secondary); line-height: 1.7;
  padding: 8px 12px; background: var(--bg-secondary);
  border-radius: var(--radius-sm); border-left: 2px solid rgba(124,58,237,0.3);
}
.terms-list li::before {
  content: '→'; color: var(--accent-purple); font-weight: 700;
  flex-shrink: 0; margin-top: 1px;
}

/* Contact box */
.terms-contact-box {
  background: var(--bg-secondary); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 20px; margin-top: 12px;
  display: flex; flex-direction: column; gap: 10px;
}
.tcb-row { display: flex; align-items: center; gap: 12px; font-size: 0.875rem; }
.tcb-row i { color: var(--accent-purple); width: 16px; text-align: center; }

/* Acceptance box */
.terms-acceptance-box {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 24px; background: rgba(16,185,129,0.07);
  border: 1px solid rgba(16,185,129,0.25); border-radius: var(--radius-lg);
  margin-top: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2), 0 0 30px rgba(16,185,129,0.06);
}
.terms-acceptance-box i { color: var(--accent-green); font-size: 1.5rem; flex-shrink: 0; margin-top: 2px; }
.terms-acceptance-box strong { display: block; margin-bottom: 4px; color: var(--accent-green); }
.terms-acceptance-box p { font-size: 0.82rem; margin: 0; }

@media(max-width:900px) {
  .terms-layout { grid-template-columns: 1fr; }
  .terms-toc { position: static; max-height: none; }
}
@media print {
  .terms-toc, .terms-header .btn, #sidebar, #cursor-glow, .ambient-light { display: none !important; }
  .terms-layout { grid-template-columns: 1fr; }
  .terms-section { break-inside: avoid; }
}
    `;
    document.head.appendChild(s);
  }
};
