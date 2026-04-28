// Nav scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// AI Platform tabs
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.platform-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// Scroll fade-in animations
const fadeEls = document.querySelectorAll(
  '.service-card, .pf-item, .vp-card, .pillar, .project-card, .av-item, .sus-stat, .nw-card, .bm-card, .process-step, .roi-row'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

// ============================================ CHATBOT
const chatBubble  = document.getElementById('chatBubble');
const chatWindow  = document.getElementById('chatWindow');
const chatClose   = document.getElementById('chatClose');
const chatInput   = document.getElementById('chatInput');
const chatSend    = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

const responses = {
  "what services do you offer?": "TrueServe offers commercial construction, residential renovations, sustainable building, municipal & trail infrastructure, and AI kiosk installation. Our specialty is public infrastructure aligned with Charlotte 2040. Want me to connect you with our team?",
  "how does the ai platform work?": "Our AI platform has 5 layers: (1) Predictive analytics — flags schedule delays and cost overruns weeks early. (2) Computer vision — cameras track PPE compliance and detect quality defects in real time. (3) Field-office loop — instant issue reporting between crew and PM. (4) Subcontractor risk scoring. (5) Proprietary Charlotte cost benchmarks. Want a full demo?",
  "how do i get a bid?": "Easy! Fill out our contact form at the bottom of this page and we'll respond within 24 hours. We'll set up a free discovery call to learn about your project before providing any numbers. Want to jump to the form?",
  "what's the roi?": "Based on industry benchmarks, TrueServe's AI platform saves an average of 11–16% on project costs vs. a traditional contractor — through reduced overruns, earlier defect detection, and safer jobsites. Use our ROI Calculator on this page to see your specific numbers!",
  "do you work on municipal projects?": "Yes — that's our primary niche. Municipal and public infrastructure (parks, trails, greenways, public buildings) aligned with Charlotte 2040. We're the only Charlotte contractor combining AI + MBE status + municipal focus.",
  "what is charlotte 2040?": "Charlotte 2040 is the city's long-term infrastructure and sustainability plan — investing billions in public spaces, smart city assets, greenways, and sustainable buildings. TrueServe is purpose-built to be the AI-powered contractor that helps execute that vision.",
  "are you sustainable?": "Absolutely. Every TrueServe project follows LEED-aligned practices — solar-ready design, low-impact materials, and AI energy modeling. Sustainable building is one of our core service lines.",
  "how does computer vision work?": "We install cameras across the jobsite that feed into our AI models 24/7. The system automatically detects missing PPE (hard hats, vests, gloves), flags unsafe behavior near heavy equipment, and identifies quality defects like cracks or misalignments — alerting supervisors instantly.",
  "default": "Great question! I can best answer that over a quick call with our team. Fill out the contact form below and we'll be in touch within 24 hours — or ask me something else like 'How does the AI platform work?' or 'How do I get a bid?'"
};

function getBotResponse(msg) {
  const lower = msg.toLowerCase().trim();
  for (const key of Object.keys(responses)) {
    if (key !== 'default' && lower.includes(key.replace('?', '').trim())) {
      return responses[key];
    }
  }
  return responses['default'];
}

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `chat-msg ${sender}`;
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;
  div.appendChild(bubble);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage(text) {
  if (!text.trim()) return;
  addMessage(text, 'user');
  // Remove suggestions after first real interaction
  document.querySelector('.chat-suggestions')?.remove();

  const typing = document.createElement('div');
  typing.className = 'chat-msg bot chat-typing';
  typing.innerHTML = '<div class="msg-bubble"></div>';
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    typing.remove();
    addMessage(getBotResponse(text), 'bot');
  }, 900);
}

chatBubble?.addEventListener('click', () => {
  chatBubble.classList.add('hidden');
  chatWindow.classList.add('open');
});

chatClose?.addEventListener('click', () => {
  chatWindow.classList.remove('open');
  chatBubble.classList.remove('hidden');
});

chatSend?.addEventListener('click', () => {
  sendMessage(chatInput.value);
  chatInput.value = '';
});

chatInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') { sendMessage(chatInput.value); chatInput.value = ''; }
});

document.querySelectorAll('.chat-suggest').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.q));
});

// ROI Calculator
const roiInputs = ['roi-duration', 'roi-subs', 'roi-workers'];
roiInputs.forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  const valEl = document.getElementById(id + '-val');
  el.addEventListener('input', () => { if (valEl) valEl.textContent = el.value; });
});

function formatCurrency(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000)    return '$' + Math.round(n / 1000) + 'k';
  return '$' + Math.round(n);
}

function calcROI() {
  const budget    = parseFloat(document.getElementById('roi-budget').value)    || 500000;
  const duration  = parseFloat(document.getElementById('roi-duration').value)  || 12;
  const subs      = parseFloat(document.getElementById('roi-subs').value)      || 5;
  const workers   = parseFloat(document.getElementById('roi-workers').value)   || 25;
  const type      = document.getElementById('roi-type').value;

  // Multipliers per project type
  const multipliers = { commercial: 1.0, residential: 0.75, infrastructure: 1.15, mixed: 1.05 };
  const m = multipliers[type] || 1.0;

  // Schedule: industry 20% over, TrueServe 4% — savings = 16% of budget
  const schedSavings = budget * 0.16 * m * Math.min(1, duration / 12);

  // Cost overrun: industry 12%, TrueServe 0.8% — savings = 11.2%
  const overrunSavings = budget * 0.112 * m;

  // Safety: base incident rate, $42k avg cost, CV reduces by 68%
  const incidentRate = (workers / 100) * (duration / 12) * 2.5;
  const safetySavings = incidentRate * 42000 * 0.68;

  // Defects: early detection saves ~3% of budget
  const defectSavings = budget * 0.03 * m;

  // Sub risk: avg 1 bad sub per 5, costs 4% of budget to replace mid-project
  const subSavings = Math.floor(subs / 5) * budget * 0.04;

  const total = schedSavings + overrunSavings + safetySavings + defectSavings + subSavings;

  document.getElementById('roi-total').textContent    = formatCurrency(total);
  document.getElementById('roi-schedule').textContent = formatCurrency(schedSavings);
  document.getElementById('roi-overrun').textContent  = formatCurrency(overrunSavings);
  document.getElementById('roi-safety').textContent   = formatCurrency(safetySavings);
  document.getElementById('roi-defect').textContent   = formatCurrency(defectSavings);
  document.getElementById('roi-sub').textContent      = formatCurrency(subSavings);
}

document.getElementById('roi-calc-btn')?.addEventListener('click', calcROI);
// Run once on load with defaults
calcROI();

// Contact form
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  form.style.display = 'none';
  formSuccess.classList.add('show');
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'white'
      : '';
  });
});
