/* ── THREE.JS HERO ANIMATION ── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Wireframe icosahedron — orange edges
  const geo = new THREE.IcosahedronGeometry(1.6, 1);
  const edges = new THREE.EdgesGeometry(geo);
  const mat = new THREE.LineBasicMaterial({ color: 0xE85D04, transparent: true, opacity: 0.7 });
  const mesh = new THREE.LineSegments(edges, mat);
  scene.add(mesh);

  // Inner smaller icosahedron for depth
  const geo2 = new THREE.IcosahedronGeometry(0.9, 1);
  const edges2 = new THREE.EdgesGeometry(geo2);
  const mat2 = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
  const mesh2 = new THREE.LineSegments(edges2, mat2);
  scene.add(mesh2);

  // Mouse parallax
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.004;

    mesh.rotation.x  = t * 0.4  + my * 0.12;
    mesh.rotation.y  = t * 0.6  + mx * 0.12;
    mesh2.rotation.x = -t * 0.5 + my * 0.08;
    mesh2.rotation.y = -t * 0.3 + mx * 0.08;

    // Drift camera slightly with mouse
    camera.position.x += (mx * 0.3 - camera.position.x) * 0.04;
    camera.position.y += (-my * 0.2 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
})();

/* ── NAV SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── HAMBURGER ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── SCROLL FADE-UP ── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

/* ── COUNT-UP ── */
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

function animateCountUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutQuart(progress) * target);
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

/* ── CONTACT FORM ── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
form?.addEventListener('submit', e => {
  e.preventDefault();
  form.style.display = 'none';
  formSuccess.classList.add('show');
});

/* ── CHATBOT ── */
const chatBubble   = document.getElementById('chatBubble');
const chatWindow   = document.getElementById('chatWindow');
const chatClose    = document.getElementById('chatClose');
const chatInput    = document.getElementById('chatInput');
const chatSend     = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

const responses = {
  "what services do you offer": "TrueServe builds commercial, residential, municipal infrastructure, and sustainable projects — all AI-integrated. Our specialty is public infrastructure aligned with Charlotte 2040.",
  "how does the ai platform work": "Three layers: predictive analytics flags delays weeks early, computer vision monitors safety and defects in real time, and our field-office loop keeps crew and PM in sync.",
  "how do i get a bid": "Fill out the contact form at the bottom of the page — we respond within 24 hours and set up a free discovery call before any numbers are discussed.",
  "municipal": "Yes — parks, trails, greenways, public buildings aligned with Charlotte 2040. That's our primary niche.",
  "sustainable": "Every project follows LEED-aligned practices: solar-ready design, low-impact materials, AI energy modeling.",
  "default": "Best answered over a quick call. Fill out the contact form below and we'll be in touch within 24 hours."
};

function getBotResponse(msg) {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(responses)) {
    if (key !== 'default' && lower.includes(key)) return val;
  }
  return responses.default;
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
  typing.className = 'chat-msg bot';
  typing.innerHTML = '<div class="msg-bubble">...</div>';
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
chatSend?.addEventListener('click', () => { sendMessage(chatInput.value); chatInput.value = ''; });
chatInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') { sendMessage(chatInput.value); chatInput.value = ''; }
});
document.querySelectorAll('.chat-suggest').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.q));
});
