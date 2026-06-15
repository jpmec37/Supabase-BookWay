document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. ALTERNAR BARRA LATERAL (SIDEBAR)
  // ==========================================================================
  const botaoSidebar = document.getElementById("bttn-oc");
    botaoSidebar.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-collapsed");
    });
  

  // ==========================================================================
  // 2. CARROSSEIS HORIZONTAIS (Seta para os lados & Verificação de quantidade)
  // ==========================================================================
  const secoesHorizontais = document.querySelectorAll(".secao-horizontal");
  const quantidadeScroll = 380; // Pixels que o carrossel pula

  secoesHorizontais.forEach((secao) => {
    const fileira = secao.querySelector(".book-row");
    const btnEsquerda = secao.querySelector(".btn-scroll-left");
    const btnDireita = secao.querySelector(".btn-scroll-right");
    const quantidadeLivros = secao.querySelectorAll(".book").length;

    // Oculta as setas se a seção tiver 7 livros ou menos
    if (quantidadeLivros <= 7) {
      if (btnEsquerda) btnEsquerda.classList.add("btn-oculto");
      if (btnDireita) btnDireita.classList.add("btn-oculto");
    }

    // Gerencia o clique de rolagem para a esquerda
    if (btnEsquerda && fileira) {
      btnEsquerda.addEventListener("click", () => {
        fileira.scrollLeft -= quantidadeScroll;
      });
    }

    // Gerencia o clique de rolagem para a direita
    if (btnDireita && fileira) {
      btnDireita.addEventListener("click", () => {
        fileira.scrollLeft += quantidadeScroll;
      });
    }
  });

  // ==========================================================================
  // 3. CARROSSEL HERO (ESTILO GALERIA 3D)
  // ==========================================================================
  const carousel = document.getElementById("hero-carousel");
  if (carousel) {
    const slides = document.querySelectorAll(".hero-slide");
    const btnPrev = document.getElementById("hero-prev");
    const btnNext = document.getElementById("hero-next");
    const indicatorsContainer = document.getElementById("hero-indicators");

    let currentIndex = 0;
    let autoPlayInterval;

    // Cria indicadores dinâmicos
    slides.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("hero-dot");
      if (index === 0) dot.classList.add("active");
      dot.dataset.index = index;
      indicatorsContainer.appendChild(dot);

      dot.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
      });
    });

    const dots = document.querySelectorAll(".hero-dot");

    function updateCarousel() {
      slides.forEach((slide) =>
        slide.classList.remove("active", "prev", "next"),
      );
      dots.forEach((dot) => dot.classList.remove("active"));

      const total = slides.length;
      const prevIndex = (currentIndex - 1 + total) % total;
      const nextIndex = (currentIndex + 1) % total;

      slides[currentIndex].classList.add("active");
      slides[prevIndex].classList.add("prev");
      slides[nextIndex].classList.add("next");
      if (dots[currentIndex]) dots[currentIndex].classList.add("active");
    }

    function goNext() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }

    function goPrev() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    }

    // Clique nos slides laterais para navegar
    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        if (slide.classList.contains("prev")) goPrev();
        if (slide.classList.contains("next")) goNext();
      });
    });

    if (btnNext) btnNext.addEventListener("click", goNext);
    if (btnPrev) btnPrev.addEventListener("click", goPrev);

    function startAutoPlay() {
      autoPlayInterval = setInterval(goNext, 5000);
    }
    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);

    updateCarousel();
    startAutoPlay();
  }

  // ==========================================================================
  // 4. BOTÃO VOLTAR AO TOPO (FOOTER)
  // ==========================================================================
  const footerScrollBtn = document.getElementById("backtop");
  if (footerScrollBtn) {
    footerScrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==========================================================================
  // 5. BARRAS DE PROGRESSO DO USUÁRIO
  // ==========================================================================
  const dadosDoUsuario = {
    "livro-01": { lidas: 133, total: 200 },
    "livro-02": { lidas: 45, total: 320 },
  };

  const progressoComponentes = document.querySelectorAll(".user-book-progress");
  progressoComponentes.forEach((componente) => {
    const bookId = componente.getAttribute("data-book-id");
    const progressoItem = dadosDoUsuario[bookId];
    const textPages = componente.querySelector(".text-pages");
    const fillBar = componente.querySelector(".fill-bar");

    if (progressoItem && textPages && fillBar) {
      const lidas = progressoItem.lidas;
      const total = progressoItem.total;
      const porcentagem = (lidas / total) * 100;

      textPages.textContent = `${lidas}/${total} páginas`;
      fillBar.style.width = `${porcentagem}%`;
    } else if (textPages) {
      textPages.textContent = "Não iniciado";
    }
  });

  // ==========================================================================
  // 6. GERENCIADOR CENTRALIZADO DE MODAIS (LIVROS E COMUNIDADES)
  // ==========================================================================
  // Elementos do Modal de Livros
  const bookModal = document.getElementById("book-modal");
  const modalCoverImg = document.getElementById("modal-cover-img");
  const modalTitle = document.getElementById("modal-title");
  const modalAuthor = document.getElementById("modal-author");
  const modalDescription = document.getElementById("modal-description");

  // Elementos do Modal de Comunidades
  const commModal = document.getElementById("community-modal");
  const commModalImg = document.getElementById("comm-modal-img");
  const commModalTitle = document.getElementById("comm-modal-title");
  const commModalBadge = document.getElementById("comm-modal-badge");
  const commModalMembers = document.getElementById("comm-modal-members");
  const commModalDesc = document.getElementById("comm-modal-description");

  // Altera estilo do cursor para indicar interatividade nas comunidades
  document
    .querySelectorAll(".comunidade")
    .forEach((el) => (el.style.cursor = "pointer"));

  // Ouvinte Global de Cliques para os Modais
  document.body.addEventListener("click", (event) => {
    // --- FLUXO A: ABRIR MODAL DE COMUNIDADES ---
    const commContainer = event.target.closest(".comunidade");
    if (commContainer) {
      event.preventDefault();
      const img = commContainer.querySelector("img");
      if (!img) return;

      if (commModalTitle)
        commModalTitle.textContent =
          img.getAttribute("data-comm-title") || "Nome da Comunidade";
      if (commModalBadge) {
        commModalBadge.textContent =
          img.getAttribute("data-comm-badge") || "Geral";
        commModalBadge.style.display = "inline-block";
      }
      if (commModalMembers)
        commModalMembers.textContent =
          img.getAttribute("data-comm-members") || "0 membros";
      if (commModalDesc)
        commModalDesc.textContent =
          img.getAttribute("data-comm-desc") || "Sem descrição disponível.";
      if (commModalImg) {
        commModalImg.src = img.src;
        commModalImg.alt = `Banner da comunidade ${commModalTitle.textContent}`;
      }

      if (commModal) {
        commModal.classList.add("active");
        commModal.style.display = "flex";
        document.body.style.overflow = "hidden";
      }
      return;
    }

    // --- FLUXO B: ABRIR MODAL DE LIVROS ---
    const bookContainer = event.target.closest(".book");
    if (bookContainer) {
      const img = bookContainer.querySelector("img");
      if (!img) return;

      if (modalTitle)
        modalTitle.textContent =
          img.getAttribute("title") || "Título Indisponível";
      if (modalAuthor)
        modalAuthor.textContent =
          img.getAttribute("author") || "Autor Desconhecido";
      if (modalDescription)
        modalDescription.textContent =
          img.getAttribute("description") || "Nenhuma sinopse disponível.";
      if (modalCoverImg) {
        modalCoverImg.src = img.src;
        modalCoverImg.alt = modalTitle.textContent;
      }

      if (bookModal) {
        bookModal.classList.add("active");
        bookModal.style.display = "flex";
        document.body.style.overflow = "hidden";
      }
      return;
    }

    // --- FLUXO C: FECHAR MODAIS NOS BOTÕES DE FECHAR (X) ---
    if (
      event.target.id === "close-modal" ||
      event.target.id === "close-comm-modal" ||
      event.target.classList.contains("comm-close-btn") ||
      event.target.classList.contains("modal-close-btn")
    ) {
      closeAllModals();
    }

    // --- FLUXO D: FECHAR CLICANDO FORA DA JANELA (BACKGROUND OVERLAY) ---
    if (event.target === bookModal || event.target === commModal) {
      closeAllModals();
    }
  });

  // Atalho teclado (ESC) para fechar janelas ativas
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllModals();
  });

  // Função centralizada de fechamento
  function closeAllModals() {
    if (bookModal) {
      bookModal.classList.remove("active");
      bookModal.style.display = "none";
    }
    if (commModal) {
      commModal.classList.remove("active");
      commModal.style.display = "none";
    }
    document.body.style.overflow = "";
  }
});

// ==========================================================================
  // 7. MODAL DO SOBRE (Botão SAIBA MAIS da about.html)
  // ==========================================================================

// Captura dos elementos do Modal
const modalBookway = document.getElementById("meu-modal");
const btnSaibaMais = document.getElementById("btn-saiba-mais");
const btnFecharModal = document.querySelector(".fechar-modal");


btnSaibaMais.onclick = function(e) {
  e.preventDefault();
  modalBookway.style.display = "flex";
}

// Fechar o modal ao clicar no 'X'
btnFecharModal.onclick = function() {
  modalBookway.style.display = "none";
}

// Fechar o modal caso clique fora da caixinha azul central
window.onclick = function(event) {
  if (event.target === modalBookway) {
    modalBookway.style.display = "none";
  }
}

