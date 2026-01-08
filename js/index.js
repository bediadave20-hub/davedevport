const slides = document.querySelectorAll('.slide');
const buttons = document.querySelectorAll('.nav button');
const ctas = document.querySelectorAll('[data-slide]');

/* HEADER TYPING */
const h1Text = "Hello, I am";
const h2Text = "Dave Joshua Bedia";

const h1 = document.getElementById("typing-h1");
const h2 = document.getElementById("typing-h2");

let i = 0, j = 0;
let deleting = false;
let stage = 1;

h1.classList.add("cursor");

function headerTyping() {
  if (stage === 1) {
    if (!deleting && i < h1Text.length) {
      h1.textContent += h1Text[i++];
    } else {
      stage = 2;
      h1.classList.remove("cursor");
      h2.classList.add("cursor");
    }
  }

  else if (stage === 2) {
    if (!deleting && j < h2Text.length) {
      h2.textContent += h2Text[j++];
    } else if (!deleting) {
      setTimeout(() => deleting = true, 1200);
    } else if (deleting && j > 0) {
      h2.textContent = h2.textContent.slice(0, -1);
      j--;
    } else {
      stage = 3;
      h2.classList.remove("cursor");
      h1.classList.add("cursor");
    }
  }

  else if (stage === 3) {
    if (i > 0) {
      h1.textContent = h1.textContent.slice(0, -1);
      i--;
    } else {
      deleting = false;
      stage = 1;
    }
  }

  setTimeout(headerTyping, deleting ? 60 : 100);
}

headerTyping();

/* HOME TYPING */
const roles = ["Cybersecurity Engineer", "Security Analyst", "Ethical Hacker", "Network Security Engineer", "Cloud Security Specialist"];
const r1El = document.getElementById("typing-role");
const r2El = document.getElementById("typing-role-2");

function startHomeTyping() {
  r1El.textContent = "";
  r2El.textContent = "Protecting digital assets with expertise and innovation";
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  r1El.classList.add("cursor");

  function typeWriter() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      r1El.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeWriter, 2000); // Pause before deleting
      } else {
        setTimeout(typeWriter, 100);
      }
    } else {
      r1El.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeWriter, 500); // Pause before next role
      } else {
        setTimeout(typeWriter, 50);
      }
    }
  }

  typeWriter();
}

/* NAVIGATION */
let current = 0;

function setActiveSlide(index) {
  if (index < 0 || index >= slides.length) return;
  slides.forEach((s, i) => {
    if (i === index) s.classList.add('active');
    else s.classList.remove('active');
  });
  buttons.forEach((b, i) => {
    const isActive = i === index;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    b.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  // Remove cursor classes when switching slides
  document.getElementById('typing-h1').classList.remove('cursor');
  document.getElementById('typing-h2').classList.remove('cursor');
  document.getElementById('typing-role').classList.remove('cursor');
  current = index;
  if (index === 0) startHomeTyping();
}

buttons.forEach((btn, index) => {
  btn.addEventListener('click', () => setActiveSlide(index));
});

// CTA buttons that should navigate
ctas.forEach((el) => {
  el.addEventListener('click', (e) => {
    const idx = Number(el.getAttribute('data-slide'));
    if (!Number.isNaN(idx)) {
      e.preventDefault();
      setActiveSlide(idx);
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    setActiveSlide((current + 1) % slides.length);
  } else if (e.key === 'ArrowLeft') {
    setActiveSlide((current - 1 + slides.length) % slides.length);
  }
});

// Initialize to the first slide explicitly to sync states
setActiveSlide(0);

/* Intersection reveal + skill bar animation */
const revealEls = document.querySelectorAll('.reveal');
const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // animate bar inside skill
      const bar = entry.target.querySelector?.('.bar div[data-value]');
      if (bar && !bar.dataset.animated) {
        bar.style.width = '0%';
        const target = bar.getAttribute('data-value') || '0%';
        requestAnimationFrame(() => {
          bar.style.transition = 'width 1s ease';
          bar.style.width = target;
          bar.dataset.animated = '1';
        });
      }
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 }) : null;

if (io) revealEls.forEach(el => io.observe(el));

/* Project hover spotlight follows cursor */
const projCards = document.querySelectorAll('.project-card');
projCards.forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--x', x + '%');
    card.style.setProperty('--y', y + '%');
  });
});

