/* modal.js */

(function () {
  const MODAL_HTML_PATH = './modal.html';
  const MODAL_CSS_PATH = './modal.css';

  let modalRoot = null;

  function ensureModalLoaded() {
    return new Promise((resolve) => {
      if (modalRoot) return resolve(modalRoot);

      // Carrega css e html do modal de forma simples (sem frameworks)
      const cssLinkId = 'bw-modal-css-link';
      if (!document.getElementById(cssLinkId)) {
        const link = document.createElement('link');
        link.id = cssLinkId;
        link.rel = 'stylesheet';
        link.href = './css/modal.css';
        document.head.appendChild(link);
      }

      fetch(MODAL_HTML_PATH)
        .then((r) => {
          if (!r.ok) throw new Error('Falha ao carregar modal.html');
          return r.text();
        })
        .then((htmlString) => {
          const ghost = document.createElement('div');
          ghost.innerHTML = htmlString.trim();
          modalRoot = ghost.firstElementChild;

          // Junta ao final do body
          document.body.appendChild(modalRoot);
          bindModalListeners();
          resolve(modalRoot);
        })
        .catch((e) => {
          console.error(e);
          resolve(null);
        });
    });
  }

  function bindModalListeners() {
    if (!modalRoot) return;

    const closeBtn = modalRoot.querySelector('#bw-modal-close');
    const overlay = modalRoot;
    const form = modalRoot.querySelector('#bw-create-form');
    const colorInput = modalRoot.querySelector('#bw-comm-color');
    const colorHex = modalRoot.querySelector('#bw-comm-color-hex');

    function atualizarHex() {
      if (!colorInput || !colorHex) return;
      colorHex.textContent = (colorInput.value || '#3B82F6').toUpperCase();
    }

    if (colorInput) {
      colorInput.addEventListener('input', atualizarHex);
      atualizarHex();
    }

    if (closeBtn) closeBtn.addEventListener('click', fecharModal);

    // Fechar ao clicar fora
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharModal();
    });

    // Fechar com ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') fecharModal();
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = modalRoot.querySelector('#bw-comm-name')?.value?.trim();
        const desc = modalRoot.querySelector('#bw-comm-desc')?.value?.trim();
        const color = modalRoot.querySelector('#bw-comm-color')?.value;
        const image = modalRoot.querySelector('#bw-comm-image')?.value?.trim();

        if (!name) return;

        const payload = {
          name,
          desc: desc || '',
          color: color || '#3b82f6',
          image: image || ''
        };

        if (typeof window.adicionarComunidade === 'function') {
          window.adicionarComunidade(payload);
        }

        form.reset();
        // garante hex render
        if (colorInput) {
          colorInput.value = '#3b82f6';
          atualizarHex();
        }
        fecharModal();
      });
    }
  }

  function abrirModal() {
    ensureModalLoaded().then(() => {
      if (!modalRoot) return;
      modalRoot.classList.add('active');
      modalRoot.setAttribute('aria-hidden', 'false');

      // foco no primeiro input
      const first = modalRoot.querySelector('input, textarea, button');
      if (first && typeof first.focus === 'function') first.focus();

      document.body.style.overflow = 'hidden';
    });
  }

  function fecharModal() {
    if (!modalRoot) return;
    modalRoot.classList.remove('active');
    modalRoot.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Expor função global para o index.html (botão criar)
  window.abrirModal = abrirModal;

  // Opcional: abrir se quiser pré-carregar (não aqui)
})();

