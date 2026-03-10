// ═══════════ LOADER ═══════════
const loader = document.getElementById('loader');
if (loader) {
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('done'), 2600);
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
    counter.textContent = String(cur + 1).padStart(2, '0');
  }
  function nextSlide() { goSlide((cur + 1) % slides.length); }
  function startAuto() { autoTimer = setInterval(nextSlide, 5000); }
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
    if (t) t.scrollIntoView({ behavior: 'smooth' });
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
  const lbImg = document.getElementById('lightboxImg');
  const lbCounter = document.getElementById('lightboxCounter');

  window.openLightbox = function(el) {
    const container = el.closest('.gallery-grid');
    lbImages = Array.from(container.querySelectorAll('.gallery-item img'));
    lbIndex = lbImages.indexOf(el.querySelector('img'));
    showLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function showLightboxImage() {
    lbImg.src = lbImages[lbIndex].src;
    lbImg.alt = lbImages[lbIndex].alt;
    lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
  }

  window.closeLightbox = function(e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.navLightbox = function(dir, e) {
    e.stopPropagation();
    lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
    showLightboxImage();
  };

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
    if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; showLightboxImage(); }
    if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; showLightboxImage(); }
  });
}

// ═══════════ THEME TOGGLE ═══════════
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeBtn();
}
function updateThemeBtn() {
  const isLight = document.body.classList.contains('light');
  document.querySelectorAll('#themeToggle').forEach(b => b.textContent = isLight ? 'Dark' : 'Light');
}
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');
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
    }
  });
  document.querySelectorAll('[data-es-html]').forEach(el => {
    const html = el.getAttribute('data-' + currentLang + '-html');
    if (html) el.innerHTML = html;
  });
  document.querySelectorAll('#langToggle').forEach(b => b.textContent = currentLang === 'es' ? 'EN' : 'ES');
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
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }
}
function closeMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  if (menu) { menu.classList.remove('open'); btn.classList.remove('open'); document.body.style.overflow = ''; }
}

// ═══════════ CUSTOM CURSOR ═══════════
const cursorEl = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
const cursorLabel = document.getElementById('cursorLabel');

if (cursorEl && window.matchMedia('(pointer:fine)').matches) {
  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  (function moveCursor() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cursorEl.style.transform = `translate(${cx - 8}px, ${cy - 8}px)`;
    cursorDot.style.transform = `translate(${mx - 2}px, ${my - 2}px)`;
    cursorLabel.style.transform = `translate(${mx}px, ${my + 40}px)`;
    requestAnimationFrame(moveCursor);
  })();

  document.addEventListener('mouseover', e => {
    const t = e.target;
    if (t.closest('.gallery-item')) {
      cursorEl.classList.add('hover-gallery');
      cursorEl.classList.remove('hover');
      cursorLabel.textContent = 'VER';
      cursorLabel.classList.add('vis');
    } else if (t.closest('.trabajo-card')) {
      cursorEl.classList.add('hover');
      cursorEl.classList.remove('hover-gallery');
      cursorLabel.textContent = 'ABRIR';
      cursorLabel.classList.add('vis');
    } else if (t.closest('a, button, [onclick], .service-row, .nav-cta')) {
      cursorEl.classList.add('hover');
      cursorEl.classList.remove('hover-gallery');
      cursorLabel.textContent = '';
      cursorLabel.classList.remove('vis');
    } else {
      cursorEl.classList.remove('hover', 'hover-gallery');
      cursorLabel.textContent = '';
      cursorLabel.classList.remove('vis');
    }
  });

  document.addEventListener('mouseout', e => {
    if (!e.relatedTarget || e.relatedTarget === document.documentElement) {
      cursorEl.classList.remove('hover', 'hover-gallery');
      cursorLabel.classList.remove('vis');
    }
  });
}
