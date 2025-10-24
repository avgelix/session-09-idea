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
    // Chart rendering moved here from inline HTML for separation of concerns
    function makeDefsLocal(svgEl){
      const xmlns = 'http://www.w3.org/2000/svg';
      const defs = document.createElementNS(xmlns,'defs');
      const grad = document.createElementNS(xmlns,'linearGradient');
      grad.setAttribute('id','barGradient');
      grad.setAttribute('x1','0'); grad.setAttribute('y1','0'); grad.setAttribute('x2','1'); grad.setAttribute('y2','1');
      const s1 = document.createElementNS(xmlns,'stop'); s1.setAttribute('offset','0%'); s1.setAttribute('stop-color',getComputedStyle(document.documentElement).getPropertyValue('--accent-2') || '#6ee7b7');
      const s2 = document.createElementNS(xmlns,'stop'); s2.setAttribute('offset','100%'); s2.setAttribute('stop-color',getComputedStyle(document.documentElement).getPropertyValue('--accent-3') || '#5fd3ff');
      grad.appendChild(s1); grad.appendChild(s2); defs.appendChild(grad); svgEl.appendChild(defs);
    }

    function drawChart(svgEl, data){
      while(svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
      makeDefsLocal(svgEl);
      const xmlns = 'http://www.w3.org/2000/svg';
      const padding = {t:20,r:20,b:30,l:36};
      const width = svgEl.viewBox.baseVal.width || 600;
      const height = svgEl.viewBox.baseVal.height || 300;
      const innerW = width - padding.l - padding.r;
      const innerH = height - padding.t - padding.b;
      const max = Math.max(...data);
      const barW = innerW / data.length * 0.7;
      const gap = innerW / data.length * 0.3;

      data.forEach((d,i)=>{
        const x = padding.l + i * (barW + gap) + gap/2;
        const h = (d / max) * innerH;
        const y = padding.t + (innerH - h);
        const rect = document.createElementNS(xmlns,'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', barW);
        rect.setAttribute('height', h);
        rect.setAttribute('class','bar');
        rect.setAttribute('data-value', d);
        rect.style.transform = 'scaleY(0)';
        rect.style.transformOrigin = 'center bottom';
        svgEl.appendChild(rect);

        rect.addEventListener('mouseenter', (evt)=>{
          const v = evt.target.getAttribute('data-value');
          tooltip.textContent = v;
          tooltip.style.opacity = '1';
        });
        rect.addEventListener('mouseleave', ()=>{ tooltip.style.opacity = '0'; });
        rect.addEventListener('click', ()=>{ rect.classList.toggle('selected'); });
      });

      const axisY = document.createElementNS(xmlns,'line');
      axisY.setAttribute('x1', padding.l); axisY.setAttribute('x2', padding.l+innerW);
      axisY.setAttribute('y1', padding.t+innerH+6); axisY.setAttribute('y2', padding.t+innerH+6);
      axisY.setAttribute('stroke','rgba(255,255,255,0.05)'); axisY.setAttribute('stroke-width','1');
      svgEl.appendChild(axisY);

      requestAnimationFrame(()=>{
        const rects = svgEl.querySelectorAll('rect.bar');
        rects.forEach((r,idx)=>{
          setTimeout(()=>{ r.style.transform = 'scaleY(1)'; }, idx*80);
        });
      });
    }

    // sample data and controls
    let chartData = [34, 67, 23, 78, 45, 90, 55];
    drawChart(svg, chartData);
    const randomBtn = document.getElementById('randomize');
    const updateBtn = document.getElementById('update');
    if (randomBtn) randomBtn.addEventListener('click', ()=>{ chartData = chartData.map(()=> Math.round(Math.random()*100)); drawChart(svg, chartData); });
    if (updateBtn) updateBtn.addEventListener('click', ()=>{ chartData = chartData.map(v => Math.max(8, Math.round(v + (Math.random()*30-15)))); drawChart(svg, chartData); });

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
function pulse(el, ms = 600) {
  if (!el) return;
  el.animate([{transform:'scale(1)'},{transform:'scale(1.02)'},{transform:'scale(1)'}], {duration: ms, easing:'ease-in-out'});
}
// expose as a global helper so other scripts (or dev console) can call it
window.pulse = pulse;
