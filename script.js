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
