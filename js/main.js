/* Hamza Bettahar — portfolio interactions. No dependencies. */
(function () {
  'use strict';

  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var root = document.documentElement;
  var motionOK = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- Theme ---------- */
  var themeBtn = $('.theme-toggle');
  var themeMeta = $('meta[name="theme-color"]');

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#f6f8fb' : '#0a0e14');
    if (themeBtn) themeBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    if (persist) { try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ } }
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
    });
  }

  // Follow the system setting until the visitor picks a theme themselves.
  if (window.matchMedia) {
    var systemLight = window.matchMedia('(prefers-color-scheme: light)');
    var onSystemChange = function (e) {
      var saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (!saved) applyTheme(e.matches ? 'light' : 'dark', false);
    };
    if (systemLight.addEventListener) systemLight.addEventListener('change', onSystemChange);
  }

  /* ---------- Mobile navigation ---------- */
  var nav = $('#site-nav');
  var navToggle = $('.nav-toggle');

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); navToggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !navToggle.contains(e.target)) setNav(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setNav(false); });
  }

  /* ---------- Header state + reading progress ---------- */
  var header = $('.site-header');
  var progress = $('.scroll-progress');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Active section in the nav ---------- */
  var navLinks = $$('#site-nav a[href^="#"]');
  if ('IntersectionObserver' in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
    var hero = document.getElementById('top');
    if (hero) spy.observe(hero);
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  // Stagger items that sit in the same list.
  reveals.forEach(function (el) {
    var parent = el.parentElement;
    if (!parent) return;
    var siblings = Array.prototype.filter.call(parent.children, function (c) { return c.classList.contains('reveal'); });
    var index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty('--reveal-delay', Math.min(index, 6) * 0.07 + 's');
  });

  if ('IntersectionObserver' in window && motionOK) {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { revealer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Durations that stay current ---------- */
  // Months counted the way LinkedIn does: start and current month both included.
  function monthsSince(ym) {
    var parts = ym.split('-');
    var now = new Date();
    return (now.getFullYear() - Number(parts[0])) * 12 + (now.getMonth() + 1 - Number(parts[1])) + 1;
  }
  $$('[data-since]').forEach(function (el) {
    var total = monthsSince(el.getAttribute('data-since'));
    if (!(total > 0)) return;
    var years = Math.floor(total / 12);
    var months = total % 12;
    var out = [];
    if (years) out.push(years + (years > 1 ? ' yrs' : ' yr'));
    if (months) out.push(months + (months > 1 ? ' mos' : ' mo'));
    el.textContent = out.join(' ');
  });
  $$('[data-years-since]').forEach(function (el) {
    var years = Math.floor(monthsSince(el.getAttribute('data-years-since')) / 12);
    if (years >= 1) el.textContent = years + '+';
  });

  /* ---------- Project filters ---------- */
  var filterBtns = $$('.filter-btn');
  var projectItems = $$('.project-grid > li');
  var filterStatus = $('#filter-status');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      var shown = 0;
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      projectItems.forEach(function (item) {
        var cats = (item.getAttribute('data-cats') || '').split(/\s+/);
        var match = filter === 'all' || cats.indexOf(filter) !== -1;
        var wasHidden = item.hidden;
        item.hidden = !match;
        if (match) {
          shown++;
          item.classList.add('is-visible');
          if (wasHidden && motionOK) {
            item.classList.remove('is-entering');
            void item.offsetWidth; // restart the animation
            item.classList.add('is-entering');
          }
        }
      });
      if (filterStatus) filterStatus.textContent = 'Showing ' + shown + (shown === 1 ? ' project' : ' projects');
    });
  });
  projectItems.forEach(function (item) {
    item.addEventListener('animationend', function () { item.classList.remove('is-entering'); });
  });

  /* ---------- Copy email ---------- */
  var toast = $('.toast');
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
  }

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { showToast('Email address copied'); };
      var fail = function () {
        if (fallbackCopy(text)) done();
        else window.location.href = 'mailto:' + text;
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fail);
      else fail();
    });
  });

  /* ---------- Card spotlight ---------- */
  if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    $$('.spotlight').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Terminal animation ---------- */
  var termBody = $('#terminal-body');
  if (termBody && motionOK) {
    var lines = $$('.ln', termBody);
    var finalLine = $('.ln-final', termBody);
    var cursor = $('.cursor', termBody);
    var steps = lines.filter(function (ln) { return ln !== finalLine; }).map(function (ln) {
      var cmd = $('.cmd', ln);
      return { el: ln, cmd: cmd, text: cmd ? cmd.textContent : '' };
    });
    var wait = function (ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); };

    var reset = function () {
      steps.forEach(function (s) {
        s.el.classList.add('is-pending');
        if (s.cmd) s.cmd.textContent = '';
      });
      if (finalLine) finalLine.classList.add('is-pending');
    };

    var play = function () {
      reset();
      var chain = wait(500);
      steps.forEach(function (s) {
        chain = chain.then(function () {
          s.el.classList.remove('is-pending');
          if (!s.cmd) return wait(120);
          if (cursor) s.el.appendChild(cursor);
          var typing = wait(380);
          s.text.split('').forEach(function (ch) {
            typing = typing.then(function () {
              s.cmd.textContent += ch;
              return wait(26 + Math.random() * 46);
            });
          });
          return typing.then(function () { return wait(420); });
        });
      });

      return chain.then(function () {
        if (finalLine) {
          finalLine.classList.remove('is-pending');
          if (cursor) finalLine.appendChild(cursor);
        }
        return wait(6000);
      }).then(play);
    };

    // Clear it straight away so the finished output never flashes, then start once it is on screen.
    reset();
    if ('IntersectionObserver' in window) {
      var started = false;
      var termObserver = new IntersectionObserver(function (entries) {
        if (!started && entries[0].isIntersecting) {
          started = true;
          termObserver.disconnect();
          play();
        }
      });
      termObserver.observe(termBody);
    } else {
      play();
    }
  }

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
