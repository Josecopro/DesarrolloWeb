import { universities } from '../../../data/universities.js';
import { careers } from '../../../data/careers.js';

const allSearchData = [
  ...universities.private.map(u => ({ type: 'university', name: u.name, url: u.url, category: 'Privada' })),
  ...universities.public.map(u => ({ type: 'university', name: u.name, url: u.url, category: 'Pública' })),
  ...careers.categories.map(c => ({ type: 'career', name: c.name, url: `carreras.html#${c.id}`, category: c.icon + ' ' + c.name }))
];

let debounceTimer;

function initSearchBox() {
  const searchBox = document.querySelector('[data-search-box]');
  if (!searchBox) return;

  const input = searchBox.querySelector('[data-search-input]');
  const results = searchBox.querySelector('[data-search-results]');

  input?.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim().toLowerCase();

    if (query.length < 2) {
      closeResults();
      return;
    }

    debounceTimer = setTimeout(() => {
      const filtered = allSearchData
        .filter(item => item.name.toLowerCase().includes(query))
        .slice(0, 8);

      renderResults(filtered);
    }, 150);
  });

  input?.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) {
      const filtered = allSearchData
        .filter(item => item.name.toLowerCase().includes(input.value.trim().toLowerCase()))
        .slice(0, 8);
      renderResults(filtered);
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target)) {
      closeResults();
    }
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResults();
      input.blur();
    }
  });

  function renderResults(items) {
    if (!results) return;

    if (items.length === 0) {
      results.innerHTML = '<div class="search-box__empty">No se encontraron resultados</div>';
    } else {
      results.innerHTML = items.map(item => `
        <a href="${item.url}" class="search-box__result-item" role="option">
          <div class="search-box__result-content">
            <div class="search-box__result-title">${highlightMatch(item.name, input.value.trim())}</div>
            <div class="search-box__result-subtitle">${item.category}</div>
          </div>
        </a>
      `).join('');
    }

    searchBox.classList.add('search-box--open');
  }

  function closeResults() {
    searchBox.classList.remove('search-box--open');
  }

  function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearchBox);
} else {
  initSearchBox();
}