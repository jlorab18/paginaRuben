// ═══════════ LOADER ═══════════
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReducedMotion = () => reduceMotionQuery.matches;

const loader = document.getElementById('loader');
if (loader) {
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('done'), prefersReducedMotion() ? 0 : 600);
  });
}

// ═══════════ NAV SCROLL ═══════════
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      document.getElementById('mainNav').classList.toggle('scrolled', scrollY > 60);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

// ═══════════ CAROUSEL ═══════════
const slides = document.querySelectorAll('.hero-slide');
if (slides.length) {
  const dots = document.querySelectorAll('.hero-dot');
  const counter = document.getElementById('heroCounter');
  let cur = 0, autoTimer;

  function goSlide(i) {
    if (i === cur) return;
    const prev = cur; cur = i;
    slides[prev].classList.remove('active');
    slides[prev].classList.add('exit');
    setTimeout(() => slides[prev].classList.remove('exit'), 1600);
    slides[cur].classList.add('active');
    dots[prev].classList.remove('active');
    dots[cur].classList.add('active');
    if (counter) {
      const total = String(slides.length).padStart(2, '0');
      counter.textContent = String(cur + 1).padStart(2, '0') + ' / ' + total;
    }
  }
  function nextSlide() { goSlide((cur + 1) % slides.length); }
  function startAuto() {
    if (prefersReducedMotion()) return;
    autoTimer = setInterval(nextSlide, 5000);
  }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  dots.forEach(d => d.addEventListener('click', () => { goSlide(parseInt(d.dataset.i)); resetAuto(); }));
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { nextSlide(); resetAuto(); }
    if (e.key === 'ArrowLeft') { goSlide((cur - 1 + slides.length) % slides.length); resetAuto(); }
  });
  let tx = 0;
  const hero = document.querySelector('.hero');
  hero.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  hero.addEventListener('touchend', e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) { d > 0 ? nextSlide() : goSlide((cur - 1 + slides.length) % slides.length); resetAuto(); }
  });
  startAuto();
}

// ═══════════ SERVICE ROW BG IMAGES ═══════════
document.querySelectorAll('.service-row[data-img]').forEach(row => {
  const bg = row.querySelector('.srv-bg');
  if (bg) bg.style.backgroundImage = `url('${row.dataset.img}')`;
});

// ═══════════ REVEAL ═══════════
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => obs.observe(el));

// ═══════════ SMOOTH ANCHORS ═══════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const t = document.querySelector(href);
    if (t) t.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
});

// ═══════════ PARALLAX STRIP ═══════════
const strip = document.querySelector('.img-strip');
if (strip) {
  const stripImgs = strip.querySelectorAll('.strip-img img');
  let stripTicking = false;
  window.addEventListener('scroll', () => {
    if (!stripTicking) {
      requestAnimationFrame(() => {
        const rect = strip.getBoundingClientRect();
        if (rect.top < innerHeight && rect.bottom > 0) {
          const p = (innerHeight - rect.top) / (innerHeight + rect.height);
          const off = (p - 0.5) * 80;
          stripImgs.forEach((img, i) => {
            img.style.transform = `translateY(${off * (i % 2 === 0 ? 0.4 : -0.4)}px)`;
          });
        }
        stripTicking = false;
      });
      stripTicking = true;
    }
  }, { passive: true });
}

