const FOOTER_HTML = `
<footer class="footer" role="contentinfo">
  <div class="footer__container">
    <div class="footer__grid">
      <div class="footer__brand">
        <a href="index.html" class="footer__logo logo logo--horizontal logo--large" aria-label="DUAM - Inicio">
          <img src="../assets/images/DUAM_LOGO_blanco.svg" alt="" class="logo__image" width="56" height="56">
          <span class="logo__text">DUAM</span>
        </a>
        <p class="footer__description">
          Directorio Universitario del Área Metropolitana. Tu guía para encontrar la mejor opción educativa en Antioquia.
        </p>
      </div>

      <nav class="footer__section" aria-label="Enlaces rápidos">
        <h3 class="footer__section-title">Enlaces rápidos</h3>
        <ul class="footer__links">
          <li><a href="index.html" class="footer__link">Inicio</a></li>
          <li><a href="universidades.html" class="footer__link">Universidades</a></li>
          <li><a href="carreras.html" class="footer__link">Carreras</a></li>
          <li><a href="becas.html" class="footer__link">Becas</a></li>
          <li><a href="nosotros.html" class="footer__link">Nosotros</a></li>
        </ul>
      </nav>

      <nav class="footer__section" aria-label="Carreras por área">
        <h3 class="footer__section-title">Carreras</h3>
        <ul class="footer__links">
          <li><a href="carreras.html#ingenierias" class="footer__link">Ingenierías</a></li>
          <li><a href="carreras.html#salud" class="footer__link">Salud</a></li>
          <li><a href="carreras.html#humanidades" class="footer__link">Humanidades</a></li>
          <li><a href="carreras.html#educacion" class="footer__link">Educación</a></li>
          <li><a href="carreras.html#cienciasbasicas" class="footer__link">Ciencias Básicas</a></li>
        </ul>
      </nav>

      <nav class="footer__section" aria-label="Más carreras">
        <h3 class="footer__section-title">Más áreas</h3>
        <ul class="footer__links">
          <li><a href="carreras.html#cienciassociales" class="footer__link">Ciencias Sociales y Derecho</a></li>
          <li><a href="carreras.html#servicios" class="footer__link">Servicios</a></li>
          <li><a href="buscador.html" class="footer__link">Buscador</a></li>
          <li><a href="importante.html" class="footer__link">Misión y Visión</a></li>
        </ul>
      </nav>
    </div>
  </div>
</footer>
`;

function initFooter() {
  const placeholder = document.querySelector('[data-footer]');
  if (!placeholder) return;

  placeholder.outerHTML = FOOTER_HTML;

  document.getElementById('current-year').textContent = new Date().getFullYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFooter);
} else {
  initFooter();
}