// ==========================================================================
// MÓDULO: GERENCIADOR DE DESAFIOS (CHALLENGE DASHBOARD)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Verifica se os elementos existem na página atual (para não dar erro em outras telas)
  const elCreateForm = document.getElementById("createForm");
  if (!elCreateForm) return;

  // Configurações e Estado
  const PALETTE = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
  ];
  const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const MONTHS = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  let appData = { challenges: [], completions: {} };
  let currentSelectedId = null;
  let todayDate = new Date();
  let displayMonth = todayDate.getMonth();
  let displayYear = todayDate.getFullYear();

  // Elementos do DOM
  const elColorPicker = document.getElementById("colorPicker");
  const elChallengeColor = document.getElementById("challengeColor");
  const elChallengesList = document.getElementById("challengesList");
  const elCalendarGrid = document.getElementById("calendarGrid");
  const elMonthTitle = document.getElementById("monthTitle");
  const elToastContainer = document.getElementById("toastContainer");

  // Inicialização
  loadData();
  setupColorPicker();
  setupEventListeners();
  renderAll();

  // Utilitários
  function loadData() {
    const saved = localStorage.getItem("bookwayChallengeData");
    if (saved) {
      appData = JSON.parse(saved);
    } else {
      generateDummyData();
    }
    if (appData.challenges.length > 0 && !currentSelectedId) {
      currentSelectedId = appData.challenges[0].id;
    }
  }

  function saveData() {
    localStorage.setItem("bookwayChallengeData", JSON.stringify(appData));
  }

  function generateDummyData() {
    const id1 = Date.now().toString();
    const id2 = (Date.now() + 1).toString();
    appData.challenges = [
      {
        id: id1,
        name: "Leitura de Ficção",
        meta: "Ler 15 páginas",
        color: PALETTE[5],
      },
      {
        id: id2,
        name: "Estudo Técnico",
        meta: "1 Pomodoro (25m)",
        color: PALETTE[4],
      },
    ];
    let d = new Date();
    for (let i = 1; i <= 6; i++) {
      d.setDate(todayDate.getDate() - i);
      let dateStr = formatDate(d);
      appData.completions[dateStr] = [id1];
      if (i % 2 === 0) appData.completions[dateStr].push(id2);
    }
    saveData();
  }

  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function isCompleted(challengeId, dateStr) {
    return (
      appData.completions[dateStr] &&
      appData.completions[dateStr].includes(challengeId)
    );
  }

  function calculateStats(challengeId) {
    if (!challengeId || appData.challenges.length === 0)
      return { streak: 0, totalMonth: 0, rate: 0 };

    let streak = 0,
      totalMonth = 0,
      possibleDays = 0;
    let checkDate = new Date();

    // Calcular Streak
    if (!isCompleted(challengeId, formatDate(checkDate)))
      checkDate.setDate(checkDate.getDate() - 1);
    while (isCompleted(challengeId, formatDate(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calcular Mês
    let d = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    while (d <= todayDate) {
      possibleDays++;
      if (isCompleted(challengeId, formatDate(d))) totalMonth++;
      d.setDate(d.getDate() + 1);
    }
    let rate =
      possibleDays === 0 ? 0 : Math.round((totalMonth / possibleDays) * 100);
    return { streak, totalMonth, rate };
  }

  // Renderizações
  function renderAll() {
    renderChallengesList();
    renderStats();
    renderCalendar();
  }

  function renderChallengesList() {
    elChallengesList.innerHTML = "";
    if (appData.challenges.length === 0) {
      elChallengesList.innerHTML =
        '<div class="cd-empty-state">Comece criando o seu primeiro desafio! 🚀</div>';
      return;
    }
    appData.challenges.forEach((c) => {
      const isActive = c.id === currentSelectedId ? "active" : "";
      const html = `
                <div class="cd-challenge-item ${isActive}" data-id="${c.id}">
                    <div class="cd-challenge-color-dot" style="background-color: ${c.color}; color: ${c.color}"></div>
                    <div class="cd-challenge-info">
                        <div class="cd-challenge-name">${c.name}</div>
                        <div class="cd-challenge-meta">${c.meta}</div>
                    </div>
                    <button class="cd-delete-btn" data-action="delete" title="Excluir desafio">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            `;
      elChallengesList.insertAdjacentHTML("beforeend", html);
    });
  }

  function renderStats() {
    const stats = calculateStats(currentSelectedId);
    document.getElementById("statStreak").textContent = stats.streak;
    document.getElementById("statTotalMonth").textContent = stats.totalMonth;
    document.getElementById("statRate").textContent = `${stats.rate}%`;
  }

  function renderCalendar() {
    elMonthTitle.textContent = `${MONTHS[displayMonth]} ${displayYear}`;
    elCalendarGrid.innerHTML = "";
    WEEKDAYS.forEach((day) =>
      elCalendarGrid.insertAdjacentHTML(
        "beforeend",
        `<div class="cd-weekday">${day}</div>`,
      ),
    );

    const firstDayIndex = new Date(displayYear, displayMonth, 1).getDay();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

    for (let i = 1; i <= 42; i++) {
      const cell = document.createElement("div");
      cell.className = "cd-day-cell";

      if (i > firstDayIndex && i <= firstDayIndex + daysInMonth) {
        const dayNum = i - firstDayIndex;
        const dateStr = formatDate(new Date(displayYear, displayMonth, dayNum));
        cell.classList.add("cd-current-month");

        if (dateStr === formatDate(todayDate)) cell.classList.add("cd-today");

        if (dateStr > formatDate(todayDate)) {
          cell.classList.add("cd-future");
        } else {
          cell.classList.add("cd-past-or-today");
          cell.dataset.date = dateStr; // Guarda a data para o clique
        }

        cell.innerHTML = `<div class="cd-day-number">${dayNum}</div>`;

        // Renderiza bolinhas
        if (appData.completions[dateStr]) {
          const dotsContainer = document.createElement("div");
          dotsContainer.className = "cd-dots-container";
          appData.completions[dateStr].forEach((cId) => {
            const challenge = appData.challenges.find((c) => c.id === cId);
            if (challenge) {
              const dot = document.createElement("div");
              dot.className = "cd-completion-dot";
              dot.style.backgroundColor = challenge.color;
              dot.style.color = challenge.color; // Para o glow
              if (cId === currentSelectedId)
                dot.style.border = "2px solid white";
              dotsContainer.appendChild(dot);
            }
          });
          cell.appendChild(dotsContainer);
        }
      } else {
        cell.classList.add("cd-other-month");
      }
      elCalendarGrid.appendChild(cell);
    }
  }

  // Eventos e Ações
  function setupColorPicker() {
    elColorPicker.innerHTML = "";
    PALETTE.forEach((color, index) => {
      const div = document.createElement("div");
      div.className = `cd-color-option ${index === 0 ? "selected" : ""}`;
      div.style.backgroundColor = color;
      div.onclick = () => {
        document
          .querySelectorAll(".cd-color-option")
          .forEach((el) => el.classList.remove("selected"));
        div.classList.add("selected");
        elChallengeColor.value = color;
      };
      elColorPicker.appendChild(div);
    });
    elChallengeColor.value = PALETTE[0];
  }

  function setupEventListeners() {
    // Criar Desafio
    elCreateForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("challengeName").value.trim();
      const meta = document.getElementById("challengeMeta").value.trim();
      const color = elChallengeColor.value;

      if (!name || !meta) return;
      const newId = Date.now().toString();
      appData.challenges.push({ id: newId, name, meta, color });
      currentSelectedId = newId;
      saveData();

      elCreateForm.reset();
      setupColorPicker(); // Reseta as cores
      showToast("✅ Desafio adicionado com sucesso!");
      renderAll();
    };

    // Navegação Calendário
    document.getElementById("btnPrevMonth").onclick = () => {
      displayMonth--;
      if (displayMonth < 0) {
        displayMonth = 11;
        displayYear--;
      }
      renderCalendar();
    };
    document.getElementById("btnNextMonth").onclick = () => {
      displayMonth++;
      if (displayMonth > 11) {
        displayMonth = 0;
        displayYear++;
      }
      renderCalendar();
    };
    document.getElementById("btnHoje").onclick = () => {
      displayMonth = todayDate.getMonth();
      displayYear = todayDate.getFullYear();
      renderCalendar();
    };

    // DELEGAÇÃO DE EVENTOS: Lista de Desafios (Seleção e Lixeira)
    elChallengesList.addEventListener("click", (e) => {
      const deleteBtn = e.target.closest(".cd-delete-btn");
      const item = e.target.closest(".cd-challenge-item");

      if (deleteBtn && item) {
        e.stopPropagation();
        const id = item.dataset.id;
        if (
          confirm(
            "Tem certeza que deseja excluir este desafio e todo o seu progresso?",
          )
        ) {
          appData.challenges = appData.challenges.filter((c) => c.id !== id);
          for (let date in appData.completions) {
            appData.completions[date] = appData.completions[date].filter(
              (cId) => cId !== id,
            );
            if (appData.completions[date].length === 0)
              delete appData.completions[date];
          }
          if (currentSelectedId === id)
            currentSelectedId =
              appData.challenges.length > 0 ? appData.challenges[0].id : null;
          saveData();
          renderAll();
          showToast("🗑️ Desafio excluído.");
        }
        return;
      }

      if (item) {
        currentSelectedId = item.dataset.id;
        renderAll();
      }
    });

    // DELEGAÇÃO DE EVENTOS: Cliques no Calendário
    elCalendarGrid.addEventListener("click", (e) => {
      const cell = e.target.closest(".cd-past-or-today");
      if (!cell) return;

      const dateStr = cell.dataset.date;
      if (!currentSelectedId) {
        showToast("⚠️ Selecione um desafio na lista primeiro.");
        return;
      }

      if (!appData.completions[dateStr]) appData.completions[dateStr] = [];
      const index = appData.completions[dateStr].indexOf(currentSelectedId);
      const challengeName = appData.challenges.find(
        (c) => c.id === currentSelectedId,
      ).name;

      if (index > -1) {
        appData.completions[dateStr].splice(index, 1);
        if (appData.completions[dateStr].length === 0)
          delete appData.completions[dateStr];
        showToast(`Desmarcado: ${challengeName}`);
      } else {
        appData.completions[dateStr].push(currentSelectedId);
        showToast(`🚀 Concluído: ${challengeName}`);
      }
      saveData();
      renderAll();
    });
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "cd-toast";
    toast.innerHTML = `<span>${message}</span>`;
    elToastContainer.appendChild(toast);

    void toast.offsetWidth; // Force reflow
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
});
// ==========================================================================
// MÓDULO: REDIRECIONAMENTO PARA LEITURA (Botão LER do Modal)
// ==========================================================================
function irParaLeitura() {
  // 1. Captura os dados do modal através dos IDs corretos do seu home.html
  const capaLivro = document.getElementById("modal-cover-img");
  const tituloLivro = document.getElementById("modal-title");
  const autorLivro = document.getElementById("modal-author");
  const descLivro = document.getElementById("modal-description");

  if (!capaLivro || !tituloLivro) {
    console.error("Erro: Elementos do modal não encontrados.");
    return;
  }

  // 2. Limpa os espaços invisíveis com .trim() e guarda as informações
  const dadosDoLivro = {
    capa: capaLivro.src,
    titulo: tituloLivro.textContent.trim(),
    autor: autorLivro.textContent.trim(),
    descricao: descLivro.textContent.trim(),
  };

  // 3. Guarda no navegador
  localStorage.setItem("livroAtual", JSON.stringify(dadosDoLivro));

  // 4. Vai para a página do livro
  window.location.href = "livro.html";
}

// ==========================================================================
// MÓDULO: PÁGINA DE LEITURA (Só executa no livro.html para não bugar a Home)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("area-de-leitura")) {
    function atualizarRelogio() {
      const agora = new Date();
      const horas = String(agora.getHours()).padStart(2, "0");
      const minutos = String(agora.getMinutes()).padStart(2, "0");
      const relogioEl = document.getElementById("relogio");
      if (relogioEl) relogioEl.textContent = `${horas}:${minutos}`;
    }
    setInterval(atualizarRelogio, 1000);
    atualizarRelogio();

    const dadosSalvos = localStorage.getItem("livroAtual");

    if (dadosSalvos) {
      const livro = JSON.parse(dadosSalvos);
      document.getElementById("topo-titulo-livro").textContent = livro.titulo;
      carregarHistoria(livro.titulo);
    } else {
      document.getElementById("capitulo-titulo").textContent =
        "Biblioteca Vazia";
      document.getElementById("texto-da-historia").innerHTML =
        "<p>Nenhuma obra selecionada. Por favor, volte ao catálogo.</p>";
    }
  }
});

