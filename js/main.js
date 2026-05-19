/* Zeiner Systems – main.js */

// ── Mobile Navigation ──────────────────────────────────────
const hamburger = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
}

// ── Active nav link ────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .footer-col a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) link.classList.add('active');
});

// ── Process Steps ─────────────────────────────────────────
document.querySelectorAll('.ps-step').forEach(btn => {
  btn.addEventListener('click', () => {
    const step = btn.dataset.step;
    const section = btn.closest('.ps-section');
    if (!section) return;

    section.querySelectorAll('.ps-step').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    section.querySelectorAll('.ps-visual').forEach(v => v.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    const visual = section.querySelector(`.ps-visual[data-visual="${step}"]`);
    if (visual) visual.classList.add('active');
  });
});

// ── FAQ Accordion ──────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-question').forEach(b => b.setAttribute('aria-expanded', false));
    // Open clicked if it was closed
    if (!isOpen) {
      answer.classList.add('open');
      btn.setAttribute('aria-expanded', true);
    }
  });
});

// ── Ablauf Toggle ─────────────────────────────────────────
document.querySelectorAll('.ablauf-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const list = btn.nextElementSibling;
    const isOpen = list.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    btn.querySelector('span').textContent = isOpen ? 'Details ausblenden' : 'Details anzeigen';
  });
});

// ── Contact Form ───────────────────────────────────────────
// Formspree-ID hier eintragen (nach Registrierung auf formspree.io):
const FORMSPREE_ID = 'xredbkvr';

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('[type="submit"]');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');

    // Datenschutz-Checkbox muss angekreuzt sein
    const privacyCheckbox = contactForm.querySelector('[name="privacy"]');
    if (privacyCheckbox && !privacyCheckbox.checked) {
      const label = privacyCheckbox.closest('.form-checkbox');
      if (label) {
        label.style.color = '#b91c1c';
        privacyCheckbox.addEventListener('change', () => { label.style.color = ''; }, { once: true });
      }
      return;
    }

    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet …';
    if (errorMsg) errorMsg.style.display = 'none';

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        contactForm.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
      } else {
        throw new Error(data.error || 'error');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
      if (errorMsg) errorMsg.style.display = 'block';
    }
  });
}

// ── Smooth scroll for anchor links ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