// ═══════════ LIGHTBOX ═══════════
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  let lbImages = [];
  let lbIndex = 0;
  let lbAnimating = false;
  const lbImg = document.getElementById('lightboxImg');
  const lbCloseBtn = lightbox.querySelector('.lightbox-close');
  let lastFocusedTrigger = null;
  const getLightboxSrc = image => image.dataset.fullSrc || image.src;

  function slideTo(newIndex, dir) {
    if (lbAnimating || newIndex === lbIndex && lbImages.length > 1) return;
    lbAnimating = true;
    // Slide out
    lbImg.classList.add(dir > 0 ? 'slide-left' : 'slide-right');
    setTimeout(function() {
      // Snap to enter position (no transition)
      lbImg.classList.remove('slide-left', 'slide-right');
      lbImg.classList.add(dir > 0 ? 'slide-enter-left' : 'slide-enter-right');
      lbIndex = newIndex;
      lbImg.src = getLightboxSrc(lbImages[lbIndex]);
      lbImg.alt = lbImages[lbIndex].alt;
      // Force reflow then slide in
      void lbImg.offsetWidth;
      lbImg.classList.remove('slide-enter-left', 'slide-enter-right');
      setTimeout(function() { lbAnimating = false; }, 450);
    }, 450);
  }

  function lbNext() { slideTo((lbIndex + 1) % lbImages.length, 1); }
  function lbPrev() { slideTo((lbIndex - 1 + lbImages.length) % lbImages.length, -1); }

  window.openLightbox = function(el) {
    const container = el.closest('.gallery-grid');
    if (!container) return;

    lastFocusedTrigger = el;
    lbImages = Array.from(container.querySelectorAll('.gallery-item img'));
    lbIndex = lbImages.indexOf(el.querySelector('img'));
    lbImg.src = getLightboxSrc(lbImages[lbIndex]);
    lbImg.alt = lbImages[lbIndex].alt;
    lbImg.classList.remove('slide-left', 'slide-right', 'slide-enter-left', 'slide-enter-right');
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbAnimating = false;
    if (lbCloseBtn) lbCloseBtn.focus();
  };

  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbAnimating = false;
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  }

  window.closeLightbox = function(e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) closeLb();
  };

  window.navLightbox = function(dir, e) {
    e.stopPropagation();
    slideTo((lbIndex + dir + lbImages.length) % lbImages.length, dir);
  };

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') lbNext();
    if (e.key === 'ArrowLeft') lbPrev();
  });

  // Swipe support for lightbox
  let lbTx = 0;
  lightbox.addEventListener('touchstart', function(e) { lbTx = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', function(e) {
    var d = lbTx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) {
      var dir = d > 0 ? 1 : -1;
      slideTo((lbIndex + dir + lbImages.length) % lbImages.length, dir);
    }
  });

  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
}

// ═══════════ THEME TOGGLE ═══════════
function toggleTheme() {
  const goingLight = !document.body.classList.contains('light');
  setTheme(goingLight ? 'light' : 'dark');
}
function setTheme(t) {
  document.body.classList.toggle('light', t === 'light');
  document.body.classList.toggle('dark', t === 'dark');
  localStorage.setItem('theme', t);
  updateThemeBtn();
}
function updateThemeBtn() {
  const isLight = document.body.classList.contains('light');
  document.querySelectorAll('#themeToggle').forEach(b => b.textContent = isLight ? 'dark' : 'light');
}
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || savedTheme === 'dark') document.body.classList.add(savedTheme);
updateThemeBtn();

// ═══════════ LANGUAGE TOGGLE ═══════════
let currentLang = localStorage.getItem('lang') || 'es';

function toggleLang() {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  localStorage.setItem('lang', currentLang);
  applyLang();
}
function applyLang() {
  document.querySelectorAll('[data-es]').forEach(el => {
    const text = el.getAttribute('data-' + currentLang);
    if (text) {
      const svg = el.querySelector('svg');
      if (svg) { el.textContent = text + ' '; el.appendChild(svg); }
      else el.textContent = text;
      if (el.hasAttribute('data-split')) {
        el.removeAttribute('data-original');
        if (typeof splitText === 'function') splitText(el);
      }
    }
  });
  document.querySelectorAll('[data-es-html]').forEach(el => {
    const html = el.getAttribute('data-' + currentLang + '-html');
    if (html) el.innerHTML = html;
  });
  document.querySelectorAll('#langToggle').forEach(b => b.textContent = currentLang === 'es' ? 'en' : 'es');
  document.documentElement.lang = currentLang;
}
if (currentLang !== 'es') applyLang();

