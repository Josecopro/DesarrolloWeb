function initHelpButton() {
  const helpButton = document.querySelector('.help-button');
  if (!helpButton) return;

  const trigger = helpButton.querySelector('.help-button__trigger');
  const panel = helpButton.querySelector('.help-button__panel');
  const closeBtn = helpButton.querySelector('.help-button__close');
  const form = helpButton.querySelector('.help-button__form form');

  trigger?.addEventListener('click', () => {
    helpButton.classList.toggle('help-button--open');
    trigger.setAttribute('aria-expanded', helpButton.classList.contains('help-button--open'));
  });

  closeBtn?.addEventListener('click', () => {
    helpButton.classList.remove('help-button--open');
    trigger.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('click', (e) => {
    if (!helpButton.contains(e.target)) {
      helpButton.classList.remove('help-button--open');
      trigger?.setAttribute('aria-expanded', 'false');
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showPopup('¡Mensaje enviado!', 'Tu solicitud ha sido enviada correctamente. Te responderemos a tu correo electrónico.');
      form.reset();
    } catch (error) {
      showPopup('Error', 'No se pudo enviar el mensaje. Por favor intenta nuevamente.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  function showPopup(title, message) {
    const popup = document.createElement('div');
    popup.className = 'pqrs-form__popup pqrs-form__popup--visible';
    popup.innerHTML = `
      <div class="pqrs-form__popup-content" role="dialog" aria-modal="true" aria-labelledby="popup-title">
        <div class="pqrs-form__popup-icon">
          <svg class="icon icon--xl" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 id="popup-title" class="pqrs-form__popup-title">${title}</h3>
        <p class="pqrs-form__popup-text">${message}</p>
      </div>
    `;

    document.body.appendChild(popup);

    setTimeout(() => {
      popup.classList.remove('pqrs-form__popup--visible');
      setTimeout(() => popup.remove(), 300);
    }, 4000);

    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.classList.remove('pqrs-form__popup--visible');
        setTimeout(() => popup.remove(), 300);
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHelpButton);
} else {
  initHelpButton();
}