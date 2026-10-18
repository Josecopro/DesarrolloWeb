// Comparison Tool
const COMPARISON_KEY = 'duam-comparison';
const FAVORITES_KEY = 'duam-favorites';
const MAX_COMPARISON = 4;

function getComparison() {
  try {
    return JSON.parse(localStorage.getItem(COMPARISON_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveComparison(items) {
  localStorage.setItem(COMPARISON_KEY, JSON.stringify(items));
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFavorites(items) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

function initComparisonTool() {
  const tool = document.querySelector('.comparison-tool');
  if (!tool) return;

  const panel = tool.querySelector('.comparison-tool__list');
  const countEl = tool.querySelector('.comparison-tool__count strong');
  const clearBtn = tool.querySelector('.comparison-tool__clear');
  const compareBtn = tool.querySelector('.comparison-tool__compare');

  function render() {
    const items = getComparison();
    if (countEl) countEl.textContent = items.length;

    if (panel) {
      if (items.length === 0) {
        panel.innerHTML = '<p class="text-muted text-sm text-center py-4">No hay elementos para comparar</p>';
      } else {
        panel.innerHTML = items.map(item => `
          <div class="comparison-tool__item" data-id="${item.id}" data-type="${item.type}">
            <span class="comparison-tool__item-name">${item.name}</span>
            <span class="tag tag--outline tag--sm">${item.category}</span>
            <button class="comparison-tool__remove" aria-label="Eliminar ${item.name}">
              <svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        `).join('');

        panel.querySelectorAll('.comparison-tool__remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const item = e.currentTarget.closest('.comparison-tool__item');
            if (item) {
              removeFromComparison(item.dataset.id, item.dataset.type);
            }
          });
        });
      }
    }

    tool.classList.toggle('comparison-tool--open', items.length > 0);
    compareBtn.disabled = items.length < 2;
  }

  function addToComparison(item) {
    const items = getComparison();
    if (items.some(i => i.id === item.id && i.type === item.type)) return;
    if (items.length >= MAX_COMPARISON) {
      alert(`Máximo ${MAX_COMPARISON} elementos para comparar`);
      return;
    }
    items.push(item);
    saveComparison(items);
    render();
  }

  function removeFromComparison(id, type) {
    const items = getComparison().filter(i => !(i.id === id && i.type === type));
    saveComparison(items);
    render();
    updatePageCheckboxes();
  }

  function clearComparison() {
    saveComparison([]);
    render();
    updatePageCheckboxes();
  }

  function updatePageCheckboxes() {
    const items = getComparison();
    document.querySelectorAll('.compare-checkbox input').forEach(checkbox => {
      const card = checkbox.closest('[data-compare-id]');
      if (card) {
        const id = card.dataset.compareId;
        const type = card.dataset.compareType;
        checkbox.checked = items.some(i => i.id === id && i.type === type);
      }
    });
  }

  clearBtn?.addEventListener('click', clearComparison);

  compareBtn?.addEventListener('click', () => {
    const items = getComparison();
    if (items.length < 2) return;
    const params = new URLSearchParams();
    items.forEach(item => params.append('items', JSON.stringify(item)));
    window.location.href = `comparar.html?${params.toString()}`;
  });

  render();

  // Expose globally for page checkboxes
  window.DUAM = window.DUAM || {};
  window.DUAM.comparison = { add: addToComparison, remove: removeFromComparison, get: getComparison, render };
}

function initFavoritesButton() {
  const button = document.querySelector('.favorites-button');
  if (!button) return;

  const trigger = button.querySelector('.favorites-button__trigger');
  const panel = button.querySelector('.favorites-button__list');
  const countEl = button.querySelector('.favorites-button__count');
  const closeBtn = button.querySelector('.favorites-button__close');

  function render() {
    const items = getFavorites();
    if (countEl) {
      countEl.textContent = items.length;
      countEl.style.display = items.length > 0 ? 'flex' : 'none';
    }

    if (panel) {
      if (items.length === 0) {
        panel.innerHTML = '<p class="favorites-button__empty">No tienes favoritos guardados</p>';
      } else {
        panel.innerHTML = items.map(item => `
          <a href="${item.url}" class="favorites-button__item" target="_blank" rel="noopener noreferrer">
            ${item.image ? `<img src="${item.image}" alt="" class="favorites-button__item-image">` : '<div class="favorites-button__item-image" style="background: var(--color-bg); display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);"><svg class="icon icon--md" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg></div>'}
            <div class="favorites-button__item-content">
              <div class="favorites-button__item-title">${item.name}</div>
              <div class="favorites-button__item-type">${item.category}</div>
            </div>
            <button class="favorites-button__remove" data-id="${item.id}" data-type="${item.type}" aria-label="Eliminar de favoritos">
              <svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </a>
        `).join('');

        panel.querySelectorAll('.favorites-button__remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeFromFavorites(btn.dataset.id, btn.dataset.type);
          });
        });
      }
    }
  }

  function addToFavorites(item) {
    const items = getFavorites();
    if (items.some(i => i.id === item.id && i.type === item.type)) return;
    items.push(item);
    saveFavorites(items);
    render();
    updatePageFavorites();
  }

  function removeFromFavorites(id, type) {
    const items = getFavorites().filter(i => !(i.id === id && i.type === type));
    saveFavorites(items);
    render();
    updatePageFavorites();
  }

  function updatePageFavorites() {
    const items = getFavorites();
    document.querySelectorAll('.favorite-button').forEach(btn => {
      const card = btn.closest('[data-favorite-id]');
      if (card) {
        const id = card.dataset.favoriteId;
        const type = card.dataset.favoriteType;
        const isFav = items.some(i => i.id === id && i.type === type);
        btn.classList.toggle('favorite-button--active', isFav);
        btn.setAttribute('aria-pressed', isFav);
      }
    });
  }

  trigger?.addEventListener('click', () => {
    button.classList.toggle('favorites-button--open');
    trigger.setAttribute('aria-expanded', button.classList.contains('favorites-button--open'));
  });

  closeBtn?.addEventListener('click', () => {
    button.classList.remove('favorites-button--open');
    trigger.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('click', (e) => {
    if (!button.contains(e.target)) {
      button.classList.remove('favorites-button--open');
      trigger?.setAttribute('aria-expanded', 'false');
    }
  });

  render();

  window.DUAM = window.DUAM || {};
  window.DUAM.favorites = { add: addToFavorites, remove: removeFromFavorites, get: getFavorites, render };
}

function initUniversityFilters() {
  const filterForm = document.querySelector('.university-filter');
  if (!filterForm) return;

  const typeSelect = filterForm.querySelector('[data-filter-type]');
  const searchInput = filterForm.querySelector('[data-filter-search]');
  const clearBtn = filterForm.querySelector('[data-filter-clear]');
  const grid = document.getElementById('private-universities') || document.getElementById('public-universities');

  let universitiesData = [];

  async function loadData() {
    try {
      const response = await fetch('../data/universities.js');
      const text = await response.text();
      const module = { exports: {} };
      eval(text + '; module.exports = universities;');
      universitiesData = [
        ...module.exports.private.map(u => ({ ...u, type: 'private' })),
        ...module.exports.public.map(u => ({ ...u, type: 'public' }))
      ];
      render();
    } catch (e) {
      console.error('Error loading universities:', e);
    }
  }

  function render() {
    if (!grid) return;

    let filtered = [...universitiesData];

    if (typeSelect && typeSelect.value !== 'all') {
      filtered = filtered.filter(u => u.type === typeSelect.value);
    }

    if (searchInput && searchInput.value.trim()) {
      const query = searchInput.value.trim().toLowerCase();
      filtered = filtered.filter(u => u.name.toLowerCase().includes(query));
    }

    grid.innerHTML = filtered.map(uni => `
      <a href="${uni.url}" target="_blank" rel="noopener noreferrer" class="university-list__item ${uni.type === 'public' ? 'university-list__item--public' : ''}" role="listitem">
        ${uni.name}
      </a>
    `).join('');
  }

  typeSelect?.addEventListener('change', render);
  searchInput?.addEventListener('input', () => {
    clearTimeout(window.filterDebounce);
    window.filterDebounce = setTimeout(render, 200);
  });
  clearBtn?.addEventListener('click', () => {
    if (typeSelect) typeSelect.value = 'all';
    if (searchInput) searchInput.value = '';
    render();
  });

  loadData();
}

function initCompareCheckboxes() {
  document.querySelectorAll('.compare-checkbox input').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const card = e.target.closest('[data-compare-id]');
      if (!card) return;

      const item = {
        id: card.dataset.compareId,
        type: card.dataset.compareType,
        name: card.dataset.compareName,
        category: card.dataset.compareCategory,
        url: card.dataset.compareUrl,
        image: card.dataset.compareImage
      };

      if (e.target.checked) {
        window.DUAM?.comparison?.add(item);
      } else {
        window.DUAM?.comparison?.remove(item.id, item.type);
      }
    });
  });
}

function initFavoriteButtons() {
  document.querySelectorAll('.favorite-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest('[data-favorite-id]');
      if (!card) return;

      const item = {
        id: card.dataset.favoriteId,
        type: card.dataset.favoriteType,
        name: card.dataset.favoriteName,
        category: card.dataset.favoriteCategory,
        url: card.dataset.favoriteUrl,
        image: card.dataset.favoriteImage
      };

      const isActive = btn.classList.toggle('favorite-button--active');
      btn.setAttribute('aria-pressed', isActive);

      if (isActive) {
        window.DUAM?.favorites?.add(item);
      } else {
        window.DUAM?.favorites?.remove(item.id, item.type);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initComparisonTool();
    initFavoritesButton();
    initUniversityFilters();
    initCompareCheckboxes();
    initFavoriteButtons();
  });
} else {
  initComparisonTool();
  initFavoritesButton();
  initUniversityFilters();
  initCompareCheckboxes();
  initFavoriteButtons();
}