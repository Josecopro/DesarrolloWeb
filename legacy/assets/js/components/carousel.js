function initCarousel(carouselSelector = '.scholarship-carousel') {
  const carousels = document.querySelectorAll(carouselSelector);

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.scholarship-carousel__track');
    const slides = carousel.querySelectorAll('.scholarship-carousel__slide');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const indicatorsContainer = carousel.querySelector('.scholarship-carousel__indicators');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let maxIndex = slides.length - slidesPerView;
    let autoplayTimer;

    function getSlidesPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }

    function updateSlidesPerView() {
      const newSlidesPerView = getSlidesPerView();
      if (newSlidesPerView !== slidesPerView) {
        slidesPerView = newSlidesPerView;
        maxIndex = Math.max(0, slides.length - slidesPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateCarousel();
        renderIndicators();
      }
    }

    function renderIndicators() {
      if (!indicatorsContainer) return;
      const totalPages = Math.ceil(slides.length / slidesPerView);
      indicatorsContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => `
        <button class="scholarship-carousel__indicator ${i === Math.floor(currentIndex / slidesPerView) ? 'scholarship-carousel__indicator--active' : ''}"
                data-carousel-page="${i}"
                aria-label="Ir a página ${i + 1}"></button>
      `).join('');

      indicatorsContainer.querySelectorAll('[data-carousel-page]').forEach(btn => {
        btn.addEventListener('click', () => {
          goToPage(parseInt(btn.dataset.carouselPage));
        });
      });
    }

    function updateCarousel() {
      const slideWidth = 100 / slidesPerView;
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;

      if (indicatorsContainer) {
        const activePage = Math.floor(currentIndex / slidesPerView);
        indicatorsContainer.querySelectorAll('.scholarship-carousel__indicator').forEach((indicator, i) => {
          indicator.classList.toggle('scholarship-carousel__indicator--active', i === activePage);
        });
      }
    }

    function goToIndex(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateCarousel();
      resetAutoplay();
    }

    function goToPage(page) {
      goToIndex(page * slidesPerView);
    }

    function next() {
      goToIndex(currentIndex + 1);
    }

    function prev() {
      goToIndex(currentIndex - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        if (currentIndex >= maxIndex) {
          goToIndex(0);
        } else {
          next();
        }
      }, 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('resize', updateSlidesPerView);

    renderIndicators();
    updateCarousel();
    startAutoplay();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initCarousel());
} else {
  initCarousel();
}