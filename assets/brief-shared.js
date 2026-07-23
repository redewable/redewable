/* ReDewable — shared behavior for brief & reference pages
   Scroll reveal · back-to-top · current-page marker in brief nav */
(function () {
  'use strict';

  /* Scroll reveal — only arm when JS is running so content is never hidden without it */
  document.documentElement.classList.add('js-reveal');
  var targets = document.querySelectorAll('.section > .wrap');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Back to top */
  var btn = document.createElement('button');
  btn.className = 'to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);
  var onScroll = function () {
    btn.classList.toggle('on', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mark current page in the cross-brief nav */
  var here = location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.brief-nav a').forEach(function (a) {
    var path = a.getAttribute('href').replace(/\/$/, '');
    if (path === here) { a.classList.add('is-current'); }
  });
})();
