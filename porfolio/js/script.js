/* =====================================================
   BSIT STUDENT PORTFOLIO - script.js (vanilla JavaScript)
   Sections:
   1. Element references
   2. Mobile menu
   3. Header style + back-to-top button
   4. Active nav link + sliding indicator
   5. Typing animation
   6. Scroll reveal + skill bars
   7. Contact form (front-end only)
   8. Footer year
   ===================================================== */

/* ---------- 1. ELEMENT REFERENCES ---------- */
const header = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navIndicator = document.getElementById('navIndicator');
const toTopBtn = document.getElementById('toTop');
const typedEl = document.getElementById('typed');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 2. MOBILE MENU ---------- */
function closeMenu() {
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close the menu after tapping a link
navLinks.forEach((link) => link.addEventListener('click', closeMenu));

// Close the menu when the screen becomes wide again
window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
  moveIndicator(document.querySelector('.nav-link.active'));
});

/* ---------- 3. HEADER STYLE + BACK-TO-TOP ---------- */
function onScroll() {
  const scrolled = window.scrollY > 20;
  header.classList.toggle('scrolled', scrolled);
  toTopBtn.classList.toggle('show', window.scrollY > 600);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

/* ---------- 4. ACTIVE NAV LINK + SLIDING INDICATOR ---------- */
function moveIndicator(link) {
  if (!link || !navIndicator) return;
  navIndicator.style.width = link.offsetWidth + 'px';
  navIndicator.style.left = link.offsetLeft + 'px';
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === '#' + id;
    link.classList.toggle('active', isActive);
    if (isActive) moveIndicator(link);
  });
}

// Watch which section is in the middle of the screen
const sections = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
sections.forEach((section) => sectionObserver.observe(section));

// Position the underline on first load
moveIndicator(document.querySelector('.nav-link.active'));

/* ---------- 5. TYPING ANIMATION ---------- */
// Change these phrases to whatever you like
const phrases = [
  'learning web development',
  'building database projects',
  'practicing every day',
  'turning ideas into code',
];

function startTyping() {
  if (!typedEl) return;

  // With reduced motion, just show the first phrase
  if (prefersReducedMotion) {
    typedEl.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    typedEl.textContent = current.slice(0, charIndex);

    let delay = deleting ? 35 : 70;

    if (!deleting && charIndex === current.length) {
      delay = 1600; // pause when a phrase is complete
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }

    charIndex += deleting ? -1 : 1;
    setTimeout(tick, delay);
  }
  tick();
}
startTyping();

/* ---------- 6. SCROLL REVEAL + SKILL BARS ---------- */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');

      // If this element is a skill card, fill its progress bar
      const fill = entry.target.querySelector('.bar-fill');
      if (fill) fill.style.width = fill.dataset.level + '%';

      observer.unobserve(entry.target); // animate only once
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el, index) => {
  // Small stagger so grids of cards don't pop in all at once
  el.style.transitionDelay = (index % 4) * 70 + 'ms';
  revealObserver.observe(el);
});

/* ---------- 7. CONTACT FORM (FRONT-END ONLY) ---------- */
// There is no backend. This only checks the fields and shows a message.
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = form.querySelectorAll('input, textarea');
    let allValid = true;

    fields.forEach((field) => {
      const valid = field.checkValidity() && field.value.trim() !== '';
      field.classList.toggle('invalid', !valid);
      if (!valid) allValid = false;
    });

    formStatus.classList.toggle('error', !allValid);

    if (!allValid) {
      formStatus.textContent = 'Please fill in all fields with a valid email.';
      return;
    }

    formStatus.textContent = 'Thanks! Your message as been sent.';
    form.reset();
  });
}

/* ---------- 8. FOOTER YEAR ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();