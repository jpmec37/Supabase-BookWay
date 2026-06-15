

document.addEventListener("DOMContentLoaded", () => {

   const botaoSidebar = document.getElementById("bttn-oc");
    botaoSidebar.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-collapsed");
    });
  // ==========================================================================
  // 1. ALTERNAR ABAS NA PÁGINA DE CONFIGURAÇÕES
  // ==========================================================================
  const botoesConfig = document.querySelectorAll('.settings-btn');
  const paineisConfig = document.querySelectorAll('.settings-panel');

  if (botoesConfig.length > 0 && paineisConfig.length > 0) {
    botoesConfig.forEach(botao => {
      botao.addEventListener('click', () => {
        botoesConfig.forEach(b => b.classList.remove('active'));
        paineisConfig.forEach(p => p.classList.remove('active'));
        
        botao.classList.add('active');
        
        const targetId = botao.getAttribute('data-target');
        const painelAlvo = document.getElementById(targetId);
        if (painelAlvo) {
          painelAlvo.classList.add('active');
        }
      });
    });
  }

  // ==========================================================================
  // 2. MODAL DE EDIÇÃO DE PERFIL (GATILHO PELA CLASSE)
  // ==========================================================================
  const btnEditProfile = document.querySelector('.settings-user-card'); // Captura seu card do print
  const profileModal = document.getElementById('profile-modal');
  const closeProfileModal = document.getElementById('close-profile-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const editProfileForm = document.getElementById('edit-profile-form');

  if (btnEditProfile && profileModal) {
    btnEditProfile.addEventListener('click', () => {
      profileModal.classList.add('active');
      profileModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  function fecharModalPerfil() {
    if (profileModal) {
      profileModal.classList.remove('active');
      profileModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (closeProfileModal) closeProfileModal.addEventListener('click', fecharModalPerfil);
  if (btnCancelModal) btnCancelModal.addEventListener('click', fecharModalPerfil);

  if (profileModal) {
    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) {
        fecharModalPerfil();
      }
    });
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      fecharModalPerfil();
    }
  });

  if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      fecharModalPerfil();
    });
  }
});

const footerScrollBtn = document.getElementById("backtop");
  if (footerScrollBtn) {
    footerScrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  