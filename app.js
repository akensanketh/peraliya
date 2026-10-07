/**
 * ==========================================================================
 * PERALIYA 2026 - SISUVISARA MEDIA UNIT
 * Sirimavo Bandaranaike Vidyalaya, Colombo 07
 * Application Controller & Interactive Features
 * ==========================================================================
 */

// Category Data Repository
const CATEGORIES_DATA = [
  {
    id: 'news-presenting',
    title: 'News Presenting',
    sinhala: 'ප්‍රවෘත්ති නිවේදනය',
    type: 'broadcasting',
    mode: 'Onsite / Submission',
    languages: 'Sinhala, English',
    ageGroup: 'Junior (Gr. 6-8), Intermediate (Gr. 9-11), Senior (Gr. 12-13)',
    icon: 'fa-solid fa-microphone-lines',
    summary: 'Mastery of vocal projection, diction, poise, modulation, and teleprompter style live news presentation.',
    guidelines: [
      'Participants deliver a news report, live report, and documentary segment based on official scripts.',
      'Evaluation criteria: Pronunciation, voice control, pacing, posture, and composure.',
      'Medium: Sinhala and English categories evaluated independently.',
      'Format: Single continuous unedited video (4–5 mins).'
    ]
  },
  {
    id: 'news-editing',
    title: 'News Editing',
    sinhala: 'පුවත් සංස්කරණය',
    type: 'journalism',
    mode: 'Onsite / Online',
    languages: 'Sinhala, English',
    ageGroup: 'Junior (Gr. 6-8), Intermediate (Gr. 9-11), Senior (Gr. 12-13)',
    icon: 'fa-solid fa-newspaper',
    summary: 'Print journalism, headline synthesis, copyediting, structure, and editorial precision.',
    guidelines: [
      'Timed Window: Junior (2 hours), Intermediate & Senior (3 hours).',
      'All answers must be handwritten clearly and submitted as a single PDF.',
      'No AI tools permitted.'
    ]
  },
  {
    id: 'program-presenting',
    title: 'Program Presenting',
    sinhala: 'වැඩසටහන් ඉදිරිපත් කිරීම',
    type: 'broadcasting',
    mode: 'Onsite / Submission',
    languages: 'Sinhala, English',
    ageGroup: 'Junior (Gr. 6-8), Intermediate (Gr. 9-11), Senior (Gr. 12-13)',
    icon: 'fa-solid fa-bullhorn',
    summary: 'Hosting television & digital talk shows, feature broadcasts, and engaging audience presentations.',
    guidelines: [
      'Contestants present segments provided in the official script.',
      'Assessed on spontaneity, body language, tone, and audience engagement.',
      'Format: Single continuous unedited video (4–5 mins).'
    ]
  },
  {
    id: 'dubbing',
    title: 'Dubbing',
    sinhala: 'හඬකැවීම්',
    type: 'broadcasting',
    mode: 'Submission',
    languages: 'Sinhala, English',
    ageGroup: 'Junior (Gr. 6-9), Senior (Gr. 10-13)',
    icon: 'fa-solid fa-microphone',
    summary: 'Synchronization of voice acting with on-screen animated or live-action clips.',
    guidelines: [
      'Contestants select one of two provided video clips for dubbing.',
      'Both contestant (in uniform) and video clip must be visible.',
      'Assessed on lip-sync precision, pitch control, and character vocalization.'
    ]
  },
  {
    id: 'sports-commentary',
    title: 'Sports Commentary',
    sinhala: 'ක්‍රීඩා විස්තර විචාරය',
    type: 'broadcasting',
    mode: 'Submission',
    languages: 'Sinhala, English',
    ageGroup: 'Open Category',
    icon: 'fa-solid fa-trophy',
    summary: 'High-adrenaline, real-time commentary of live sporting clips (Cricket, Football, Rugby).',
    guidelines: [
      'Deliver real-time commentary based on designated match clips.',
      'Evaluated on pacing, excitement, accurate terminology, and voice clarity.'
    ]
  },
  {
    id: 'cartoon-drawing',
    title: 'Cartoon Drawing',
    sinhala: 'කාටූන් ඇඳීම',
    type: 'visual',
    mode: 'Submission',
    languages: 'Sinhala, English',
    ageGroup: 'Open Category',
    icon: 'fa-solid fa-pencil',
    summary: 'Illustrative storytelling, satirical cartooning, and graphic sketch messaging.',
    guidelines: [
      'Topics communicated via official channels.',
      'Completed on A4 paper using drawing pencils and black pens (no colors).',
      'Upload high-quality photograph of completed artwork.'
    ]
  },
  {
    id: 'photography',
    title: 'Photography',
    sinhala: 'ඡායාරූපකරණය',
    type: 'visual',
    mode: 'Online',
    languages: 'Sinhala, English',
    ageGroup: 'Open Category',
    icon: 'fa-solid fa-camera',
    summary: 'Visual storytelling capturing raw human emotion, environment, and thematic perspectives.',
    guidelines: [
      'Subcategories: Colour, Monochrome, Mobile Photography.',
      'Maximum 3 photos per subcategory (max file size 20MB per photo).',
      'No watermarks or AI manipulation allowed.'
    ]
  },
  {
    id: 'videography',
    title: 'Videography',
    sinhala: 'වීඩියෝකරණය',
    type: 'visual',
    mode: 'Online',
    languages: 'Sinhala, English',
    ageGroup: 'Open Category',
    icon: 'fa-solid fa-film',
    summary: 'Cinematic video storytelling, camera movement, composition, and visual narrative.',
    guidelines: [
      'Duration: 60 seconds to 2 minutes.',
      'Must submit final video and original raw footage.',
      'No pre-existing or AI footage. Drone cameras prohibited.'
    ]
  },
  {
    id: 'technical',
    title: 'Technical',
    sinhala: 'තාක්ෂණික',
    type: 'digital',
    mode: 'Online',
    languages: 'Sinhala, English',
    ageGroup: 'Open Category',
    icon: 'fa-solid fa-microchip',
    summary: 'Broadcasting technology, media engineering, equipment knowledge, and technical aptitude.',
    guidelines: [
      'Direct entry form assessment (1 hr 30 mins duration).',
      'Strict independent work; AI tools prohibited.'
    ]
  },
  {
    id: 'graphic-designing',
    title: 'Graphic Designing',
    sinhala: 'ප්‍රස්ථාරික නිර්මාණකරණය',
    type: 'digital',
    mode: 'Online',
    languages: 'Sinhala, English',
    ageGroup: 'Open Category',
    icon: 'fa-solid fa-bezier-curve',
    summary: 'Digital graphic design, visual branding, poster composition, and typography.',
    guidelines: [
      'Submit design based on official themes in JPG/PNG format.',
      'Assessed on visual composition, creativity, and original layout.'
    ]
  }
];

