const fs = require('fs');
const path = require('path');

const pagesDir = '/home/josecoprolovespenguins/Projects/DUAM2/pages';

// Read partials
const headerPages = fs.readFileSync(path.join(pagesDir, '_header_pages.html'), 'utf8');
const headerSubdivisions = fs.readFileSync(path.join(pagesDir, '_header_subdivisions.html'), 'utf8');
const footerPages = fs.readFileSync(path.join(pagesDir, '_footer_pages.html'), 'utf8');
const footerSubdivisions = fs.readFileSync(path.join(pagesDir, '_footer_subdivisions.html'), 'utf8');

// Inline script for interactivity
const inlineScript = `
<script>
(function() {
  // Navbar toggle
  const toggle = document.querySelector('[data-navbar-toggle]');
  const menu = document.querySelector('.navbar__menu');
  toggle?.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('navbar__menu--open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.innerHTML = isOpen
      ? '<svg class="icon icon--md" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
      : '<svg class="icon icon--md" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  });

  document.addEventListener('click', (e) => {
    if (!menu?.contains(e.target) && !toggle?.contains(e.target)) {
      menu?.classList.remove('navbar__menu--open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Dropdown
  document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown__trigger');
    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('dropdown--open');
      trigger.setAttribute('aria-expanded', dropdown.classList.contains('dropdown--open'));
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-dropdown]')) {
      document.querySelectorAll('[data-dropdown]').forEach(d => d.classList.remove('dropdown--open'));
    }
  });
  document.querySelectorAll('.dropdown__item').forEach(item => {
    item.addEventListener('click', () => {
      const career = item.dataset.career;
      if (career) window.location.href = '../carreras.html#' + career;
    });
  });

  // Theme toggle
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const THEME_KEY = 'duam-theme';
  function getPreferredTheme() {
    const saved = localStorage.getItem('duam-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('duam-theme', theme);
  }
  applyTheme(getPreferredTheme());
  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('duam-theme')) applyTheme(e.matches ? 'dark' : 'light');
  });

  // Search box
  const searchBox = document.querySelector('[data-search-box]');
  if (searchBox) {
    const input = searchBox.querySelector('[data-search-input]');
    const results = searchBox.querySelector('[data-search-results]');
    let debounceTimer;
    input?.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim().toLowerCase();
      if (query.length < 2) { searchBox.classList.remove('search-box--open'); return; }
      debounceTimer = setTimeout(() => {
        // Would need search data loaded - placeholder
        searchBox.classList.add('search-box--open');
      }, 150);
    });
    document.addEventListener('click', (e) => { if (!searchBox.contains(e.target)) searchBox.classList.remove('search-box--open'); });
    input?.addEventListener('keydown', (e) => { if (e.key === 'Escape') { searchBox.classList.remove('search-box--open'); input.blur(); } });
  }

  // Current year
  document.getElementById('current-year')?.textContent = new Date().getFullYear();

  // Highlight current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('navbar__link--active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
</script>
`;

// Pages in /pages/ (depth 1)
const pagesDepth1 = [
  'index.html',
  'universidades.html',
  'carreras.html',
  'becas.html',
  'nosotros.html',
  'importante.html',
  'buscador.html',
  'comparar.html'
];

// Pages in /pages/carreras.divisiones/ (depth 2)
const pagesDepth2 = [
  'carreras.divisiones/ingenierias.html',
  'carreras.divisiones/salud.html',
  'carreras.divisiones/humanidades.html',
  'carreras.divisiones/educacion.html',
  'carreras.divisiones/cienciasbasicas.html',
  'carreras.divisiones/cienciassociales.html',
  'carreras.divisiones/servicios.html'
];

function updatePage(filePath, headerHtml, footerHtml, isSubdivision) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace data-header placeholder
  content = content.replace('<div data-header></div>', headerHtml);
  
  // Replace data-footer placeholder
  content = content.replace('<div data-footer></div>', footerHtml);
  
  // Remove old module script imports for header/footer/theme-toggle
  content = content.replace(/<script type="module" src="\.\.\/assets\/js\/main\.js"><\/script>/, '');
  content = content.replace(/<script type="module" src="\.\.\/assets\/js\/components\/header\.js"><\/script>/g, '');
  content = content.replace(/<script type="module" src="\.\.\/assets\/js\/components\/footer\.js"><\/script>/g, '');
  
  // Add inline script at end of body (before closing body tag)
  content = content.replace('</body>', inlineScript + '\n</body>');
  
  // Fix logo paths if needed (they should already be correct in header/footer partials)
  // But ensure the inline script uses correct relative paths for dropdown links
  if (isSubdivision) {
    // Fix dropdown links to go to ../carreras.html#...
    content = content.replace(/window\.location\.href = `carreras\.html#\$\{career\}`/g, 
      "window.location.href = '../carreras.html#' + career");
  } else {
    content = content.replace(/window\.location\.href = `carreras\.html#\$\{career\}`/g, 
      "window.location.href = 'carreras.html#' + career");
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${filePath}`);
}

// Process depth 1 pages
pagesDepth1.forEach(page => {
  const filePath = path.join('/home/josecoprolovespenguins/Projects/DUAM2/pages', page);
  updatePage(filePath, headerPages, footerPages, false);
});

// Process depth 2 pages
pagesDepth2.forEach(page => {
  const filePath = path.join('/home/josecoprolovespenguins/Projects/DUAM2/pages', page);
  updatePage(filePath, headerSubdivisions, footerSubdivisions, true);
});

console.log('All pages updated!');