// scripts.js — gentle UI enhancements for Angela's site
// Features:
// - Smooth scroll for nav links
// - Header shrink/backdrop on scroll
// - Reveal-on-scroll animations using IntersectionObserver
// - Subtle parallax for hero decorative SVG
// - Improve tooltip positioning for SVG chart (if present)

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior: 'smooth', block: 'start'});
          history.replaceState(null, '', href);
        }
      }
    });
  });

  // Header: add .scrolled when page is scrolled
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  function onScroll() {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    // parallax for hero deco
    const deco = document.querySelector('.hero-deco');
    if (deco && hero) {
      const rect = hero.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, -rect.top / (window.innerHeight * 0.6)));
      deco.style.transform = `translateY(${pct * 18}px) rotate(${pct * 1.2}deg)`;
      deco.style.opacity = `${0.9 - pct * 0.4}`;
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    reveals.forEach(el => obs.observe(el));
  } else {
    // fallback
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Improve tooltip follow for the chart if present
  const svg = document.getElementById('bar-chart');
  const tooltip = document.getElementById('tooltip');
  if (svg && tooltip) {
    svg.addEventListener('mousemove', (e) => {
      // position tooltip near cursor but keep inside viewport
      const padding = 12;
      let left = e.clientX;
      let top = e.clientY - 14;
      if (left < padding) left = padding;
      if (top < padding) top = padding;
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    });
  }

  // Accessibility: reduce motion preference
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) {
    document.documentElement.classList.add('reduced-motion');
  }
});

// small helper to trigger a gentle pulse on an element
export function pulse(el, ms = 600) {
  if (!el) return;
  el.animate([{transform:'scale(1)'},{transform:'scale(1.02)'},{transform:'scale(1)'}], {duration: ms, easing:'ease-in-out'});
}