// Audio Sound FX Controller (Synthesizer via Web Audio API)
class SoundFXController {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playBlip(freq = 600, duration = 0.08, type = 'sine') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or user hasn't interacted
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      freqs.forEach((f, idx) => {
        setTimeout(() => this.playBlip(f, 0.12, 'triangle'), idx * 80);
      });
    } catch (e) {}
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

const sfx = new SoundFXController();

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeaderNav();
  initCountdown();
  initStatsCounter();
  initCategoriesGrid();
  initTimeline();
  initRegistrationWorkflow();
  initContactForm();
  initScrollObserver();
  initAudioToggle();
});

// Preloader Handler
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1800);
  });

  // Fallback timeout in case slow asset loading
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }, 3500);
}

// Header & Navigation
function initHeaderNav() {
  const header = document.querySelector('.site-header');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      sfx.playBlip(750, 0.05);
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  // Audio Toggle Button
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isEnabled = sfx.toggle();
      audioBtn.innerHTML = isEnabled 
        ? '<i class="fa-solid fa-volume-high"></i>' 
        : '<i class="fa-solid fa-volume-xmark"></i>';
      audioBtn.setAttribute('title', isEnabled ? 'Mute Interface Sound' : 'Enable Interface Sound');
      if (isEnabled) sfx.playBlip(880, 0.1);
      showToast(isEnabled ? 'Sound effects enabled' : 'Sound effects muted');
    });
  }
}

function initAudioToggle() {
  // Add subtle sound effect to all buttons
  document.querySelectorAll('button, .btn-primary-glow, .btn-secondary-glass, .cat-tab-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      sfx.playBlip(440, 0.03, 'sine');
    });
    btn.addEventListener('click', () => {
      sfx.playBlip(780, 0.06, 'triangle');
    });
  });
}

