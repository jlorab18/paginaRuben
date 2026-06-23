// partials.js — shared nav and footer markup
// Loaded before main.js. main.js injects these into #nav-slot and #footer-slot.

window.PARTIALS = {
  NAV: `<nav class="site-nav" id="mainNav">
  <a href="index.html" class="nav-logo">
    <img src="img-min/logos/img-9656.png" alt="Rubén Erimo" decoding="async" width="596" height="596">
    <span class="nav-logo-text">Rubén Erimo</span>
  </a>
  <ul class="nav-links">
    <li><a href="proyectos.html" data-es="Proyectos" data-en="Projects">Proyectos</a></li>
    <li><a href="nosotros.html" data-es="Nosotros" data-en="About">Nosotros</a></li>
    <li><a href="contacto.html" data-es="Contacto" data-en="Contact">Contacto</a></li>
  </ul>
  <div class="nav-right">
    <div class="nav-toggles">
      <button class="toggle-btn" id="langToggle" onclick="toggleLang()">EN</button>
    </div>
    <a href="contacto.html" class="nav-cta" data-es="Hablemos" data-en="Let's talk">Hablemos</a>
  </div>
  <button class="nav-hamburger" id="hamburger" onclick="toggleMenu()" aria-label="Abrir menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="proyectos.html" onclick="closeMenu()" data-es="Proyectos" data-en="Projects">Proyectos</a>
  <a href="nosotros.html" data-es="Nosotros" data-en="About">Nosotros</a>
  <a href="contacto.html" data-es="Contacto" data-en="Contact">Contacto</a>
  <a href="https://www.instagram.com/rubenerimo" target="_blank" rel="noopener">Instagram</a>
  <div class="mobile-toggles">
    <button class="toggle-btn" onclick="toggleLang()">ES / EN</button>
  </div>
</div>`,

  FOOTER: `<footer class="site-footer">
  <div class="footer-inner">
    <div>
      <div class="footer-brand">Rubén <span class="accent">Erimo</span>.</div>
      <p class="footer-tagline">#WeTheBestContent — content that lasts.</p>
    </div>
    <div class="footer-col">
      <h4 data-es="Navegación" data-en="Navigation">Navegación</h4>
      <ul>
        <li><a href="proyectos.html" data-es="Proyectos" data-en="Projects">Proyectos</a></li>
        <li><a href="nosotros.html" data-es="Nosotros" data-en="About">Nosotros</a></li>
        <li><a href="contacto.html" data-es="Contacto" data-en="Contact">Contacto</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4 data-es="Redes" data-en="Social">Redes</h4>
      <ul>
        <li><a href="https://www.instagram.com/rubenerimo" target="_blank" rel="noopener">Instagram</a></li>
        <li><a href="https://www.youtube.com/@RubenErimo" target="_blank" rel="noopener">YouTube</a></li>
        <li><a href="mailto:rubenerimo@gmail.com">Email</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 Rubén Erimo — All Rights Reserved</span>
    <span data-es="Hecho con cuidado" data-en="Made with care">Hecho con cuidado</span>
  </div>
</footer>`
};

// Inject synchronously. partials.js is loaded just before main.js at the end of body,
// so slot elements already exist in DOM. main.js can query injected nodes immediately.
(function() {
  const navSlot = document.getElementById('nav-slot');
  if (navSlot) navSlot.outerHTML = window.PARTIALS.NAV;
  const footerSlot = document.getElementById('footer-slot');
  if (footerSlot) footerSlot.outerHTML = window.PARTIALS.FOOTER;
})();