// ==========================================================================
// MÓDULO: SIMULAÇÃO DAS HISTÓRIAS
// ==========================================================================
function carregarHistoria(titulo) {
  // Garante que o título não tem espaços extra que dão erro
  titulo = titulo.trim();

  const tituloCapitulo = document.getElementById("capitulo-titulo");
  const conteudoHistoria = document.getElementById("texto-da-historia");

  if (titulo === "Demon Slayer - Vol. 1") {
    tituloCapitulo.textContent = "Capítulo 1: Crueldade";
    conteudoHistoria.innerHTML = `
            <p>Era um dia incrivelmente frio. A neve caía pesada, cobrindo as montanhas com um manto branco e silencioso. Tanjiro Kamado, o filho mais velho da sua família, descia a trilha íngreme carregando um cesto de carvão às costas. A sua respiração formava pequenas nuvens de vapor no ar gelado.</p>
            <p>A vida não era fácil desde que o seu pai faleceu, mas eles eram felizes. Vender carvão na vila era a única forma de garantir que os seus irmãos e a sua mãe teriam o que comer no Ano Novo.</p>
            <p>No entanto, a montanha guardava segredos cruéis. Ao regressar no dia seguinte, o cheiro de sangue invadiu as suas narinas. O destino da sua família havia sido selado por uma força maligna e implacável.</p>
            <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
        `;
  } else if (titulo === "The promised neverland vol. 1") {
    tituloCapitulo.textContent = "Capítulo 1: Grace Field House";
    conteudoHistoria.innerHTML = `
            <p>A Grace Field House é um orfanato idílico. Rodeados por uma floresta verdejante e cuidados pela carinhosa "Mãe", Emma, Norman e Ray vivem uma infância que parece perfeita.</p>
            <p>Tudo muda na noite em que a pequena Conny é adotada. Ao esquecer o seu coelhinho de peluche favorito, Emma e Norman correm em direção ao portão proibido para lho devolver. O que encontram lá não é a esperança de uma nova família, mas sim um segredo sombrio que destroça o seu mundo para sempre.</p>
            <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
        `;
  } else if (titulo === "Hunter X Hunter - Vol. 1") {
    tituloCapitulo.textContent = "Capítulo 1: O Dia da Partida";
    conteudoHistoria.innerHTML = `
            <p>A Ilha da Baleia é um lugar pacato, abençoado pela natureza, mas o coração do jovem Gon Freecss anseia por algo além daquelas florestas densas. Com a sua velha cana de pesca em mãos, Gon acaba de conseguir o impossível: capturar o lendário Mestre do Pântano.</p>
            <p>"Porque queres tanto ser um Hunter, Gon?", perguntam-lhe. A resposta é simples e cheia de inocência. O seu pai, Ging, abandonou-o para seguir essa mesma profissão. A jornada lendária está prestes a começar.</p>
            <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
        `;
  } else if (titulo === "Frieren e a Jornada Para o Além - 02") {
    tituloCapitulo.textContent = "Capítulo 8: Cem Anos";
    conteudoHistoria.innerHTML = `
            <p>A passagem do tempo é uma mera abstração para a elfa Frieren. Oitenta anos podem parecer um piscar de olhos para uma feiticeira que vive há milénios, mas para os humanos, é o ciclo completo de uma vida inteira.</p>
            <p>Nesta continuação da sua jornada rumo a Aureole, o paraíso onde as almas descansam, Frieren já não viaja sozinha. Ao seu lado caminha Fern, a jovem prodígio e sua pupila, e Stark, o guerreiro que treme de medo mas que esconde uma força formidável.</p>
            <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
        `;
  } else if (titulo === "Attack on Titan Sampler (English Edition)") {
    tituloCapitulo.textContent = "Capítulo 1: Para Ti, Dois Mil Anos no Futuro";
    conteudoHistoria.innerHTML = `
            <p>Durante mais de um século, a humanidade viveu numa paz frágil, protegida dentro de três imensas muralhas concêntricas: Maria, Rose e Sina. Do lado de fora, monstros gigantes e irracionais conhecidos como Titãs devoram humanos sem motivo aparente.</p>
            <p>Mas naquele dia fatídico, a ilusão de segurança despedaçou-se. Um estrondo ensurdecedor rasgou os céus, e uma mão avermelhada e em carne viva agarrou o topo da Muralha Maria. O Titã Colossal apareceu. A humanidade lembrou-se do terror, e o pesadelo de Eren apenas começou.</p>
            <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
        `;
  } else if (titulo === "Death Note - Black Edition - Volume 1") {
    tituloCapitulo.textContent = "Capítulo 1: Tédio";
    conteudoHistoria.innerHTML = `
            <p>O mundo está a apodrecer. Nas entrelinhas das notícias, nos becos da cidade e nos corredores da escola, a criminalidade e a injustiça correm soltas. Light Yagami, o estudante mais brilhante do Japão, observa a sociedade com um cinismo profundo.</p>
            <p>Até que, num dia banal, um caderno de aspeto sinistro cai do céu no pátio do colégio. A capa negra não contém nada além de duas palavras em letras brancas: <strong>Death Note</strong>. Assim, nasce Kira, o deus de um novo mundo.</p>
            <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
        `;
  } else if (titulo === "Dandadan 01") {
    tituloCapitulo.textContent = "Capítulo 1: É o Começo do Amor, não é?";
    conteudoHistoria.innerHTML = `
            <p>Momo Ayase é uma rapariga determinada que vem de uma longa linhagem de médiuns e acredita firmemente na existência de fantasmas. Ken Takakura, que Momo apelidou de "Okarun", é o típico nerd obcecado por revistas de ocultismo e acredita apenas em alienígenas.</p>
            <p>O que começou com uma discussão trivial nos corredores da escola rapidamente se transforma numa aposta de orgulho. O que nenhum deles esperava era estarem ambos assustadoramente certos.</p>
            <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
        `;
  } else if (titulo === "Your name") {
    tituloCapitulo.textContent = "Prólogo: Fios do Destino";
    conteudoHistoria.innerHTML = `
            <p>Mitsuha Miyamizu vive na pacata vila de Itomori. Farta das tradições religiosas da sua família e da vida entediante no campo, ela grita aos céus o seu maior desejo: <em>"Na minha próxima vida, por favor, faz de mim um rapaz bonito de Tóquio!"</em></p>
            <p>Certa manhã, ambos acordam com a estranha sensação de que algo não está certo. Mitsuha vê o reflexo de um rapaz no espelho. Taki acorda num quarto que não reconhece. Sem explicação aparente, eles começam a trocar de corpos aleatoriamente durante o sono.</p>
            <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
        `;
  } else if (
    titulo === "Jojo's bizarre adventure – Parte 7 – Steel ball run 01"
  ) {
    tituloCapitulo.textContent = "Capítulo 1: A Conferência de Imprensa";
    conteudoHistoria.innerHTML = `
            <p>O ano é 1890, na ensolarada praia de San Diego Beach, Califórnia. Mais de três mil participantes oriundos de todo o mundo reúnem-se para o evento mais louco e ambicioso da história da humanidade: a corrida Steel Ball Run.</p>
            <p>O destino de Johnny muda drasticamente quando os seus olhos se cruzam com os de Gyro Zeppeli, um participante excêntrico oriundo do Reino de Nápoles. Gyro não carrega armas normais, mas sim duas misteriosas esferas de aço rotativas.</p>
            <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
        `;
  } else if (titulo === "Hellsing Especial Vol. 01: 1") {
    tituloCapitulo.textContent = "Capítulo 1: Vampire Hunter";
    conteudoHistoria.innerHTML = `
            <p>A escuridão de Londres abriga aberrações que as pessoas comuns não conseguem sequer imaginar. Mas contra as trevas que se erguem, há um escudo de prata: a Ordem Real dos Cavaleiros Protestantes.</p>
            <p>Com um sorriso sádico desenhado no rosto e empunhando duas armas de calibre monstruoso, ele é a arma secreta da família Hellsing. O próprio Rei dos Mortos-Vivos: Alucard.</p>
            <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
        `;
  } else if (titulo === "Batman Begins") {
    tituloCapitulo.textContent = "Capítulo 1: O Medo Primordial";
    conteudoHistoria.innerHTML = `
        <p>O ar frio da caverna subia pelas narinas do jovem Bruce enquanto ele jazia no fundo do poço, com a perna latejando de dor. Foi então que o som começou, um farfalhar agudo que ecoava pelas paredes de pedra, até que uma nuvem negra de morcegos irrompeu da escuridão, engolindo-o em um turbilhão de asas e pânico.</p>
        <p>Esse medo primordial ficaria gravado em sua alma, muito antes da noite fatídica no beco que roubaria seus pais e mudaria sua vida para sempre.</p>
        <p>Anos de exílio e dor culminariam mais tarde em uma busca incessante por justiça, moldando seu corpo e sua mente em uma arma perfeita para enfrentar a podridão que consumia Gotham City.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "Dom Quixote") {
    tituloCapitulo.textContent = "Capítulo 1: A Loucura do Fidalgo";
    conteudoHistoria.innerHTML = `
        <p>De tanto ler dia e noite, o cérebro do fidalgo secou por completo, perdendo ele totalmente o juízo. Imerso em fantasias de batalhas sangrentas, feitiçarias e resgates de donzelas, decidiu que era necessário, para o aumento de sua honra e o serviço de sua república, tornar-se um cavaleiro andante.</p>
        <p>Limpou as armas enferrujadas de seus bisavós, deu ao seu pangaré magro o altivo nome de Rocinante e batizou a si mesmo como Dom Quixote, pronto para varrer as injustiças da face da terra.</p>
        <p>Montado em sua ilusão, ele não via o mundo como era, mas sim através do filtro mágico de sua loucura heroica, enxergando castelos onde havia estalagens e gigantes onde havia apenas moinhos de vento.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "Duna") {
    tituloCapitulo.textContent = "Capítulo 1: A Chegada em Arrakis";
    conteudoHistoria.innerHTML = `
        <p>A atmosfera densa de Caladan ficou para trás enquanto as naves da Casa Atreides rasgavam o espaço em direção a Arrakis, o planeta desértico onde a água era mais valiosa que sangue.</p>
        <p>Paul sentia a gravidade política da mudança. O Imperador havia lhes entregado a concessão da melange, a especiaria que expandia a consciência e movia o universo, mas todos sabiam que era uma armadilha meticulosamente armada.</p>
        <p>Sob o sol escaldante de Duna, a traição dos Harkonnen espreitava em cada sombra do palácio em Arrakeen, aguardando o momento certo para banhar as areias ardentes com o sangue dos recém-chegados.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "Hobbit") {
    tituloCapitulo.textContent = "Capítulo 1: Uma Festa Inesperada";
    conteudoHistoria.innerHTML = `
        <p>Bilbo Bolseiro fumava tranquilamente seu cachimbo na porta de sua toca quando o mago Gandalf apareceu, quebrando a paz perfeita do Condado. O que se seguiu foi uma noite de caos crescente, com a campainha tocando repetidas vezes.</p>
        <p>Anões carrancudos invadiram sua despensa. Enquanto eles devoravam seus queijos e esvaziavam seus barris de cerveja, cantavam canções antigas sobre montanhas frias e ouro esquecido.</p>
        <p>Relutante e assustado, o pequeno hobbit percebeu que sua vida pacata estava prestes a ser devorada por uma aventura formidável, muito além das fronteiras confortáveis de seu lar na colina.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "Memorias do Subsolo") {
    tituloCapitulo.textContent = "Capítulo 1: O Homem Doente";
    conteudoHistoria.innerHTML = `
        <p>Sou um homem doente. Sou um homem mau. Um homem repulsivo. Aposentado de meu cargo insignificante, refugio-me em meu canto obscuro em São Petersburgo, nutrindo um rancor profundo contra o mundo.</p>
        <p>As pessoas normais, de nervos fortes, agem guiadas pela lógica e pelo benefício próprio, marchando confiantemente contra o muro da impossibilidade. Eu, no entanto, tenho consciência demais; e essa hiperconsciência é uma doença terrível.</p>
        <p>Ela me impede de agir, me obriga a chafurdar na lama de minha própria inércia e a extrair um prazer perverso da minha própria degradação e do sofrimento voluntário nas sombras do meu subsolo.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "Monte Cristo") {
    tituloCapitulo.textContent = "Capítulo 1: O Prisioneiro do Castelo de If";
    conteudoHistoria.innerHTML = `
        <p>A úmida e gélida escuridão do Castelo de If tornou-se o mundo inteiro do jovem marinheiro Edmond Dantès. Arrancado de seu casamento no dia de suas núpcias por uma falsa denúncia de traição política, ele não entendia as forças obscuras que o haviam condenado.</p>
        <p>Os dias se transformaram em meses e os meses em anos tortuosos. O desespero arranhou as paredes de pedra até a exaustão de seus dedos, e a esperança cedeu lugar a um silêncio sepulcral.</p>
        <p>Até que o som rítmico de arranhões na parede contígua despertou Dantès de seu torpor. A escavação que deveria levar à liberdade o colocou frente a frente com o Abade Faria, mudando o rumo de sua tragédia para uma implacável história de vingança.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "Os Miseraveis") {
    tituloCapitulo.textContent = "Capítulo 1: A Quebra da Condicional";
    conteudoHistoria.innerHTML = `
        <p>O bispo de Digne dormia placidamente quando Jean Valjean, o ex-forçado marcado pela sociedade, empunhou a barra de ferro sobre sua cama. Ele havia recebido abrigo e comida, mas o instinto de sobrevivência gritou mais alto.</p>
        <p>Movido pelo rancor de dezenove anos de trabalhos forçados, ele roubou a prataria de prata. Quando os guardas o capturaram na manhã seguinte, o improvável aconteceu: o bispo não apenas o inocentou, mas lhe entregou também os castiçais.</p>
        <p>Com palavras serenas, o religioso declarou que comprava a alma de Valjean das trevas e a entregava a Deus, cravando uma dor dilacerante de arrependimento no coração do ex-prisioneiro e selando sua dolorosa conversão.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "Resident Evil") {
    tituloCapitulo.textContent = "Capítulo 1: O Incidente da Mansão";
    conteudoHistoria.innerHTML = `
        <p>As montanhas Arklay estavam encobertas pela escuridão quando a equipe S.T.A.R.S. buscou refúgio na isolada e imponente Mansão Spencer. O que parecia ser um resgate seguro rapidamente se transformou em um pesadelo absoluto.</p>
        <p>Portas trancadas por enigmas bizarros, cães mutantes estilhaçando janelas e cadáveres reanimados arrastando-se pelos corredores ricamente decorados forçaram os agentes sobreviventes a lutarem por suas vidas.</p>
        <p>A cada poça de sangue e documento manchado encontrado, revelavam-se os experimentos ilegais do letal T-Vírus, manchando as mãos da toda-poderosa Umbrella Corporation e iniciando um inferno biológico sem precedentes.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "Scott Pilgrim") {
    tituloCapitulo.textContent = "Capítulo 1: A Garota do Cabelo Colorido";
    conteudoHistoria.innerHTML = `
        <p>A vida de Scott seguia em um ritmo apático de ensaios na garagem e videogames antigos, dividindo um colchão no chão de um apartamento minúsculo em Toronto.</p>
        <p>Tudo mudou no momento em que ele a viu na festa: a entregadora misteriosa de patins, com cabelo de cores vibrantes e um ar de tédio insuperável, Ramona Flowers. A obsessão instantânea do garoto fez com que ele começasse a encomendar pacotes apenas para tê-la na porta.</p>
        <p>Ele estava completamente alheio à bagagem caótica e perigosa que a garota trazia. O que ele achava ser um simples flerte o jogaria de cabeça em uma guerra absurda contra a infame Liga dos Sete Ex-Namorados do Mal.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "SpiderMan") {
    tituloCapitulo.textContent = "Capítulo 1: O Acidente Radioativo";
    conteudoHistoria.innerHTML = `
        <p>A excursão escolar para os laboratórios de ciências prosseguia tediosamente para o brilhante e deslocado adolescente Peter Parker. Enquanto o cientista demonstrava os efeitos da radiação, algo pequeno desceu do teto.</p>
        <p>Uma aranha banhada nos feixes de energia caiu despercebida sobre a mão do jovem, cravando as presas radioativas. A picada trouxe febre e tontura, o obrigando a voltar para casa cambaleando.</p>
        <p>No dia seguinte, a fraqueza física de Peter fora substituída por uma força absurda, reflexos ultrarrápidos e a habilidade surreal de aderir às paredes, deixando o estudante chocado com a magnitude do seu próprio corpo transformado e o destino heróico que o aguardava.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "Vidas Secas") {
    tituloCapitulo.textContent = "Capítulo 1: A Fuga Pela Sobrevivência";
    conteudoHistoria.innerHTML = `
        <p>A caatinga era uma extensão infinita de galhos retorcidos, terra rachada e calor sufocante que embaçava o horizonte sob um sol de chumbo. A família arrastava-se lentamente pelo chão ardente.</p>
        <p>Os ombros curvados de Fabiano sob a carga parca, Sinhá Vitória segurando firmemente o baú de folha-de-flandres, e os dois meninos choramingando de fome, com as barrigas inchadas. Atrás deles, com a língua de fora, a cachorrinha Baleia acompanhava os passos arrastados.</p>
        <p>Estavam todos unidos em um mutismo de sofrimento instintivo na tentativa desesperada de encontrar sombra ou um poço que ainda resistisse à seca implacável que os castigava sem piedade.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "X-Men") {
    tituloCapitulo.textContent = "Capítulo 1: Filhos do Átomo";
    conteudoHistoria.innerHTML = `
        <p>Os corredores espaçosos e bem iluminados da luxuosa propriedade em Westchester contrastavam com o medo e a confusão que os jovens abrigavam dentro de si.</p>
        <p>Afastados da sociedade que os via como aberrações, adolescentes que podiam congelar o ar, disparar rajadas óticas avassaladoras ou mover objetos com o poder da mente aprenderam a controlar os dons imprevisíveis na temível e futurista Sala de Perigo.</p>
        <p>Sob a tutela do calmo e telepático professor, esse punhado de excluídos formou uma equipe paramilitar secreta, forjando uma irmandade que jurou proteger o mesmo mundo que exigia sua aniquilação incondicional.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else if (titulo === "The Walking Dead") {
    tituloCapitulo.textContent = "Capítulo 1: O Despertar";
    conteudoHistoria.innerHTML = `
        <p>A luz fria do sol filtrava-se pelas persianas quebradas do leito de enfermaria, iluminando as flores mortas ao lado da cama. O policial Rick Grimes despertou do coma tossindo pelo ar viciado, arrancando os soros ressecados dos braços.</p>
        <p>Ao caminhar cambaleante pelo corredor iluminado de emergência, encontrou não médicos apressados, mas poças de sangue enegrecido e portas barradas com mensagens aterrorizantes rabiscadas à pressa.</p>
        <p>O silêncio da cidade destruída foi quebrado pelo gemido gorgolejante da metade apodrecida de uma mulher no chão, confirmando brutalmente que o mundo que ele conhecia e servia estava definitivamente morto e devorado.</p>
        <br><br><p style="text-align: center; color: #3b82f6; font-size: 16px;">Fim da Demonstração</p>
    `;
  } else {
    tituloCapitulo.textContent = titulo;
    conteudoHistoria.innerHTML = `
            <p>O conteúdo de <strong>${titulo}</strong> está a ser preparado e digitalizado na nossa base de dados.</p>
        `;
  }
}
// ==========================================================================
// MÓDULO: SISTEMA AVANÇADO DE LEITURA (Paginação e Fonte)
// ==========================================================================

let paginaAtual = 0;
let tamanhoFonte = 20; // Tamanho inicial da fonte em pixels
let paginasDaObraAtual = [];

// Base de Dados Otimizada (Cada array representa as 4 páginas da obra)
const bdObras = {
  "Demon Slayer - Vol. 1": [
    "<p>Era um dia incrivelmente frio. A neve caía pesada, cobrindo as montanhas com um manto branco e silencioso. Tanjiro Kamado, o filho mais velho da sua família, descia a trilha íngreme carregando um cesto de carvão às costas. A sua respiração formava pequenas nuvens de vapor no ar gelado, contrastando com o calor do seu esforço.</p>",
    "<p>A vida não era fácil desde que o seu pai faleceu, mas eles eram felizes. Vender carvão na vila era a única forma de garantir que os seus irmãos e a sua mãe teriam o que comer no Ano Novo. Ele caminhava com propósito, pensando no sorriso dos irmãos quando regressasse com comida farta.</p>",
    "<p>No entanto, a montanha guardava segredos cruéis. Ao regressar na manhã seguinte, o cheiro metálico de sangue invadiu as suas narinas apuradas. Um instinto primitivo de pavor tomou conta do seu corpo, paralisando-o por uma fração de segundo antes da adrenalina explodir.</p>",
    "<p>Ele correu, ignorando o cansaço e a neve grossa, apenas para encontrar a pior cena da sua vida. A porta da sua casa estava arrombada e tingida de vermelho. O destino da sua família havia sido selado por uma força maligna e implacável. Ali, no sangue e na neve, morria o menino gentil e nascia o caçador.</p>",
  ],
  "The promised neverland vol. 1": [
    "<p>A Grace Field House é um orfanato idílico, isolado do mundo exterior. Rodeados por uma floresta verdejante e cuidados pela carinhosa mulher que todos chamam de 'Mãe', Emma, Norman e Ray vivem uma infância que parece roçar a perfeição absoluta.</p>",
    "<p>A comida é deliciosa, as camas são brancas e quentes, e os testes diários, por mais rigorosos que sejam, apenas servem para desafiar as suas mentes brilhantes. As crianças brincam alegremente pelos vastos campos, rindo e correndo sem preocupações reais.</p>",
    "<p>No entanto, há uma regra absoluta que todos devem seguir rigorosamente: nunca, sob circunstância alguma, se devem aproximar do portão principal ou da vedação que delimita a floresta. 'É perigoso lá fora', repetia a Mãe, com um sorriso gentil mas firme.</p>",
    "<p>Tudo muda na noite em que a pequena Conny é adotada. Ao esquecer o seu coelhinho de peluche, Emma e Norman correm em direção ao portão proibido para o devolver. O que encontram na traseira do camião não é o início de uma vida feliz, mas um cadáver pálido e a verdade aterradora: eles não são órfãos, são gado.</p>",
  ],
  "Hunter X Hunter - Vol. 1": [
    "<p>A Ilha da Baleia é um lugar pacato, abençoado por uma natureza intocada e luxuriante. Mas o coração do jovem Gon Freecss anseia por algo muito além daquelas florestas densas. Com a sua velha cana de pesca em mãos, um legado do pai ausente, Gon concentra-se na sua missão.</p>",
    "<p>Num único movimento fluido, ele acaba de conseguir o impossível: capturar o lendário Mestre do Pântano, um peixe gigante que cinco homens adultos não conseguiriam puxar. Foi o culminar de uma promessa feita à sua tia Mito, a mulher que o criou como filho.</p>",
    "<p>'Se eu o pescar, deixas-me fazer o Exame Hunter, certo?' A promessa era clara, e a vitória de Gon deixou a sua tia sem argumentos, embora o coração dela apertasse de angústia. Ela conhecia bem os perigos desse caminho implacável.</p>",
    "<p>'Porque queres tanto ser um Hunter, Gon?' perguntavam os aldeões. A resposta dele era cheia de inocência e determinação brutal: ele queria descobrir o quão incrível devia ser a profissão de Hunter para fazer o seu pai, Ging, abandonar o próprio filho. E assim, o barco zarpou.</p>",
  ],
  "Frieren e a Jornada Para o Além - 02": [
    "<p>A passagem do tempo é uma mera abstração para a elfa Frieren. Oitenta anos podem parecer um piscar de olhos fugaz para uma feiticeira que vive há milénios, mas para os humanos, esse mesmo tempo representa o ciclo completo de uma vida, do berço à sepultura.</p>",
    "<p>Nesta continuação da sua nova jornada rumo a Aureole, o paraíso onde dizem que as almas descansam, Frieren já não viaja na solidão absoluta. Ao seu lado caminha Fern, a jovem prodígio mágica de humor estoico, e Stark, o guerreiro que treme de medo mas recusa recuar.</p>",
    "<p>Enquanto percorrem os antigos caminhos de terra outrora trilhados pelo saudoso herói Himmel e pelo seu antigo grupo, Frieren é constantemente confrontada com o peso das memórias. Cada estátua envelhecida pelo vento e chuva conta uma história.</p>",
    "<p>Cada vila que mudou com as décadas ensina à elfa apática o verdadeiro valor dos pequenos momentos. Ela chora não por estar triste, mas por perceber, demasiado tarde, que não dedicou tempo suficiente para conhecer as pessoas maravilhosas que amou no passado.</p>",
  ],
  "Attack on Titan Sampler (English Edition)": [
    "<p>Durante mais de um século, a humanidade viveu numa paz frágil e claustrofóbica, protegida dentro de três imensas muralhas concêntricas: Maria, Rose e Sina. Do lado de fora, abominações gigantescas conhecidas como Titãs vagueiam, devorando humanos sem piedade.</p>",
    "<p>Eren Yeager, um jovem impulsivo e revoltado do Distrito de Shiganshina, olha para os imponentes muros de pedra de 50 metros com amargura. Enquanto os adultos festejam na ignorância, ele vê as muralhas não como um escudo, mas como a cerca de um curral onde aguardam o abate.</p>",
    "<p>Mas naquele dia fatídico, a ilusão de segurança despedaçou-se num piscar de olhos. Um estrondo ensurdecedor e um raio dourado rasgaram os céus límpidos. Uma mão avermelhada, desprovida de pele e a fumegar, agarrou o topo da Muralha Maria.</p>",
    "<p>O Titã Colossal espreitou por cima da borda da humanidade. Com um único pontapé apocalíptico, os portões de pedra sólida foram transformados em poeira e destroços. Os Titãs menores invadiram a cidade. A humanidade lembrou-se do terror, e o pesadelo de Eren começou.</p>",
  ],
  "Death Note - Black Edition - Volume 1": [
    "<p>O mundo está a apodrecer em câmara lenta. Nas entrelinhas das notícias noturnas, nos becos da cidade e nos corredores sussurrantes da escola, a criminalidade e a injustiça correm soltas. Light Yagami, o estudante mais genial do Japão, observa tudo com um tédio incurável.</p>",
    "<p>Até que, num dia cinzento e banal, algo cai dos céus diretamente para o pátio imaculado do colégio. Um caderno de aspeto sinistro, com capa negra e textura estranha, repousando na relva. Na capa, letras brancas formam duas palavras: Death Note.</p>",
    "<p>Ao abrir as páginas, as regras no interior afirmam o impossível: 'O humano cujo nome for escrito neste caderno morrerá'. Inicialmente, Light solta um riso desdenhoso, julgando tratar-se de uma elaborada e macabra piada de mau gosto, uma corrente de mensagens física.</p>",
    "<p>Contudo, movido por uma curiosidade doentia e arrogância, testa o caderno num criminoso que fazia reféns em direto na televisão. Exatos quarenta segundos depois, a vítima sofre um colapso cardíaco. Com as mãos trémulas e a mente a fervilhar, Light aceita a sua coroa: ele será o Deus de um novo mundo.</p>",
  ],
  "Dandadan 01": [
    "<p>Momo Ayase é uma rapariga determinada, de sangue quente, que vem de uma longa linhagem de médiuns espirituais e acredita fervorosamente na existência de fantasmas. Ken Takakura, que Momo apelidou de 'Okarun', é o extremo oposto no espetro das bizarrices.</p>",
    "<p>Okarun é o típico nerd antissocial, obcecado por revistas antigas de ocultismo e conspirações governamentais. Ele acredita piamente em alienígenas, mas nega categoricamente a existência de espíritos ou assombrações. Dois crentes fervorosos em lados opostos.</p>",
    "<p>O que começou com uma discussão trivial nos corredores aborrecidos da escola rapidamente se transforma numa aposta envolvendo o próprio orgulho. Para provarem a supremacia das suas crenças, decidem visitar em simultâneo os locais mais assustadores da província.</p>",
    "<p>Momo vai a um hospital abandonado para ver OVNIs, e Okarun a um túnel escuro famoso por possessões. O que nenhum deles esperava era que ambos estivessem assustadoramente corretos. Okarun é amaldiçoado pela 'Turbo Granny', e Momo é abduzida por Serpoianos. A loucura colide.</p>",
  ],
  "Your name": [
    "<p>Mitsuha Miyamizu vive presa na pacata e tradicional vila de Itomori. Farta das complexas tradições xintoístas da sua família, de tecer cordas rituais e da vida entediante no campo, ela vira o rosto para o céu estrelado e grita com todas as suas forças o seu maior desejo.</p>",
    "<p>'Na minha próxima vida, por favor, faz de mim um rapaz bonito a viver no centro de Tóquio!' O eco perde-se nas montanhas, mas o universo, de alguma forma inescrutável, decide ouvir o clamor de uma adolescente entediada.</p>",
    "<p>A centenas de quilómetros dali, na metrópole frenética, de vidro e aço, o estudante Taki Tachibana divide o seu tempo exaustivo entre o gosto pela arquitetura e o seu part-time servindo pratos num requintado restaurante italiano.</p>",
    "<p>Certa manhã, a realidade de ambos fratura-se. Mitsuha acorda e vê o reflexo de um rapaz no espelho da casa de banho. Taki abre os olhos num quarto que cheira a madeira envelhecida. Sem aviso, começam a trocar de corpos aleatoriamente, entrelaçando os seus destinos através da passagem iminente de um cometa.</p>",
  ],
  "Jojo's bizarre adventure – Parte 7 – Steel ball run 01": [
    "<p>O ano é 1890, e a brisa do oceano sopra forte na ensolarada praia de San Diego Beach, Califórnia. O clima é de pura histeria festiva. Mais de três mil cavaleiros de todo o globo estão reunidos para a corrida mais ambiciosa e mortífera da história humana.</p>",
    "<p>O objetivo é brutal: atravessar todo o continente implacável da América do Norte a cavalo, cruzando desertos, florestas e montanhas geladas até Nova Iorque. O prémio que aguarda o vencedor são impressionantes 50 milhões de dólares patrocinados pela fundação Speedwagon.</p>",
    "<p>Johnny Joestar, outrora um prodigioso génio da equitação que perdeu o uso das pernas num incidente de pura arrogância, encontra-se na berma, assistindo com um rancor silencioso à glória que deveria ser sua. Tudo muda quando um excêntrico italiano cruza o seu caminho.</p>",
    "<p>O seu nome é Gyro Zeppeli. Em vez de revólveres, carrega duas esferas de aço com estranhas ranhuras. Ao tocar acidentalmente na Esfera Rotativa de Gyro, o nervo morto da perna de Johnny contrai-se violentamente. Movido pela esperança impossível de voltar a andar, ele arrasta-se para as costas de um cavalo, entrando na Steel Ball Run.</p>",
  ],
  "Hellsing Especial Vol. 01: 1": [
    "<p>A espessa neblina e a escuridão de Londres abrigam aberrações e predadores noturnos que as pessoas comuns não conseguem sequer conceber nos seus piores pesadelos. Mas contra as trevas absolutas que se erguem dos esgotos, o Império Britânico possui um escudo forjado em prata.</p>",
    "<p>A Ordem Real dos Cavaleiros Protestantes, infamemente conhecida como a Organização Hellsing. Na sua liderança está Sir Integra Fairbrook Wingates Hellsing, uma mulher de gelo, fumando charutos com uma severidade inabalável enquanto coordena os abates.</p>",
    "<p>Quando a polícia militar é massacrada por um clérigo corrompido, agora um vampiro liderando um exército de ghouls numa pacata aldeia inglesa, o sangue banha as ruas de pedra. O chumbo normal das armas táticas mostra-se irrelevante contra criaturas do submundo.</p>",
    "<p>É então que Integra solta a trela do seu cão de caça. Trajando um longo casaco vermelho, sorriso maníaco e empunhando duas armas de calibre obsceno feitas sob medida, o próprio Rei dos Mortos-Vivos, Alucard, caminha para a batalha. E naquela noite infernal, a jovem agente policial Seras Victoria enfrentará a escolha final entre a morte e as sombras.</p>",
  ],
  "Batman Begins": [
    "<p>O ar frio da caverna subia pelas narinas do jovem Bruce enquanto ele jazia no fundo do poço, com a perna latejando de dor. Foi então que o som começou, um farfalhar agudo que ecoava pelas paredes de pedra, até que uma nuvem negra de morcegos irrompeu da escuridão, engolindo-o em um turbilhão de asas e pânico. Esse medo primordial ficaria gravado em sua alma, muito antes da noite fatídica no beco que roubaria seus pais e mudaria sua vida para sempre.</p>",
    "<p>Anos de exílio e dor culminaram em uma cela fétida no Butão, onde Bruce lutava contra ladrões apenas para entender a mente de um criminoso. Lá, Henri Ducard o encontrou e lhe ofereceu um propósito: a Liga das Sombras. O treinamento foi implacável, ensinando-o a suprimir a compaixão e a abraçar a teatralidade e a decepção. Nas montanhas geladas, Bruce aprendeu a lutar não apenas com os punhos, mas com a escuridão, moldando seu corpo e sua mente em uma arma perfeita.</p>",
    "<p>De volta a Gotham, a mansão de sua família parecia um mausoléu silencioso. Com a ajuda do leal Alfred e do engenhoso Lucius Fox, Bruce começou a forjar seu novo eu. O tecido de memória tomou a forma de asas cortantes, o veículo militar Tumbler tornou-se seu corcel blindado, e a caverna de seus pesadelos infantis foi transformada em seu santuário. Bruce Wayne seria a máscara; sua verdadeira identidade nascia agora, vestida de negro para aterrorizar os supersticiosos e covardes da cidade.</p>",
    "<p>O trem desgovernado avançava pelos trilhos elevados, carregando a máquina de micro-ondas capaz de vaporizar a água envenenada de Gotham. Dentro do vagão, Bruce enfrentava seu antigo mentor, agora revelado como o verdadeiro Ra's al Ghul. Em um choque de ideologias, Batman percebeu que não precisava ser um executor para vencer. Deixando o trem antes que este despencasse no caos e na destruição, ele provou que Gotham ainda podia ser salva através da justiça e do símbolo imortal do Cavaleiro das Trevas.</p>",
  ],
  "Dom Quixote": [
    "<p>De tanto ler dia e noite, o cérebro do fidalgo secou por completo, perdendo ele totalmente o juízo. Imerso em fantasias de batalhas sangrentas, feitiçarias e resgates de donzelas, decidiu que era necessário, para o aumento de sua honra e o serviço de sua república, tornar-se um cavaleiro andante. Limpou as armas enferrujadas de seus bisavós, deu ao seu pangaré magro o altivo nome de Rocinante e batizou a si mesmo como Dom Quixote, pronto para varrer as injustiças da face da terra.</p>",
    "<p>A poeira da estrada levantou-se quando Dom Quixote avistou trinta ou quarenta moinhos de vento espalhados pelo campo. Com os olhos brilhando de loucura heroica, apontou a lança e gritou para Sancho Pança que ali estavam gigantes monstruosos de braços imensos. Ignorando os avisos desesperados de seu escudeiro, esporeou Rocinante e arremeteu contra a primeira estrutura. A vela do moinho, impulsionada pelo vento, despedaçou a lança e arremessou cavalo e cavaleiro longe pelo campo, deixando Dom Quixote moído, mas convicto de que mágicos haviam alterado a realidade.</p>",
    "<p>Sob o sol inclemente da planície, mestre e escudeiro travavam longos e saborosos diálogos. Sancho Pança, montado em seu modesto asno, cobrava as promessas de ser governador de uma ilha, argumentando com uma sabedoria prática e provérbios rústicos. Dom Quixote, com a voz grave, discorria sobre a idade de ouro, a nobreza de espírito e a necessidade de suportar a fome e as intempéries em nome do ideal cavaleiresco, mostrando o abismo cômico e melancólico entre o sonho inalcançável e a realidade rasteira.</p>",
    "<p>Após sucessivas derrotas e o peso da idade abatendo seus ossos cansados, uma forte febre tomou conta de Alonso Quijano. Ao acordar de um longo sono, a névoa da loucura havia se dissipado completamente de sua mente. Com uma voz fraca, mas serena, ele renegou os romances de cavalaria, pediu perdão a Sancho por tê-lo arrastado em seus delírios e ditou seu testamento. Chorando ao redor de seu leito, seus amigos assistiram ao fim não do herói mítico, mas do homem bom que recuperou a sanidade apenas para morrer em paz.</p>",
  ],
  Duna: [
    "<p>A atmosfera densa de Caladan ficou para trás enquanto as naves da Casa Atreides rasgavam o espaço em direção a Arrakis, o planeta desértico onde a água era mais valiosa que sangue. Paul sentia a gravidade política da mudança. O Imperador havia lhes entregado a concessão da melange, a especiaria que expandia a consciência e movia o universo, mas todos sabiam que era uma armadilha. Sob o sol escaldante de Duna, a traição dos Harkonnen espreitava em cada sombra do palácio em Arrakeen.</p>",
    "<p>O ataque foi letal e silencioso. As defesas de Arrakeen caíram de dentro para fora pelas mãos de um traidor que ninguém poderia prever, o Dr. Yueh. Com o Duque Leto morto em um ato de sacrifício inútil, Paul e sua mãe, Jessica, viram-se obrigados a fugir para a vastidão brutal do deserto profundo. Enfrentando tempestades de areia capazes de arrancar a carne dos ossos, eles perceberam que a única chance de sobrevivência era adaptar-se à crueldade implacável de Arrakis.</p>",
    "<p>No seio do deserto, os Atreides renegados encontraram os Fremen, guerreiros de olhos azuis devido à imersão na especiaria. Paul, adotando o nome de Muad'Dib, compreendeu que o poder de Arrakis não estava na mineração, mas em seu ecossistema aterrorizante e sagrado. O rito de passagem definitivo ocorreu quando ele plantou os ganchos sob as escamas imensas do Shai-Hulud, erguendo-se sobre o colossal verme de areia e domando a fera que era venerada como o próprio deus do deserto.</p>",
    "<p>A tempestade de Coriolis mascarou o ataque final. Cavalgando os grandes vermes e empunhando o poder do Deserto, as legiões Fremen de Paul esmagaram as forças combinadas do Barão Harkonnen e do Imperador Sardaukar. No centro do caos, Paul não era apenas um líder militar, mas o Kwisatz Haderach, uma mente capaz de enxergar todos os futuros possíveis. Com o controle absoluto sobre a especiaria, ele curvou o universo inteiro à sua vontade, selando um destino de glória e sangue.</p>",
  ],
  Hobbit: [
    "<p>Bilbo Bolseiro fumava tranquilamente seu cachimbo na porta de sua toca quando o mago Gandalf apareceu, quebrando a paz perfeita do Condado. O que se seguiu foi uma noite de caos crescente, com a campainha tocando repetidas vezes e anões carrancudos invadindo sua despensa. Enquanto eles devoravam seus queijos e esvaziavam seus barris de cerveja, cantavam canções antigas sobre montanhas frias e ouro esquecido. Relutante e assustado, o pequeno hobbit percebeu que sua vida pacata estava prestes a ser devorada por uma aventura formidável.</p>",
    "<p>Nas profundezas gélidas das Montanhas Sombrias, separado de seus companheiros, Bilbo tateava na escuridão absoluta. Seus dedos tocaram algo frio e metálico no chão: um anel de ouro. Guardando-o no bolso sem saber seu poder, ele logo encontrou a criatura Gollum, de olhos pálidos e brilhantes no breu. A única maneira de escapar da ilha subterrânea e de não ser devorado era vencer um terrível e antigo jogo de charadas, onde o silêncio lúgubre era quebrado apenas pelos sibilos ameaçadores do monstro esguio.</p>",
    "<p>O calor dentro da Montanha Solitária era insuportável, vindo das narinas do imenso dragão que repousava sobre montanhas de tesouros incontáveis. Protegido pela invisibilidade do Anel, Bilbo desceu furtivamente e conversou com Smaug, trocando enigmas sutis para adular a vaidade da fera. Durante a perigosa conversa, o hobbit astuto notou um pedaço nu e vulnerável na couraça impenetrável do peito do dragão. Essa pequena falha, guardada na memória de Bilbo, seria a chave para a salvação da Cidade do Lago e o fim do pesadelo escamoso.</p>",
    "<p>A encosta da montanha transformou-se em um banho de sangue quando orcs e wargs surgiram como uma maré negra, forçando anões, elfos e homens a deixarem de lado sua ganância para lutarem juntos pela sobrevivência. Bilbo, usando o Anel, observava o horror e a glória da Batalha dos Cinco Exércitos escondido, testemunhando o heroísmo de Thorin Escudo-de-Carvalho e a chegada majestosa das Águias. A guerra varreu suas ilusões sobre a aventura, mostrando-lhe o custo amargo da coragem e a verdadeira natureza da ganância.</p>",
  ],
  "Memorias do Subsolo": [
    "<p>Sou um homem doente. Sou um homem mau. Um homem repulsivo. Aposentado de meu cargo insignificante, refugio-me em meu canto obscuro em São Petersburgo, nutrindo um rancor profundo contra o mundo. As pessoas normais, de nervos fortes, agem guiadas pela lógica e pelo benefício próprio, marchando confiantemente contra o muro da impossibilidade. Eu, no entanto, tenho consciência demais; e essa hiperconsciência é uma doença terrível que me impede de agir, me obriga a chafurdar na lama de minha própria inércia e a extrair um prazer perverso da minha própria degradação.</p>",
    "<p>Vocês, cavalheiros, acreditam que o homem pode ser catalogado, que a ciência e a razão podem tabular nossos desejos em uma tabela de logaritmos até que não haja mais vontade livre, apenas a previsibilidade de um palácio de cristal. Mas o homem é uma criatura ingrata e cômica. Ele é capaz de desejar o próprio dano, o caos e a destruição, apenas para provar a si mesmo que não é uma tecla de piano sendo tocada pelas leis da natureza. O livre-arbítrio, mesmo que destrutivo, é a nossa revolta mais preciosa contra o dois e dois são quatro.</p>",
    "<p>A neve molhada caía melancolicamente na rua escura enquanto eu entrava no restaurante, o coração batendo com um ódio antecipado. O reencontro com Simonov e Zverkov, amigos da juventude que eu desprezava e invejava secretamente, foi um desastre previsível. Bêbado, envergonhado e desesperado para impor alguma superioridade ilusória, insultei a todos, andei de um lado para o outro na sala como uma mosca raivosa e, no fim, fui ignorado. A humilhação social confirmava todas as teses mórbidas que eu alimentava sobre mim mesmo em meu subsolo estagnado.</p>",
    "<p>Quando a jovem Liza apareceu no meu quarto miserável, havia ali uma pequena chama de esperança para ambos. Ela, uma garota forçada à prostituição que eu havia atormentado e depois tentado salvar com discursos grandiloquentes; eu, um monstro necessitado de afeto. Mas a minha vaidade ferida foi maior. Ao perceber que ela me via quebrado, que me oferecia verdadeira compaixão, meu orgulho se rebelou. Insultei-a brutalmente, forcei dinheiro em sua mão para rebaixá-la e a expulsei, escolhendo deliberadamente o tormento do meu subsolo invés da vulnerabilidade do amor autêntico.</p>",
  ],
  "Monte Cristo": [
    "<p>A úmida e gélida escuridão do Castelo de If tornou-se o mundo inteiro do jovem marinheiro Edmond Dantès. Arrancado de seu casamento no dia de suas núpcias por uma falsa denúncia de traição política, ele não entendia as forças obscuras que o haviam condenado. Os dias se transformaram em meses e os meses em anos tortuosos. O desespero arranhou as paredes de pedra até a exaustão de seus dedos, e a esperança cedeu lugar a um silêncio sepulcral e a pensamentos de morte, enquanto a justiça e Deus pareciam tê-lo abandonado para sempre.</p>",
    "<p>O som rítmico de arranhões na parede contígua despertou Dantès de seu torpor. A escavação que deveria levar à liberdade o colocou frente a frente com o Abade Faria, um erudito prisioneiro considerado louco por todos. Faria tornou-se o farol na mente obscurecida de Edmond, ensinando-lhe línguas, ciência, filosofia e deduzindo, com lógica implacável, a identidade dos conspiradores que o haviam incriminado. Antes de seu último suspiro na masmorra, o velho abade confiou ao seu discípulo o maior segredo do Mediterrâneo: a exata localização da fortuna incalculável escondida na rochosa Ilha de Monte Cristo.</p>",
    "<p>Os salões repletos de ouro e tapeçarias de Paris sussurravam sobre a chegada do misterioso e opulento Conde de Monte Cristo. Ninguém reconheceu no nobre pálido de olhar gélido o antigo marinheiro traído. Com recursos infinitos e um conhecimento profundo das fraquezas humanas, o Conde começou a infiltrar-se no núcleo familiar e financeiro de Fernand, Danglars e Villefort. Ele não era mais apenas um homem, mas um anjo do extermínio, movendo as peças da alta sociedade como um jogo de xadrez impecável e mortífero.</p>",
    "<p>A teia finalmente se fechou em torno dos culpados. Danglars estava falido e humilhado; Fernand exposto como traidor e covarde, levado ao suicídio; e a família de Villefort consumida pela loucura e pelo veneno. No entanto, diante do colapso total de seus inimigos e do horror que sua própria vingança implacável havia gerado, o peito de chumbo do Conde sentiu o peso do perdão. Deixando uma vasta fortuna para os justos e zarpando para o horizonte com a jovem Haydée, Dantès concluiu que toda a sabedoria humana se resume a duas palavras: esperar e ter esperança.</p>",
  ],
  "Os Miseraveis": [
    "<p>O bispo de Digne dormia placidamente quando Jean Valjean, o ex-forçado marcado pela sociedade, empunhou a barra de ferro sobre sua cama. Ele havia recebido abrigo e comida, mas o instinto de sobrevivência e o rancor dezenove anos de trabalhos forçados gritaram mais alto, levando-o a roubar a prataria de prata. Quando os guardas o capturaram na manhã seguinte, o bispo não apenas o inocentou, mas lhe entregou também os castiçais, dizendo com serenidade que comprava a alma de Valjean das trevas e a entregava a Deus, selando a dolorosa e imediata conversão do homem condenado.</p>",
    "<p>Na escuridão da floresta de Montfermeil, a pequena Cosette, com os pés nus e congelados, carregava um balde de água pesado demais para seus braços desnutridos. O medo do escuro e a crueldade dos estalajadeiros Thénardier pesavam sobre ela como um pesadelo sem fim. Foi então que uma mão enorme e gentil tomou o cabo do balde, aliviando o fardo instantaneamente. Jean Valjean, respondendo à promessa feita no leito de morte de Fantine, emergiu das sombras para resgatar a menina, comprando sua liberdade a peso de ouro e levando-a para uma vida de luz.</p>",
    "<p>As ruas de Paris fervilhavam com a cólera da revolução. Estudantes, operários e poetas amontoavam móveis, carroças e pedras de calçamento, erguendo a formidável barricada da Rua da Chanvrerie. Marius sentia a morte pairar, misturada ao seu amor desesperado por Cosette e à fumaça da pólvora que começava a escurecer o céu de junho. Atrás das trincheiras, cantos de liberdade e gritos de guerra ecoavam, enquanto o exército real se preparava para o assalto final que varreria aquela juventude sonhadora em um mar de sangue e pólvora.</p>",
    "<p>O cheiro podre e a escuridão opressiva dos esgotos de Paris envolviam Jean Valjean, que avançava com a lama até os joelhos, carregando o corpo inconsciente e ensanguentado do jovem Marius nos ombros. A fuga desesperada do massacre da barricada foi uma provação dantesca, um último ato de puro autossacrifício por parte do velho. Anos depois, rodeado pelo amor de Cosette e Marius, Valjean fechou os olhos para sempre sob o crucifixo de prata, descansando finalmente da perseguição terrena, como um anjo invisível que se afasta silenciosamente.</p>",
  ],
  "Resident Evil": [
    "<p>As montanhas Arklay estavam encobertas pela escuridão quando a equipe S.T.A.R.S. buscou refúgio na isolada e imponente Mansão Spencer. O que parecia ser um resgate seguro rapidamente se transformou em um matadouro de horror indescritível. Portas trancadas por enigmas bizarros, cães mutantes estilhaçando janelas e cadáveres reanimados arrastando-se pelos corredores ricamente decorados forçaram os agentes sobreviventes a lutarem por cada munição e erva medicinal, descobrindo os experimentos ilegais do T-Vírus que manchavam as mãos da toda-poderosa Umbrella Corporation.</p>",
    "<p>O caos tomou as ruas de Raccoon City feito pólvora. O vírus escapou do laboratório subterrâneo e infectou o abastecimento de água, transformando a pacata população em uma horda devoradora de carne. O novato Leon e a universitária Claire encontraram-se no epicentro do apocalipse civil, barricando-se no departamento de polícia que agora era uma tumba. Entre ruas em chamas e a perseguição implacável do monstro mutante Nemesis, os poucos sobreviventes travaram uma guerra sangrenta para escapar antes que o míssil governamental apagasse a cidade do mapa para sempre.</p>",
    "<p>As folhas secas estalavam sob as botas do agente especial que se infiltrava no remoto e sombrio vilarejo rural na Europa, em busca da filha do presidente. O silêncio estranho foi quebrado por habitantes com olhos injetados de sangue e foices enferrujadas, que não eram zumbis, mas humanos dominados por um parasita ancestral repugnante. A luta pela sobrevivência tornou-se frenética contra aldeões coordenados, monges encapuzados e líderes fanáticos de um culto doentio que adorava a praga parasítica que ameaçava o mundo.</p>",
    "<p>No centro da gélida e chuvosa ilha militarizada, o céu estava pintado pelas explosões e pela fumaça negra dos helicópteros abatidos. O confronto final revelou o ápice do terror biotecnológico: o ex-companheiro de equipe transformado em uma aberração monstruosa de carne pulsante e força descomunal, movido apenas pelo ódio e pela infecção avançada. O disparo decisivo de uma arma de destruição pesada fragmentou o monstro, colocando um fim violento a mais um capítulo da luta eterna contra o bioterrorismo e corporações que brincavam de Deus.</p>",
  ],
  "Scott Pilgrim": [
    "<p>A vida de Scott seguia em um ritmo apático de ensaios na garagem e videogames antigos, dividindo um colchão no chão de um apartamento minúsculo em Toronto. Tudo mudou no momento em que ele a viu na festa: a entregadora misteriosa de patins, com cabelo de cores vibrantes e um ar de tédio insuperável, Ramona Flowers. A obsessão instantânea do garoto fez com que ele começasse a encomendar pacotes apenas para tê-la na porta, alheio à bagagem caótica e perigosa que a garota americana trazia para sua vidinha confortável e irresponsável.</p>",
    "<p>O show da Sex Bob-omb estava prestes a começar quando o teto desabou e a figura mística de Matthew Patel desceu flutuando ao palco. Com ataques de fogo e uma trupe de garotas demônio dançantes, ele anunciou ser o primeiro membro da Liga dos Ex-Namorados do Mal que Scott deveria derrotar para namorar Ramona. Atônito, mas imbuído da lógica ilógica dos jogos de luta que amava, Scott engajou em um combate frenético e coreografado, finalizando o pirata hipster e observando-o transformar-se em uma chuva de moedas brilhantes.</p>",
    "<p>O palco do festival balançava sob a intensidade distorcida da batalha de bandas. Do outro lado, os sombrios gêmeos Katayanagi invocavam bestas espirituais através da distorção agressiva de seus amplificadores e teclados. A rivalidade não era apenas física, mas musical e energética, pressionando as cordas do baixo de Scott até o limite. Quando a enorme manifestação de som da Sex Bob-omb quebrou o poder do som japonês, a vitória foi barulhenta e exaustiva, deixando os gêmeos caídos na lama e abrindo caminho para o chefe final.</p>",
    "<p>O Teatro do Caos foi o cenário da batalha final e dramática contra o magnata Gideon Graves. Armado não apenas com sua espada flamejante, mas finalmente confrontando suas próprias falhas, inseguranças e o terrível hábito de magoar as pessoas ao seu redor, Scott percebeu que precisava lutar por si mesmo, não apenas pela garota. Com o poder do Autorrespeito adquirido através da honestidade dolorosa, Scott desferiu o combo definitivo, partindo Gideon ao meio de forma espetacular e, pela primeira vez em sua vida, encarando o futuro de frente.</p>",
  ],
  SpiderMan: [
    "<p>A excursão escolar para os laboratórios de ciências prosseguia tediosamente para o brilhante e deslocado adolescente Peter. Enquanto o cientista demonstrava os efeitos da radiação, uma pequena aranha banhada nos feixes de energia caiu despercebida sobre a mão do jovem, cravando as presas radioativas. A picada trouxe febre e tontura, mas no dia seguinte, a franqueza física de Peter fora substituída por uma força absurda, reflexos ultrarrápidos e a habilidade surreal de aderir às paredes, deixando o estudante chocado com a magnitude do seu próprio corpo transformado.</p>",
    "<p>Com o ego inflado pela fama repentina em lutas de exibição e na televisão, o jovem mascarado assistiu a um ladrão passar correndo pelo corredor do estúdio e não moveu um músculo para detê-lo, acreditando que não era problema seu. A negligência orgulhosa cobrou seu preço naquela mesma noite, quando ele encontrou a casa cercada por sirenes e seu amado guardião mortalmente ferido. Ao encurralar o assassino no armazém escuro e arrancar a máscara do criminoso, o choque ao reconhecer o ladrão que deixou fugir forjou em prantos a dura regra que o guiaria pelo resto da vida.</p>",
    "<p>O céu noturno de Nova York era rasgado pelo som rasante de um planador pontiagudo e risadas macabras. O criminoso com armadura esmeralda e máscara demoníaca não apenas lançava abóboras explosivas, mas também tinha um intelecto afiado o suficiente para testar as capacidades do herói aranha em cada esquina do arranha-céu. Entre esquivas desesperadas e redes de teia sendo rompidas por lâminas afiadas, o jovem sentiu, pela primeira vez, o gosto amargo do perigo genuíno, descobrindo que seus inimigos agora eram tão implacáveis e insanos quanto ele era heroico.</p>",
    "<p>A chuva caía impiedosamente, misturando-se ao suor debaixo do capuz rasgado. As sirenes de polícia soavam ao longe enquanto o jovem fotógrafo tirava as botas sujas de lama antes de entrar furtivamente pela janela do próprio quarto para não acordar sua tia fragilizada. O cansaço pesava em seus ossos, os jornais da cidade o difamavam como uma ameaça pública, e ele havia faltado a mais um encontro e a uma prova da faculdade para impedir um assalto a banco. O fardo do poder era solitário e ingrato, mas a máscara, manchada e costurada, nunca seria abandonada.</p>",
  ],
  "Vidas Secas": [
    "<p>A caatinga era uma extensão infinita de galhos retorcidos, terra rachada e calor sufocante que embaçava o horizonte sob um sol de chumbo. A família arrastava-se lentamente pelo chão ardente; os ombros curvados de Fabiano sob a carga parca, Sinhá Vitória segurando firmemente o baú de folha-de-flandres, e os dois meninos choramingando de fome, com as barrigas inchadas. Atrás deles, com a língua de fora e os ossos das costelas evidentes, a cachorrinha acompanhava os passos arrastados, todos unidos em um mutismo de sofrimento instintivo na tentativa desesperada de encontrar sombra ou um poço que ainda resistisse à seca implacável.</p>",
    "<p>Agachado no terreiro empoeirado, o menino franzia a testa enquanto escutava as conversas raras dos adultos e o chamado distante dos pássaros que prenunciavam a chuva. Uma palavra ouvida por acaso, de sonoridade bonita e significado oculto, ficava ecoando em sua cabeça oca de instrução. Ele questionava o vazio de sua existência bruta, tentando entender os limites do mundo ao redor com a inocência e o deslumbramento de uma criança cujos pensamentos não conseguiam formular frases completas, aprisionada na linguagem áspera e limitante que espelhava a aridez do próprio sertão.</p>",
    "<p>O som do tiro seco rompeu o silêncio fúnebre do umbuzeiro. O animal da família, acometido por um mal silencioso e incurável que lhe cobria o corpo magro de feridas peladas, arrastou-se para trás da catingueira, tentando inutilmente lamber a ferida quente deixada pela espingarda do dono. Em seus últimos espasmos, sob o cheiro seco da terra, seus pequenos olhos esmeraldinos não guardavam rancor. A fiel companheira teve um delírio pueril: um mundo vasto e cheio de preás gordos correndo pelo mato úmido, onde ela seria eternamente farta, mergulhando na morte como quem adormece ao som do chocalho e da paz nordestina.</p>",
    "<p>As nuvens densas sumiram, e o chão, antes verdejante, começava mais uma vez a rachar sob os ventos quentes e implacáveis de uma nova e anunciada desolação. Fabiano, calado, ajustou a bainha da faca e os parcos pertences. Sinhá Vitória apertou os olhos miúdos contra o sol poente. Sem trocarem uma única palavra, os retirantes viraram as costas para o abrigo temporário, entregando-se de novo à poeira da estrada grande, movidos por um anseio indefinível de fugir rumo ao sul, num eterno e cíclico marchar de vidas rudes e caladas, fugindo sempre, sem nunca realmente chegar.</p>",
  ],
  "X-Men": [
    "<p>Os corredores espaçosos e bem iluminados da luxuosa propriedade em Westchester contrastavam com o medo e a confusão que os jovens abrigavam dentro de si. Afastados da sociedade que os via como aberrações, adolescentes que podiam congelar o ar, disparar rajadas óticas avassaladoras ou mover objetos com o poder da mente aprenderam a controlar os dons imprevisíveis na temível e futurista Sala de Perigo. Sob a tutela do calmo e telepático professor, esse punhado de excluídos formou uma equipe paramilitar secreta, forjando uma irmandade que jurou proteger o mesmo mundo que exigia sua aniquilação incondicional.</p>",
    "<p>As paredes metálicas do silo de mísseis tremiam sob o campo magnético avassalador. De um lado, os pupilos idealistas lutavam pela coexistência pacífica e pelo entendimento humano; do outro, o mestre do magnetismo liderava seus acólitos mutantes, decidido a subjugar a raça humana que os perseguia antes que fossem todos exterminados. O choque físico dos poderes mutantes era formidável, torcendo o aço e explodindo a rocha, mas o verdadeiro impacto residia na guerra de filosofias inconciliáveis que dividia dois líderes que um dia foram os mais próximos dos amigos, rasgados ao meio pela sombra cruel da intolerância.</p>",
    "<p>No limite frio do espaço sideral, longe do abraço da atmosfera terrestre, a jovem telepata conteve a energia solar cósmica e implacável para salvar os amigos e o amor de sua vida, pagando o preço com o próprio sacrifício. Mas do fogo da nave avariada renasceu não apenas a garota, mas uma entidade de chamas incontroláveis, consumida por fome e destruição imensuráveis. A deusa caída não resistiu ao peso divino do poder puro; e, num momento de lúcida humanidade lunar, preferiu a própria morte trágica ao desespero de devorar estrelas, quebrando o coração da equipe e do universo.</p>",
    "<p>Os céus rubros de um amanhã desolado refletiam as fogueiras nos guetos de contenção onde jaziam prisioneiros tatuados com o número de série da anomalia genética. Gigantescos robôs programados para caçar e aniquilar marchavam esmagando os crânios de amigos outrora indomáveis sob suas pesadas botas de aço. Em uma tentativa desesperada e arriscada de corrigir o holocausto, a mente desgastada da sobrevivente foi lançada através do tempo, assumindo o corpo de sua juventude passada, com o peso agonizante de ter que impedir o trágico assassinato político que precipitou toda a extinção da raça mutante.</p>",
  ],
  "The Walking Dead": [
    "<p>A luz fria do sol filtrava-se pelas persianas quebradas do leito de enfermaria, iluminando as flores mortas ao lado da cama. O policial despertou do coma tossindo pelo ar viciado, arrancando os soros ressecados dos braços. Ao caminhar cambaleante pelo corredor iluminado de emergência, encontrou não médicos apressados, mas poças de sangue enegrecido e portas barradas com mensagens aterrorizantes rabiscadas à pressa. O silêncio da cidade destruída foi quebrado pelo gemido gorgolejante da metade apodrecida de uma mulher no chão, confirmando brutalmente que o mundo que ele conhecia e servia estava definitivamente morto.</p>",
    "<p>Os pesados portões de aço e as cercas duplas de arame farpado da penitenciária pareciam o santuário perfeito, mas as galerias sombrias cobraram um preço altíssimo de sanidade e segurança. Para esvaziar os pátios tomados pelos errantes, a brutalidade e a exaustão tornaram-se rotina diária; e para lidar com os prisioneiros sobreviventes e com as dissidências internas de liderança, o limite entre assassinato e sobrevivência se diluiu quase que completamente. Atrás daquelas paredes frias que antes serviam para trancar criminosos, pessoas comuns perderam sua moralidade, sangrando inocência e membros amados no frio concreto da sobrevivência prisional.</p>",
    "<p>O ar úmido e as dezenas de veículos dispostos em círculo, banhados pelas luzes agressivas dos faróis dos Salvadores, deixavam os cativos de joelhos, paralisados de um terror nunca antes sentido no apocalipse. A figura corpulenta de jaqueta de couro e sorriso sádico caminhou entre eles exalando dominação, embalando o temível bastão envoltado em arame farpado com um carinho doentio. O som metálico e molhado do crânio estilhaçado ecoou pela floresta silenciosa; o choque, o sangue jorrando e a brutalização sistemática das mentes outrora inabaláveis estabeleceram a tirania implacável de que a nova lei do mundo era o terror puro.</p>",
    "<p>Ecos da era morta desvaneceram perante as colheitas fartas, moinhos girando e comboios organizados conectando estradas seguras através da imensa área verde e murada. O perigo dos cadáveres ambulantes foi minimizado a quase uma inconveniência da estrada. Diante do monumento esculpido e sob os cabelos já grisalhos marcados pelas rugas das décadas apocalípticas passadas, as histórias antigas do policial que começou tudo com uma arma e uma busca viraram uma lenda folclórica contada às crianças assustadas. O pranto interminável e os massacres acabaram, substituídos pela respiração longa e melancólica de um futuro pacificamente conquistado na terra dos vivos.</p>",
  ],
};

// ==========================================================================
// FUNÇÕES PRINCIPAIS
// ==========================================================================

function carregarHistoria(titulo) {
  titulo = titulo.trim();
  document.getElementById("capitulo-titulo").textContent = titulo;

  // Verifica se a obra está na Base de Dados. Se não, usa 4 páginas de aviso.
  if (bdObras[titulo]) {
    paginasDaObraAtual = bdObras[titulo];
  } else {
    paginasDaObraAtual = [
      "<p>O conteúdo de <strong>" +
        titulo +
        "</strong> está a ser digitalizado e processado na nossa base de dados.</p>",
      "<p>A nossa equipa está a trabalhar para trazer a melhor experiência de leitura para esta obra o mais rápido possível.</p>",
      "<p>Por favor, regresse mais tarde ou explore outros títulos do nosso catálogo que já estão ativos.</p>",
      "<p>Experimente ler <em>Demon Slayer</em> ou <em>Your Name</em> para ver o sistema em pleno funcionamento.</p>",
    ];
  }

  // Zera a página e aplica a fonte inicial
  paginaAtual = 0;
  document.getElementById("texto-da-historia").style.fontSize =
    tamanhoFonte + "px";

  // Desenha a primeira página no ecrã
  renderizarPagina();
}

function renderizarPagina() {
  // 1. Escreve o texto da página atual na div
  document.getElementById("texto-da-historia").innerHTML =
    paginasDaObraAtual[paginaAtual];

  // 2. Atualiza o texto do indicador de páginas
  document.getElementById("indicador-pagina").textContent =
    `Página ${paginaAtual + 1} de ${paginasDaObraAtual.length}`;

  // 3. Bloqueia ou liberta os botões de voltar/avançar
  document.getElementById("btn-ant").disabled = paginaAtual === 0;
  document.getElementById("btn-prox").disabled =
    paginaAtual === paginasDaObraAtual.length - 1;
}

// Controla os botões "A+" e "A-"
function mudarFonte(mudanca) {
  tamanhoFonte += mudanca;

  // Limites de Segurança (Não deixa ficar microscópico nem gigante)
  if (tamanhoFonte < 14) tamanhoFonte = 14;
  if (tamanhoFonte > 36) tamanhoFonte = 36;

  aplicarFonte();
}

// Função que obriga os parágrafos a obedecerem ao JavaScript ignorando o CSS
function aplicarFonte() {
  const container = document.getElementById("texto-da-historia");

  if (container) {
    // Aplica na caixa principal
    container.style.fontSize = tamanhoFonte + "px";

    // Pega em TODOS os parágrafos lá dentro e força o tamanho
    const paragrafos = container.querySelectorAll("p");
    paragrafos.forEach((p) => {
      p.style.fontSize = tamanhoFonte + "px";
    });
  }
}

// Controla os botões "Anterior" e "Próxima"
function mudarPagina(direcao) {
  paginaAtual += direcao;
  renderizarPagina();

  // Sobe a tela suavemente para o início do texto ao trocar de página
  document
    .getElementById("area-de-leitura")
    .scrollIntoView({ behavior: "smooth" });
}