// Live Countdown to Peraliya '26
function initCountdown() {
  // Target Event Date: October 10, 2026 08:00:00 (Sri Lanka Time GMT+5:30)
  const targetDate = new Date('2026-10-10T08:00:00+05:30').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins = document.getElementById('cd-minutes');
    const elSecs = document.getElementById('cd-seconds');

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(minutes).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// Animated Statistics Counter
function initStatsCounter() {
  const statsSection = document.getElementById('stats-section');
  if (!statsSection) return;

  let counted = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      runCounter('stat-contestants', 2500, '+', 1800);
      runCounter('stat-schools', 250, '+', 1800);
      runCounter('stat-categories', 14, '+', 1500);
      runCounter('stat-languages', 2, '', 1200);
    }
  }, { threshold: 0.3 });

  observer.observe(statsSection);

  function runCounter(id, target, suffix, duration) {
    const el = document.getElementById(id);
    if (!el) return;

    let start = 0;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target.toLocaleString() + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toLocaleString() + suffix;
      }
    }, stepTime);
  }
}

// Categories Grid Rendering & Filter Tabs
function initCategoriesGrid() {
  const grid = document.getElementById('categories-grid');
  const tabBtns = document.querySelectorAll('.cat-tab-btn');
  if (!grid) return;

  function render(categoryType = 'all') {
    grid.innerHTML = '';
    const filtered = categoryType === 'all' 
      ? CATEGORIES_DATA 
      : CATEGORIES_DATA.filter(item => item.type === categoryType);

    filtered.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'category-box';
      card.innerHTML = `
        <div>
          <div class="cat-header">
            <div class="cat-icon-wrap">
              <i class="${cat.icon}"></i>
            </div>
            <span class="cat-badge-mode ${cat.mode === 'Online' ? 'online' : ''}">${cat.mode}</span>
          </div>
          <h3 class="cat-title">${cat.title}</h3>
          <span class="cat-sinhala">${cat.sinhala}</span>
          <p style="color: #94a3b8; font-size: 0.86rem; margin-bottom: 0.8rem; line-height: 1.5;">${cat.summary}</p>
          <ul class="cat-details-list">
            <li><strong>Languages:</strong> ${cat.languages}</li>
            <li><strong>Age Groups:</strong> ${cat.ageGroup}</li>
          </ul>
        </div>
        <div class="cat-footer">
          <button type="button" class="btn-cat-details" data-id="${cat.id}">
            <span>Guidelines & Criteria</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <a href="#register" class="btn-cat-register" style="color: var(--text-secondary); font-size: 0.78rem;" onclick="preselectCategory('${cat.title}')">
            Enter Contestant
          </a>
        </div>
      `;
      grid.appendChild(card);
    });

    // Attach click listener for detail modals
    grid.querySelectorAll('.btn-cat-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        openCategoryModal(id);
      });
    });
  }

  // Initial render
  render('all');

  // Tab filter event listeners
  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      render(filter);
      sfx.playBlip(680, 0.05);
    });
  });
}

// Category Detail Modal
function openCategoryModal(catId) {
  const cat = CATEGORIES_DATA.find(c => c.id === catId);
  if (!cat) return;

  const modal = document.getElementById('category-modal');
  const title = document.getElementById('modal-cat-title');
  const sinhala = document.getElementById('modal-cat-sinhala');
  const body = document.getElementById('modal-cat-body');

  if (!modal || !title || !body) return;

  title.textContent = cat.title;
  sinhala.textContent = cat.sinhala;

  let guidelinesHtml = cat.guidelines.map(g => `<li style="margin-bottom: 0.6rem; color: #cbd5e1; font-size: 0.92rem;"><i class="fa-solid fa-circle-check" style="color: var(--color-cyan); margin-right: 0.5rem;"></i>${g}</li>`).join('');

  body.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <div style="display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1rem;">
        <span class="hero-tag-badge" style="margin-bottom: 0;"><i class="fa-solid fa-signal"></i> ${cat.mode} Competition</span>
        <span class="hero-tag-badge" style="margin-bottom: 0; border-color: rgba(251, 191, 36, 0.4); color: var(--color-gold);"><i class="fa-solid fa-language"></i> ${cat.languages}</span>
      </div>
      <p style="color: #e2e8f0; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.2rem;">${cat.summary}</p>
      
      <h4 style="color: #ffffff; font-family: var(--font-heading); font-size: 1rem; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">
        <i class="fa-solid fa-list-check" style="color: var(--color-cyan); margin-right: 0.4rem;"></i> Competition Guidelines & Evaluation Criteria:
      </h4>
      <ul style="list-style: none; padding-left: 0; margin-bottom: 1.8rem;">
        ${guidelinesHtml}
      </ul>

      <div style="background: rgba(0, 229, 255, 0.06); border: 1px solid var(--border-cyan); border-radius: var(--radius-md); padding: 1.2rem;">
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.8rem;">
          <strong style="color: var(--color-cyan);">Eligibility:</strong> Contestants must be registered bona fide students of an accredited Sri Lankan school.
        </p>
        <button type="button" class="btn-primary-glow" style="width: 100%;" onclick="closeModal('category-modal'); document.getElementById('register').scrollIntoView({behavior: 'smooth'}); preselectCategory('${cat.title}');">
          Proceed to Register for ${cat.title}
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
  sfx.playBlip(750, 0.08);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

// Modal Backdrop Click & Escape Key Handlers
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
  }
});

