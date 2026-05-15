// ============================================ LOADER
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');

  setTimeout(() => {
    loader.classList.add('done');
    setTimeout(() => {
      loader.style.display = 'none';
      // Trigger hero text animations after loader hides
      const heroTitle = document.querySelector('.hero-title');
      if (heroTitle) heroTitle.classList.add('animate');
    }, 300);
  }, 2000);
});

// ============================================ NAV SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ============================================ HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ============================================ SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================ ACTIVE NAV ON SCROLL
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
    link.style.color = link.getAttribute('href') === `#${current}` ? 'white' : '';
  });
});

// ============================================ SCROLL FADE-UP
const fadeUpObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      fadeUpObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => fadeUpObserver.observe(el));

// ============================================ COUNT-UP ANIMATION
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCountUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutQuart(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCountUp(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.hs-num').forEach(el => countObserver.observe(el));

// ============================================ CONTACT FORM
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    formSuccess.classList.add('show');
  });
}

// ============================================ CHATBOT
const chatBubble   = document.getElementById('chatBubble');
const chatWindow   = document.getElementById('chatWindow');
const chatClose    = document.getElementById('chatClose');
const chatInput    = document.getElementById('chatInput');
const chatSend     = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

const responses = {
  "what services do you offer?": "TrueServe offers commercial construction, residential renovations, sustainable building, municipal & trail infrastructure, and AI kiosk installation. Our specialty is public infrastructure aligned with Charlotte 2040. Want me to connect you with our team?",
  "how does the ai platform work?": "Our AI platform has 5 layers: (1) Predictive analytics — flags schedule delays and cost overruns weeks early. (2) Computer vision — cameras track PPE compliance and detect quality defects in real time. (3) Field-office loop — instant issue reporting between crew and PM. (4) Subcontractor risk scoring. (5) Proprietary Charlotte cost benchmarks. Want a full demo?",
  "how do i get a bid?": "Easy! Fill out our contact form at the bottom of this page and we'll respond within 24 hours. We'll set up a free discovery call to learn about your project before providing any numbers.",
  "do you work on municipal projects?": "Yes — that's our primary niche. Municipal and public infrastructure (parks, trails, greenways, public buildings) aligned with Charlotte 2040. We're the only Charlotte contractor combining AI + MBE status + municipal focus.",
  "what is charlotte 2040?": "Charlotte 2040 is the city's long-term infrastructure and sustainability plan — investing billions in public spaces, smart city assets, greenways, and sustainable buildings. TrueServe is purpose-built to execute that vision.",
  "are you sustainable?": "Absolutely. Every TrueServe project follows LEED-aligned practices — solar-ready design, low-impact materials, and AI energy modeling. Sustainable building is one of our core service lines.",
  "how does computer vision work?": "We install cameras across the jobsite that feed into our AI models 24/7. The system automatically detects missing PPE, flags unsafe behavior near heavy equipment, and identifies quality defects — alerting supervisors instantly.",
  "default": "Great question! I can best answer that over a quick call with our team. Fill out the contact form below and we'll be in touch within 24 hours — or ask me something like 'What services do you offer?' or 'How do I get a bid?'"
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
  if (e.key === 'Enter') {
    sendMessage(chatInput.value);
    chatInput.value = '';
  }
});

document.querySelectorAll('.chat-suggest').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.q));
});