/* Project modal */
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');

function openModal(card){
  const img = card.tagName === 'IMG' ? card : card.querySelector('img');
  modalImg.src = img?.src || '';
  modalTitle.textContent = card.dataset.title || 'Project';
  modalDesc.textContent = card.dataset.desc || '';
  modalTags.innerHTML = '';
  (card.dataset.tags || '').split(',').filter(Boolean).forEach(tag => {
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = tag.trim();
    modalTags.appendChild(span);
  });
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  modal.hidden = true;
  document.body.style.overflow = '';
}

projCards.forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

const resumeImg = document.querySelector('.resume-img');
resumeImg?.addEventListener('click', () => openModal(resumeImg));

modal?.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]') || e.target.classList.contains('modal-backdrop')) {
    closeModal();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

/* Project Tabs */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

function setActiveTab(tabName) {
  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabName + '-tab');
  });
  tabButtons.forEach(btn => {
    const isActive = btn.getAttribute('data-tab') === tabName;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    setActiveTab(tabName);
  });
});

/* Copy-to-clipboard + toast */
const copies = document.querySelectorAll('.copyable');
const toast = document.getElementById('toast');
function showToast(msg){
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 1800);
}

copies.forEach(el => {
  el.addEventListener('click', async () => {
    const text = el.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard');
    } catch {
      showToast(text);
    }
  });
});

/* Contact form (client-side stub) */
const form = document.getElementById('contact-form');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  // Simple client-side validation
  if (!data.name || !data.email || !data.message) {
    showToast('Please fill all fields');
    return;
  }
  // Simulate async send
  showToast('Sending...');
  setTimeout(() => showToast('Message sent! (demo)'), 700);
});

/* Particles background */
(function initParticles(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('particles');
  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let width = 0, height = 0;

  const particleCount = 80; // balanced visuals/perf
  const particles = [];

  function resize(){
    width = canvas.clientWidth = window.innerWidth;
    height = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(min, max){ return Math.random() * (max - min) + min; }
  function init(){
    particles.length = 0;
    for (let i=0;i<particleCount;i++){
      particles.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-0.2, 0.2),
        vy: rand(-0.2, 0.2),
        r: rand(0.6, 1.8),
        hue: rand(320, 230) // pink to blue range
      });
    }
  }
  init();

  function step(){
    ctx.clearRect(0,0,width,height);
    // soft gradient vignette
    const g = ctx.createRadialGradient(width*0.5,height*0.5,0,width*0.5,height*0.5,Math.max(width,height)*0.7);
    g.addColorStop(0, 'rgba(236,72,153,0.06)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,width,height);

    // particles
    for (const p of particles){
      p.x += p.vx; p.y += p.vy;
      if (p.x < -5) p.x = width+5; if (p.x > width+5) p.x = -5;
      if (p.y < -5) p.y = height+5; if (p.y > height+5) p.y = -5;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, .7)`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }

    // faint connecting lines
    ctx.lineWidth = 0.6;
    for (let i=0;i<particles.length;i++){
      for (let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist2 = dx*dx+dy*dy;
        if (dist2 < 110*110){
          const t = 1 - Math.sqrt(dist2)/110;
          ctx.strokeStyle = `rgba(148,163,184,${t*0.25})`;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

/* View Map Link */
document.getElementById('view-map-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.open('https://www.google.com/maps?q=Bacoor+City,+Cavite,+Philippines', '_blank');
});