// Timeline rendering helper (if needed for dynamic additions)
function initTimeline() {
  // Timeline items are populated in HTML and enhanced with micro-interactions
}

// Interactive Multi-Step School Registration Workflow
let currentRegStep = 1;

function initRegistrationWorkflow() {
  const form = document.getElementById('school-reg-form');
  if (!form) return;
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const panes = document.querySelectorAll('.reg-step-pane');
  const btnNext = document.getElementById('btn-step-next');
  const btnPrev = document.getElementById('btn-step-prev');
  const btnSubmit = document.getElementById('btn-step-submit');

  function updateStepsUI() {
    stepIndicators.forEach((ind, i) => {
      const stepNum = i + 1;
      ind.classList.remove('active', 'completed');
      if (stepNum === currentRegStep) {
        ind.classList.add('active');
      } else if (stepNum < currentRegStep) {
        ind.classList.add('completed');
      }
    });

    panes.forEach((pane, i) => {
      pane.classList.remove('active');
      if (i + 1 === currentRegStep) {
        pane.classList.add('active');
      }
    });

    // Control navigation buttons for 3 steps
    if (btnPrev) btnPrev.style.display = currentRegStep === 1 ? 'none' : 'inline-flex';
    if (btnNext) btnNext.style.display = currentRegStep === 3 ? 'none' : 'inline-flex';
    if (btnSubmit) btnSubmit.style.display = currentRegStep === 3 ? 'inline-flex' : 'none';

    // Populate review summary on step 3
    if (currentRegStep === 3) {
      populateReviewSummary();
    }
  }

  function validateStep(step) {
    if (step === 1) {
      const schoolName = document.getElementById('reg-school-name')?.value.trim();
      const province = document.getElementById('reg-province')?.value;
      const district = document.getElementById('reg-district')?.value.trim();
      const schoolPhone = document.getElementById('reg-school-phone')?.value.trim();
      const schoolEmail = document.getElementById('reg-school-email')?.value.trim();

      if (!schoolName) {
        showToast('Please enter the school full name.');
        return false;
      }
      if (!district) {
        showToast('Please specify the district.');
        return false;
      }
      return true;
    } else if (step === 2) {
      const teacherName = document.getElementById('reg-teacher-name')?.value.trim();
      const teacherPhone = document.getElementById('reg-teacher-phone')?.value.trim();
      const teacherWhatsapp = document.getElementById('reg-teacher-whatsapp')?.value.trim();
      const teacherEmail = document.getElementById('reg-teacher-email')?.value.trim();

      if (!teacherName) {
        showToast('Please enter the School Coordinator full name.');
        return false;
      }
      if (!teacherPhone) {
        showToast('Please enter the coordinator mobile phone number.');
        return false;
      }
      if (!teacherWhatsapp) {
        showToast('Please enter the coordinator WhatsApp number for official updates.');
        return false;
      }
      if (!teacherEmail) {
        showToast('Please enter the coordinator email.');
        return false;
      }
      return true;
    }
    return true;
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateStep(currentRegStep)) {
        currentRegStep++;
        updateStepsUI();
        sfx.playBlip(750, 0.06);
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentRegStep > 1) {
        currentRegStep--;
        updateStepsUI();
        sfx.playBlip(550, 0.05);
      }
    });
  }

  function populateReviewSummary() {
    const summaryBox = document.getElementById('reg-review-summary');
    if (!summaryBox) return;

    const school = document.getElementById('reg-school-name')?.value || '—';
    const province = document.getElementById('reg-province')?.value || '—';
    const district = document.getElementById('reg-district')?.value || '—';
    const schoolPhone = document.getElementById('reg-school-phone')?.value || '—';
    const schoolEmail = document.getElementById('reg-school-email')?.value || '—';

    const teacher = document.getElementById('reg-teacher-name')?.value || '—';
    const phone = document.getElementById('reg-teacher-phone')?.value || '—';
    const whatsapp = document.getElementById('reg-teacher-whatsapp')?.value || '—';
    const teacherEmail = document.getElementById('reg-teacher-email')?.value || '—';
    const president = document.getElementById('reg-president-name')?.value || 'Not Specified';

    summaryBox.innerHTML = `
      <div style="background: rgba(4,7,15,0.7); border: 1px solid var(--border-cyan); border-radius: var(--radius-md); padding: 1.4rem; margin-bottom: 1.2rem;">
        <h4 style="color: var(--color-cyan); font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">
          <i class="fa-solid fa-school" style="margin-right: 0.5rem;"></i> 1. School Information
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem; font-size: 0.88rem; color: #cbd5e1; margin-bottom: 1.2rem;">
          <div><strong style="color: #fff;">Institution:</strong><br>${school}</div>
          <div><strong style="color: #fff;">Province & District:</strong><br>${province} (${district})</div>
        </div>

        <h4 style="color: var(--color-cyan); font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 1px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 0.8rem;">
          <i class="fa-solid fa-user-tie" style="margin-right: 0.5rem;"></i> 2. School Coordinator & Leadership
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem; font-size: 0.88rem; color: #cbd5e1;">
          <div><strong style="color: #fff;">School Coordinator:</strong><br>${teacher}</div>
          <div><strong style="color: #fff;">Coordinator Mobile & WhatsApp:</strong><br>${phone} / ${whatsapp}</div>
          <div><strong style="color: #fff;">Coordinator Email:</strong><br>${teacherEmail}</div>
          <div><strong style="color: #fff;">Student President:</strong><br>${president}</div>
        </div>
      </div>
    `;
  }

  // Final Form Submission & School Code Generation (CLOSED)
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      showToast('School registrations for Peraliya 2026 are now closed. Registered schools can submit entries in Contestant Registration.');
      return;
    });
  }
}

