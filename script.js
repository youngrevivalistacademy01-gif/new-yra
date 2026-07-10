(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- collapsible focus areas (progressive enhancement: content is fully
  // visible without JS; we only collapse it once we know JS is running) ---
  const toggles = document.querySelectorAll('.focus-toggle');

  toggles.forEach(btn => {
    const targetId = btn.getAttribute('aria-controls');
    const panel = document.getElementById(targetId);
    if (!panel) return;

    panel.classList.add('is-collapsed');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.classList.toggle('is-collapsed', isOpen);
    });
  });

  // --- sticky header scroll progress ---
  const progressFill = document.getElementById('scrollProgress');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    if (progressFill) progressFill.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // --- staggered card reveal on load/scroll ---
  const cards = document.querySelectorAll('.glass-module-card');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const index = Array.from(cards).indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('is-visible'), index * 90);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(card => observer.observe(card));
  } else {
    cards.forEach(card => card.classList.add('is-visible'));
  }
})();