// ═══════════ MOBILE MENU ═══════════
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  if (menu && btn) {
    menu.classList.toggle('open');
    btn.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(menu.classList.contains('open')));
    btn.setAttribute('aria-label', menu.classList.contains('open') ? 'Cerrar menu' : 'Abrir menu');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }
}
function closeMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  if (menu && btn) {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  }
}

// ═══════════ CONTACT FORM ═══════════
function handleContactForm(e) {
  e.preventDefault();
  var form = e.target;
  var name = form.name.value;
  var email = form.email.value;
  var service = form.service.value;
  var message = form.message.value;

  var subject = encodeURIComponent('Nuevo proyecto — ' + name);
  var body = encodeURIComponent(
    'Nombre: ' + name + '\n' +
    'Email: ' + email + '\n' +
    'Servicio: ' + (service || 'No especificado') + '\n\n' +
    message
  );
  window.location.href = 'mailto:rubenerimo@gmail.com?subject=' + subject + '&body=' + body;
  return false;
}

document.querySelectorAll('[onclick]:not(a):not(button):not(input):not(select):not(textarea)').forEach(el => {
  if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
  if (!el.hasAttribute('role')) el.setAttribute('role', 'button');

  if (el.classList.contains('gallery-item')) {
    const img = el.querySelector('img');
    if (img && !el.hasAttribute('aria-label')) el.setAttribute('aria-label', img.alt || 'Open image');
  }

  if (el.classList.contains('trabajo-card')) {
    const title = el.querySelector('.trabajo-title');
    if (title && !el.hasAttribute('aria-label')) el.setAttribute('aria-label', title.textContent.trim());
  }

  if (el.classList.contains('nav-logo') && !el.hasAttribute('aria-label')) {
    el.setAttribute('aria-label', 'Ir al inicio');
  }

  el.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      el.click();
    }
  });
});

const menuButton = document.getElementById('hamburger');
if (menuButton) {
  menuButton.setAttribute('aria-controls', 'mobileMenu');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

// ═══════════ CUSTOM CURSOR ═══════════
(function() {
  const ring = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  const label = document.getElementById('cursorLabel');
  if (!ring || prefersReducedMotion() || !window.matchMedia('(pointer:fine)').matches) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let currentState = '';

  // Seguir el ratón
  window.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Detectar hover
    var el = e.target;
    var state = '', txt = '';
    if (el.closest && el.closest('.gallery-item')) { state = 'hover-gallery'; txt = 'VER'; }
    else if (el.closest && el.closest('.trabajo-card')) { state = 'hover'; txt = 'ABRIR'; }
    else if (el.closest && el.closest('a, button, [onclick], .service-row, .nav-cta')) { state = 'hover'; }

    if (state !== currentState) {
      ring.className = 'cursor' + (state ? ' ' + state : '');
      label.textContent = txt;
      label.className = 'cursor-label' + (txt ? ' vis' : '');
      currentState = state;
    }
  });

  // Loop de animación
  function tick() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    var rw = ring.offsetWidth / 2;
    var dw = dot.offsetWidth / 2;

    ring.style.transform = 'translate3d(' + (ringX - rw) + 'px,' + (ringY - rw) + 'px,0)';
    dot.style.transform = 'translate3d(' + (mouseX - dw) + 'px,' + (mouseY - dw) + 'px,0)';
    label.style.transform = 'translate3d(' + mouseX + 'px,' + (mouseY + 30) + 'px,0)';

    requestAnimationFrame(tick);
  }
  tick();
})();

// ═══════════ CHAR SPLIT REVEAL ═══════════
const splitObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('split-vis');
      splitObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

function splitText(el) {
  const cached = el.getAttribute('data-original') || el.textContent;
  el.setAttribute('data-original', cached);
  el.innerHTML = '';
  el.classList.remove('split-vis');
  for (let i = 0; i < cached.length; i++) {
    const ch = cached[i];
    const s = document.createElement('span');
    s.className = 'split-char';
    s.style.transitionDelay = (i * 0.025) + 's';
    s.textContent = ch === ' ' ? ' ' : ch;
    el.appendChild(s);
  }
  splitObs.observe(el);
}