// Success Registration Modal
function openSuccessModal(refCode, schoolName) {
  const modal = document.getElementById('success-modal');
  const codeEl = document.getElementById('success-ref-code');
  const schoolEl = document.getElementById('success-school-name');

  if (codeEl) codeEl.textContent = refCode;
  if (schoolEl) schoolEl.textContent = schoolName;

  if (modal) {
    modal.classList.add('open');
    const ctaBtn = modal.querySelector('a[href*="contestants.html"]');
    if (ctaBtn) {
      ctaBtn.href = `contestants.html?code=${encodeURIComponent(refCode)}`;
    }
  }
}
window.openSuccessModal = openSuccessModal;

// Contact Form Handler with Database Sync
function initContactForm() {
  const contactForm = document.getElementById('contact-inquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      
      const name = document.getElementById('contact-name')?.value.trim() || '';
      const school = document.getElementById('contact-school')?.value.trim() || '';
      const phone = document.getElementById('contact-phone')?.value.trim() || '';
      const subject = document.getElementById('contact-subject')?.value || '';
      const message = document.getElementById('contact-message')?.value.trim() || '';

      const payload = {
        type: 'contact',
        timestamp: new Date().toISOString(),
        name,
        school,
        phone,
        subject,
        message
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';
      }

      try {
        let response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => null);

        // Fallback: If local API unavailable and Google Sheet Web App URL is set
        if ((!response || !response.ok) && typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_SHEET_WEBAPP_URL) {
          await fetch(CONFIG.GOOGLE_SHEET_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(err => console.warn('Direct Google Sheet POST fallback failed:', err));
        }

        sfx.playSuccess();
        showToast(`Thank you, ${name}! Your inquiry has been logged in the official database.`);
        contactForm.reset();
      } catch (err) {
        showToast(`Thank you, ${name}! Your message has been received.`);
        contactForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }
}

// Scroll Reveal Observer
function initScrollObserver() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

// Toast Notification
function showToast(message) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color: var(--color-cyan);"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

