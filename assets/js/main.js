/* ==========================================================================
   Groupe Scolaire Malaika — interactions
   ========================================================================== */
(function () {
  'use strict';

  var onReady = function (fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  /* ----------------------------------------------------------------------
     Header: sticky shadow
     ---------------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;
    var toggleStuck = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    toggleStuck();
    window.addEventListener('scroll', toggleStuck, { passive: true });
  }

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.querySelector('.nav__menu');
    if (!toggle || !menu) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    var setOpen = function (open) {
      menu.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-visible', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    backdrop.addEventListener('click', function () { setOpen(false); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1040) setOpen(false);
    });
  }

  /* ----------------------------------------------------------------------
     Highlight the current page in the nav
     ---------------------------------------------------------------------- */
  function initActiveLink() {
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (href === path) link.classList.add('is-active');
    });
  }

  /* ----------------------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        setTimeout(function () { el.classList.add('is-in'); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------------------
     Animated counters
     ---------------------------------------------------------------------- */
  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;

    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var duration = 1600;
      var start = null;
      var format = function (v) {
        return Number.isInteger(target) ? Math.round(v).toLocaleString('fr-FR') : v.toFixed(1);
      };
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(target * eased);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = format(target);
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      nums.forEach(run);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------------------
     Gallery filters
     ---------------------------------------------------------------------- */
  function initFilters() {
    var bar = document.querySelector('.filters');
    var grid = document.querySelector('.masonry');
    if (!bar || !grid) return;

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;
      bar.querySelectorAll('.filter').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      var cat = btn.getAttribute('data-filter');
      grid.querySelectorAll('.shot').forEach(function (shot) {
        var match = cat === 'all' || shot.getAttribute('data-cat') === cat;
        shot.classList.toggle('is-hidden', !match);
      });
    });
  }

  /* ----------------------------------------------------------------------
     Lightbox
     ---------------------------------------------------------------------- */
  function initLightbox() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    if (!triggers.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Visionneuse de photos');
    box.innerHTML =
      '<button class="lightbox__btn lightbox__close" aria-label="Fermer">' + icon('x') + '</button>' +
      '<button class="lightbox__btn lightbox__prev" aria-label="Photo précédente">' + icon('left') + '</button>' +
      '<button class="lightbox__btn lightbox__next" aria-label="Photo suivante">' + icon('right') + '</button>' +
      '<figure style="margin:0;display:grid;justify-items:center">' +
        '<img alt="">' +
        '<figcaption class="lightbox__cap"></figcaption>' +
      '</figure>';
    document.body.appendChild(box);

    var img = box.querySelector('img');
    var cap = box.querySelector('.lightbox__cap');
    var index = 0;
    var lastFocus = null;

    var visible = function () {
      return triggers.filter(function (t) { return !t.classList.contains('is-hidden'); });
    };

    var show = function (list, i) {
      index = (i + list.length) % list.length;
      var el = list[index];
      var source = el.querySelector('img');
      img.src = source.getAttribute('data-full') || source.src;
      img.alt = source.alt || '';
      cap.textContent = el.getAttribute('data-caption') || source.alt || '';
    };

    var open = function (el) {
      var list = visible();
      lastFocus = document.activeElement;
      show(list, list.indexOf(el));
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      box.querySelector('.lightbox__close').focus();
    };

    var close = function () {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    var move = function (dir) {
      var list = visible();
      show(list, index + dir);
    };

    triggers.forEach(function (el) {
      el.addEventListener('click', function () { open(el); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); }
      });
    });

    box.querySelector('.lightbox__close').addEventListener('click', close);
    box.querySelector('.lightbox__prev').addEventListener('click', function () { move(-1); });
    box.querySelector('.lightbox__next').addEventListener('click', function () { move(1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    });
  }

  /* ----------------------------------------------------------------------
     Accordion
     ---------------------------------------------------------------------- */
  function initAccordion() {
    document.querySelectorAll('.accordion').forEach(function (acc) {
      var items = acc.querySelectorAll('.acc-item');
      items.forEach(function (item) {
        var head = item.querySelector('.acc-head');
        var body = item.querySelector('.acc-body');
        if (!head || !body) return;

        head.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');
        if (item.classList.contains('is-open')) body.style.maxHeight = body.scrollHeight + 'px';

        head.addEventListener('click', function () {
          var isOpen = item.classList.contains('is-open');
          items.forEach(function (other) {
            other.classList.remove('is-open');
            var b = other.querySelector('.acc-body');
            var h = other.querySelector('.acc-head');
            if (b) b.style.maxHeight = null;
            if (h) h.setAttribute('aria-expanded', 'false');
          });
          if (!isOpen) {
            item.classList.add('is-open');
            body.style.maxHeight = body.scrollHeight + 'px';
            head.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });

    window.addEventListener('resize', debounce(function () {
      document.querySelectorAll('.acc-item.is-open .acc-body').forEach(function (b) {
        b.style.maxHeight = b.scrollHeight + 'px';
      });
    }, 150));
  }

  /* ----------------------------------------------------------------------
     Forms (demo — no backend)
     ---------------------------------------------------------------------- */
  function initForms() {
    document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }

        var alertBox = form.querySelector('.form-alert');
        var btn = form.querySelector('[type="submit"]');
        var original = btn ? btn.innerHTML : '';

        if (btn) { btn.disabled = true; btn.innerHTML = 'Envoi en cours…'; }

        setTimeout(function () {
          if (alertBox) {
            alertBox.classList.add('is-visible');
            alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          form.reset();
          if (btn) { btn.disabled = false; btn.innerHTML = original; }
        }, 900);
      });
    });
  }

  /* ----------------------------------------------------------------------
     Back to top
     ---------------------------------------------------------------------- */
  function initToTop() {
    var btn = document.createElement('button');
    btn.className = 'to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Revenir en haut de la page');
    btn.innerHTML = icon('up');
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
  }

  /* ----------------------------------------------------------------------
     Current year in footers
     ---------------------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ----------------------------------------------------------------------
     Utilities
     ---------------------------------------------------------------------- */
  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  function icon(name) {
    var paths = {
      x: '<path d="M18 6 6 18M6 6l12 12"/>',
      left: '<path d="m15 18-6-6 6-6"/>',
      right: '<path d="m9 18 6-6-6-6"/>',
      up: '<path d="m18 15-6-6-6 6"/>'
    };
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths[name] + '</svg>';
  }

  /* ---------------------------------------------------------------------- */
  onReady(function () {
    initHeader();
    initNav();
    initActiveLink();
    initReveal();
    initCounters();
    initFilters();
    initLightbox();
    initAccordion();
    initForms();
    initToTop();
    initYear();
  });
})();