document.querySelectorAll('[data-split]').forEach(splitText);

// ═══════════ VISUALS STRIP — 3s rotation ═══════════
(function() {
  const items = document.querySelectorAll('.visuals-strip-item');
  if (!items.length) return;
  const videos = Array.from(items).map(it => it.querySelector('video'));

  // Pause non-active videos for perf
  videos.forEach((v, i) => {
    if (!v) return;
    if (i === 0) { v.play().catch(() => {}); }
    else { v.removeAttribute('autoplay'); v.pause(); }
  });

  let cur = 0;
  function nextItem() {
    const prev = cur;
    cur = (cur + 1) % items.length;
    items[prev].classList.remove('active');
    items[cur].classList.add('active');
    if (videos[prev]) videos[prev].pause();
    if (videos[cur]) { videos[cur].currentTime = 0; videos[cur].play().catch(() => {}); }
  }

  if (!prefersReducedMotion()) {
    setInterval(nextItem, 3000);
  }
})();

// ═══════════ VIDEO LIGHTBOX (visuals.html) ═══════════
(function() {
  const lb = document.getElementById('videoLightbox');
  if (!lb) return;
  const lbVideo = lb.querySelector('video');
  const lbClose = lb.querySelector('.video-lightbox-close');

  window.openVideo = function(src) {
    lbVideo.src = src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbVideo.play().catch(() => {});
  };

  function closeVideo() {
    lb.classList.remove('open');
    lbVideo.pause();
    lbVideo.removeAttribute('src');
    lbVideo.load();
    document.body.style.overflow = '';
  }

  lb.addEventListener('click', e => {
    if (e.target === lb || e.target === lbClose) closeVideo();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeVideo();
  });
})();

// ═══════════ CONTACT FORM (Formspree) ═══════════
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');
  const submit = form.querySelector('button[type="submit"]');

  const msgs = {
    es: { sending: 'Enviando…', ok: 'Recibido. Te contesto en breve. ✓', err: 'Algo falló. Intenta de nuevo o escríbeme a rubenerimo@gmail.com.' },
    en: { sending: 'Sending…', ok: "Got it. I'll reply shortly. ✓", err: 'Something failed. Try again or email rubenerimo@gmail.com.' }
  };
  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'es');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const action = form.getAttribute('action');
    if (action.includes('REPLACE_WITH_YOUR_FORM_ID')) {
      status.className = 'form-status err';
      status.textContent = 'Form not configured. Replace REPLACE_WITH_YOUR_FORM_ID in contacto.html with your Formspree form ID (formspree.io).';
      return;
    }
    status.className = 'form-status';
    status.textContent = msgs[lang()].sending;
    submit.disabled = true;
    try {
      const res = await fetch(action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) {
        status.className = 'form-status ok';
        status.textContent = msgs[lang()].ok;
        form.reset();
      } else {
        throw new Error('bad status ' + res.status);
      }
    } catch (err) {
      status.className = 'form-status err';
      status.textContent = msgs[lang()].err;
    } finally {
      submit.disabled = false;
    }
  });
})();

// ═══════════ ABOUT VIDEO — interactive audio toggle ═══════════
(function() {
  const btn = document.getElementById('audioToggle');
  const video = document.getElementById('aboutVideo');
  if (!btn || !video) return;
  const iconMuted = btn.querySelector('.icon-muted');
  const iconUnmuted = btn.querySelector('.icon-unmuted');

  btn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
      iconMuted.style.display = '';
      iconUnmuted.style.display = 'none';
      btn.setAttribute('aria-label', 'Activar audio');
    } else {
      iconMuted.style.display = 'none';
      iconUnmuted.style.display = '';
      btn.setAttribute('aria-label', 'Silenciar audio');
      video.play().catch(() => {});
    }
  });
})();
