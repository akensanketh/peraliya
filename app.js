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
    id: 'announcing',
    title: 'Announcing & News Reading',
    sinhala: 'ප්‍රවෘත්ති නිවේදන හා ප්‍රකාශන',
    type: 'broadcasting',
    mode: 'Onsite',
    languages: 'Sinhala, English',
    ageGroup: 'Junior (Gr. 6-8), Intermediate (Gr. 9-11), Senior (Gr. 12-13)',
    icon: 'fa-solid fa-microphone-lines',
    summary: 'Mastery of vocal projection, diction, poise, modulation, and teleprompter style live news presentation.',
    guidelines: [
      'Contestants will be provided a scripted news bulletin 15 minutes prior to live reading.',
      'Evaluation criteria: Pronunciation, voice control, pacing, posture, and studio composure.',
      'Medium: Sinhala and English categories will be evaluated independently.',
      'Time duration: 2 - 3 minutes per contestant.'
    ]
  },
  {
    id: 'news-reporting',
    title: 'Field News Reporting',
    sinhala: 'ක්ෂේත්‍ර පුවත් වාර්තාකරණය',
    type: 'journalism',
    mode: 'Onsite',
    languages: 'Sinhala, English',
    ageGroup: 'Intermediate & Senior',
    icon: 'fa-solid fa-newspaper',
    summary: 'Fast-paced investigative journalism, breaking news live coverage simulation, and field standup reporting.',
    guidelines: [
      'Scenario-based breaking news reporting within a simulated disaster or cultural event.',
      'Contestants must craft their own news lead and conduct a 2-minute live standup report.',
      'Assessed on objectivity, news gathering technique, confidence, and linguistic finesse.'
    ]
  },
  {
    id: 'program-presenting',
    title: 'Program Presenting & Hosting',
    sinhala: 'වැඩසටහන් ඉදිරිපත් කිරීම',
    type: 'broadcasting',
    mode: 'Onsite',
    languages: 'Sinhala, English',
    ageGroup: 'Junior & Senior',
    icon: 'fa-solid fa-headset',
    summary: 'Hosting television & digital talk shows, morning shows, or cultural feature broadcasts with charismatic audience engagement.',
    guidelines: [
      'Contestants present a 3-minute segment of an entertainment or youth educational program.',
      'Spontaneity, humor, audience connection, and body language are key criteria.'
    ]
  },
  {
    id: 'sports-commentary',
    title: 'Sports Commentary',
    sinhala: 'ක්‍රීඩා විස්තර විචාරය',
    type: 'broadcasting',
    mode: 'Onsite',
    languages: 'Sinhala, English',
    ageGroup: 'Junior, Intermediate, Senior',
    icon: 'fa-solid fa-trophy',
    summary: 'High-adrenaline, real-time commentary of live sporting clips (Cricket, Football, Athletics, Rugby).',
    guidelines: [
      'Contestants will be played a 2-minute silent match video clip on screen.',
      'Deliver real-time ball-by-ball or play-by-play commentary with accurate terminology.',
      'Pacing, excitement, analytical insight, and voice clarity are strictly evaluated.'
    ]
  },
  {
    id: 'dubbing',
    title: 'Dubbing & Voice Acting',
    sinhala: 'හඬකැවීම් හා චරිතාංග නිරූපණය',
    type: 'broadcasting',
    mode: 'Onsite',
    languages: 'Sinhala, English',
    ageGroup: 'Open (Grades 6 - 13)',
    icon: 'fa-solid fa-masks-theater',
    summary: 'Synchronization of voice acting with on-screen animated or live-action cinematic characters.',
    guidelines: [
      'Muted video snippet will be provided to contestant with rehearsal time.',
      'Lip-sync precision, emotional inflection, character adaptation, and pitch control will be judged.'
    ]
  },
  {
    id: 'photography',
    title: 'Photography & Photojournalism',
    sinhala: 'ඡායාරූපකරණය (තේමාත්මක)',
    type: 'visual',
    mode: 'Online',
    languages: 'N/A',
    ageGroup: 'Junior (Concept) & Senior (Photo Story)',
    icon: 'fa-solid fa-camera',
    summary: 'Visual storytelling capturing raw human emotion, urban life, conservation, or youth transformation.',
    guidelines: [
      'Theme: "Resilience & Metamorphosis / පෙරළියක ඇරඹුම".',
      'Submissions must be original RAW/JPEG with EXIF data intact.',
      'Maximum 3 submissions per contestant. Light color correction allowed; generative AI tampering strictly prohibited.',
      'Deadline: Submit via Google Drive link before online deadline.'
    ]
  },
  {
    id: 'short-film',
    title: 'Short Film & Cinematography',
    sinhala: 'කෙටි චිත්‍රපට නිර්මාණය',
    type: 'visual',
    mode: 'Online',
    languages: 'Sinhala, English (Subtitles encouraged)',
    ageGroup: 'Open (Max 5-member school crew)',
    icon: 'fa-solid fa-film',
    summary: 'Creative direction, cinematography, screenwriting, and sound design encapsulated in a short film.',
    guidelines: [
      'Duration: 3 to 7 minutes (including credits).',
      'Resolution: 1080p Full HD or 4K, uploaded via Google Drive / YouTube unlisted link.',
      'Evaluated on screenplay originality, camera work, color grading, sound mixing, and message delivery.'
    ]
  },
  {
    id: 'ai-film',
    title: 'AI Short Film & Generative Story',
    sinhala: 'කෘතිම බුද්ධි නිර්මාණ (AI Cinema)',
    type: 'digital',
    mode: 'Online',
    languages: 'Bilingual (Sinhala / English) / International',
    ageGroup: 'Open Category',
    icon: 'fa-solid fa-wand-magic-sparkles',
    summary: 'Pioneering generative AI workflows combining cutting-edge text-to-video, generative audio, and futuristic concepts.',
    guidelines: [
      'Duration: 2 to 4 minutes.',
      'Contestants must submit a "Prompt & Workflow Manifesto" detailing tools used (e.g. Midjourney, Runway, Luma, ElevenLabs).',
      'Art direction, coherence of story arc, and ethical AI utilization will be judged by tech media pioneers.'
    ]
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design & Digital Art',
    sinhala: 'ප්‍රස්ථාරික නිර්මාණකරණය',
    type: 'digital',
    mode: 'Online',
    languages: 'N/A',
    ageGroup: 'Junior & Senior',
    icon: 'fa-solid fa-bezier-curve',
    summary: 'Poster art, brand identity design, or digital illustration encapsulating the essence of Peraliya 2026.',
    guidelines: [
      'Theme will be announced on the registration portal 7 days before deadline.',
      'Submit high-res PNG/PDF + raw source file (PSD, AI, or layered vector).',
      'Typography balance, visual hierarchy, color theory, and original conceptualization will be rated.'
    ]
  },
  {
    id: 'video-editing',
    title: 'Video Editing & Motion Graphics',
    sinhala: 'වීඩියෝ සංස්කරණය හා සජීවීකරණය',
    type: 'digital',
    mode: 'Online',
    languages: 'N/A',
    ageGroup: 'Senior Category',
    icon: 'fa-solid fa-sliders',
    summary: 'Dynamic editing, rhythm cutting, sound fx integration, title sequences, and motion graphic mastery.',
    guidelines: [
      'Raw footage package will be provided to participants upon registration.',
      'Create an electrifying 60-second teaser trailer utilizing the provided media assets and music.'
    ]
  },
  {
    id: 'media-quiz',
    title: 'Media Aptitude & Knowledge Quiz',
    sinhala: 'මාධ්‍ය දැනුම මිනුම තරගාවලිය',
    type: 'journalism',
    mode: 'Onsite',
    languages: 'Sinhala, English',
    ageGroup: 'Teams of 3 Students (Intermediate / Senior)',
    icon: 'fa-solid fa-brain',
    summary: 'Rigorous test of world journalism history, Sri Lankan mass media, cinema milestones, and digital communication.',
    guidelines: [
      'Round 1: Written MCQ and rapid-fire screening test.',
      'Round 2: Grand Stage Buzzer Round on Media Day morning for the top 5 schools.'
    ]
  },
  {
    id: 'editorial-writing',
    title: 'Feature Journalism & Editorial',
    sinhala: 'මාධ්‍ය ලිපි හා කතුවැකි රචනය',
    type: 'journalism',
    mode: 'Online',
    languages: 'Sinhala, English',
    ageGroup: 'Junior & Senior',
    icon: 'fa-solid fa-pen-nib',
    summary: 'In-depth feature writing, investigative essays, and commentary on contemporary media ethics.',
    guidelines: [
      'Article word count: 800 - 1200 words in PDF format.',
      'Plagiarism checks will be enforced; originality, coherent thesis, and rhetorical eloquence will decide the winners.'
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

  // Final Form Submission & School Code Generation
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const agree = document.getElementById('reg-terms-check');
      if (agree && !agree.checked) {
        showToast('Please confirm adherence to Peraliya 2026 school registration rules.');
        return;
      }

      // Collect School Information
      const schoolName = document.getElementById('reg-school-name')?.value.trim() || '';
      const province = document.getElementById('reg-province')?.value || '';
      const district = document.getElementById('reg-district')?.value.trim() || '';
      const schoolPhone = document.getElementById('reg-school-phone')?.value.trim() || '';
      const schoolEmail = document.getElementById('reg-school-email')?.value.trim() || '';

      // Collect Teacher / Coordinator Information
      const teacherName = document.getElementById('reg-teacher-name')?.value.trim() || '';
      const teacherPhone = document.getElementById('reg-teacher-phone')?.value.trim() || '';
      const teacherWhatsapp = document.getElementById('reg-teacher-whatsapp')?.value.trim() || '';
      const teacherEmail = document.getElementById('reg-teacher-email')?.value.trim() || '';
      const presidentName = document.getElementById('reg-president-name')?.value.trim() || '';

      // Generate or retrieve sequential School Code (SC001, SC002, SC003...)
      let schoolCode = '';
      try {
        const nextCodeRes = await fetch('/api/next-school-code').then(r => r.json()).catch(() => null);
        if (nextCodeRes && nextCodeRes.nextSchoolCode) {
          schoolCode = nextCodeRes.nextSchoolCode;
        }
      } catch (e) {}

      // Fallback local sequential generator: SC001, SC002...
      if (!schoolCode) {
        const history = JSON.parse(localStorage.getItem('peraliya_school_registrations') || '[]');
        let maxNum = 0;
        history.forEach(item => {
          const match = String(item.schoolCode || '').match(/^SC(\d+)$/i);
          if (match) {
            const n = parseInt(match[1], 10);
            if (!isNaN(n) && n > maxNum) maxNum = n;
          }
        });
        const nextNum = maxNum + 1;
        schoolCode = 'SC' + String(nextNum).padStart(3, '0');
      }

      const timestamp = new Date().toISOString();

      const payload = {
        type: 'registration',
        schoolCode,
        refCode: schoolCode,
        timestamp,
        schoolName,
        province,
        district,
        schoolPhone,
        schoolEmail,
        teacherName,
        teacherPhone,
        teacherWhatsapp,
        teacherEmail,
        presidentName
      };

      // UI Loading State
      if (btnPrev) btnPrev.style.display = 'none';
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Assigning School Code...</span>';
      }

      function markRegistrationCompleted(code, name) {
        if (btnPrev) btnPrev.style.display = 'none';
        if (btnNext) btnNext.style.display = 'none';
        if (btnSubmit) btnSubmit.style.display = 'none';

        const btnCompleted = document.getElementById('btn-reg-completed');
        if (btnCompleted) {
          btnCompleted.style.display = 'inline-flex';
          btnCompleted.onclick = () => openSuccessModal(code, name);
        }

        const btnRegWhatsapp = document.getElementById('btn-reg-whatsapp');
        if (btnRegWhatsapp) {
          btnRegWhatsapp.style.display = 'inline-flex';
        }

        // Mark step 3 as completed in stepper
        const step3Ind = document.getElementById('step-ind-3');
        if (step3Ind) {
          step3Ind.classList.remove('active');
          step3Ind.classList.add('completed');
        }

        // Lock form inputs
        form.querySelectorAll('input, select').forEach(input => {
          input.disabled = true;
        });
      }

      try {
        // Attempt transmission to local server API
        let response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(r => r.json()).catch(() => null);

        // If backend assigned authoritative sequential SC code, use it
        if (response && response.schoolCode) {
          schoolCode = response.schoolCode;
          payload.schoolCode = schoolCode;
          payload.refCode = schoolCode;
        }

        // Fallback: If local API unavailable and Google Sheet Web App URL is set
        if ((!response || !response.success) && typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_SHEET_WEBAPP_URL) {
          await fetch(CONFIG.GOOGLE_SHEET_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(err => console.warn('Direct Google Sheet POST fallback failed:', err));
        }

        // Cache registration locally in browser
        try {
          const history = JSON.parse(localStorage.getItem('peraliya_school_registrations') || '[]');
          history.push({ schoolCode, school: schoolName, district, date: timestamp });
          localStorage.setItem('peraliya_school_registrations', JSON.stringify(history));
        } catch (err) {}

        sfx.playSuccess();
        showToast(`School Registration Complete! Code: ${schoolCode}`);
        openSuccessModal(schoolCode, schoolName);
        markRegistrationCompleted(schoolCode, schoolName);

      } catch (err) {
        console.error('Registration submission error:', err);
        sfx.playSuccess();
        openSuccessModal(schoolCode, schoolName);
        showToast(`School Registered! Official Code: ${schoolCode}`);
        markRegistrationCompleted(schoolCode, schoolName);
      }
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

  if (modal) modal.classList.add('open');
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

