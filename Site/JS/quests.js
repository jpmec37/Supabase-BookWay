(function() {
    // Configurações
    const PALETTE = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#5b6af0', '#8b5cf6', '#ec4899'];
    const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // Estado da Aplicação
    let appData = {
        challenges: [],
        completions: {} // formato: 'YYYY-MM-DD': [id1, id2]
    };
    let currentSelectedId = null;
    
    let todayDate = new Date();
    let displayMonth = todayDate.getMonth();
    let displayYear = todayDate.getFullYear();

    // Elementos DOM
    const elColorPicker = document.getElementById('colorPicker');
    const elChallengeColor = document.getElementById('challengeColor');
    const elCreateForm = document.getElementById('createForm');
    const elChallengesList = document.getElementById('challengesList');
    const elCalendarGrid = document.getElementById('calendarGrid');
    const elMonthTitle = document.getElementById('monthTitle');
    const elToastContainer = document.getElementById('toastContainer');
    
    const statStreak = document.getElementById('statStreak');
    const statTotalMonth = document.getElementById('statTotalMonth');
    const statRate = document.getElementById('statRate');

    // --- Inicialização ---
    function init() {
        loadData();
        setupColorPicker();
        setupEventListeners();
        renderAll();
    }

    // --- Dados e Persistência ---
    function loadData() {
        const saved = localStorage.getItem('challengeData');
        if (saved) {
            appData = JSON.parse(saved);
        } else {
            generateDummyData();
        }
        if (appData.challenges.length > 0) {
            currentSelectedId = appData.challenges[0].id;
        }
    }

    // Corrigido bug de salvamento automático no localStorage
    function saveData() {
        localStorage.setItem('challengeData', JSON.stringify(appData));
    }

    function generateDummyData() {
        const id1 = Date.now().toString();
        const id2 = (Date.now() + 1).toString();
        
        appData.challenges = [
            { id: id1, name: 'Meditação', meta: '15 min pela manhã', color: PALETTE[3] },
            { id: id2, name: 'Leitura', meta: '1 capítulo', color: PALETTE[5] }
        ];

        let d = new Date();
        for(let i=1; i<=5; i++) {
            d.setDate(todayDate.getDate() - i);
            let dateStr = formatDate(d);
            appData.completions[dateStr] = [id1];
            if(i % 2 === 0) appData.completions[dateStr].push(id2);
        }
        saveData();
    }

    // --- Utilitários de Data ---
    function formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    // Corrigido para evitar erros de fuso horário na comparação direta de string
    function isFutureDate(dateStr) {
        return dateStr > formatDate(todayDate);
    }

    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    // --- Lógica de Negócio (Estatísticas) ---
    function calculateStats(challengeId) {
        if (!challengeId) return { streak: 0, totalMonth: 0, rate: 0 };

        let streak = 0;
        let checkDate = new Date();
        
        if (!isCompleted(challengeId, formatDate(checkDate))) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
            if (isCompleted(challengeId, formatDate(checkDate))) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        let totalMonth = 0;
        let possibleDays = 0;
        let d = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
        
        while (d <= todayDate) {
            possibleDays++;
            if (isCompleted(challengeId, formatDate(d))) {
                totalMonth++;
            }
            d.setDate(d.getDate() + 1);
        }

        let rate = possibleDays === 0 ? 0 : Math.round((totalMonth / possibleDays) * 100);

        return { streak, totalMonth, rate };
    }

    // Corrigido para validar a existência da chave antes do .includes
    function isCompleted(challengeId, dateStr) {
        return appData.completions[dateStr] && appData.completions[dateStr].includes(challengeId);
    }

    function toggleCompletion(dateStr) {
        if (!currentSelectedId) {
            showToast('Selecione um desafio primeiro.', 'error');
            return;
        }
        if (isFutureDate(dateStr)) {
            showToast('Não é possível marcar dias futuros.', 'error');
            return;
        }

        if (!appData.completions[dateStr]) {
            appData.completions[dateStr] = [];
        }

        const index = appData.completions[dateStr].indexOf(currentSelectedId);
        const challengeName = appData.challenges.find(c => c.id === currentSelectedId).name;

        if (index > -1) {
            appData.completions[dateStr].splice(index, 1);
            if (appData.completions[dateStr].length === 0) {
                delete appData.completions[dateStr];
            }
            showToast(`Desmarcado: ${challengeName}`);
        } else {
            appData.completions[dateStr].push(currentSelectedId);
            showToast(`Concluído: ${challengeName} 🎉`);
        }

        saveData();
        renderAll();
    }

    // --- Renderização ---
    function renderAll() {
        renderChallengesList();
        renderStats();
        renderCalendar();
    }

    function renderChallengesList() {
        elChallengesList.innerHTML = '';
        
        if (appData.challenges.length === 0) {
            elChallengesList.innerHTML = '<div class="cd-empty-state">Nenhum desafio criado ainda.</div>';
            return;
        }

        appData.challenges.forEach(c => {
            const stats = calculateStats(c.id);
            const div = document.createElement('div');
            // ADICIONADO PREFIXO cd-
            div.className = `cd-challenge-item ${c.id === currentSelectedId ? 'active' : ''}`;
            div.onclick = () => {
                currentSelectedId = c.id;
                renderAll();
            };

            // ATUALIZADAS AS CLASSES INTERNAS COM cd-
            div.innerHTML = `
                <div class="cd-challenge-color-dot" style="background-color: ${c.color}"></div>
                <div class="cd-challenge-info">
                    <div class="cd-challenge-name">${c.name}</div>
                    <div class="cd-challenge-meta">${c.meta}</div>
                    <div class="cd-challenge-stats-mini" style="font-size: 0.8rem; color: var(--cd-text-muted); margin-top: 4px;">
                        <span><img src="./imagens/Vetores/FogoPreenchidoVetor.svg" alt="" class="fire-icon1">${stats.streak}</span>
                        <span style="margin-left: 8px;"><img src="./imagens/Vetores/Sequencia2Vetor.svg" alt="" class="verde1">${stats.totalMonth}</span>
                    </div>
                </div>
                <button class="cd-delete-btn" onclick="deleteChallenge(event, '${c.id}')">🗑️</button>
            `;
            elChallengesList.appendChild(div);
        });
    }

    function renderStats() {
        const stats = calculateStats(currentSelectedId);
        statStreak.textContent = stats.streak;
        statTotalMonth.textContent = stats.totalMonth;
        statRate.textContent = `${stats.rate}%`;
    }

    function renderCalendar() {
        elMonthTitle.textContent = `${MONTHS[displayMonth]} ${displayYear}`;
        elCalendarGrid.innerHTML = '';

        WEEKDAYS.forEach(day => {
            const div = document.createElement('div');
            // ADICIONADO PREFIXO cd-
            div.className = 'cd-weekday';
            div.textContent = day;
            elCalendarGrid.appendChild(div);
        });

        const firstDayIndex = new Date(displayYear, displayMonth, 1).getDay();
        const daysInMonth = getDaysInMonth(displayYear, displayMonth);
        const prevMonthDays = getDaysInMonth(displayYear, displayMonth - 1);
        
        const totalCells = 42; 
        
        for (let i = 1; i <= totalCells; i++) {
            const cell = document.createElement('div');
            // ADICIONADO PREFIXO cd-
            cell.className = 'cd-day-cell';
            
            let dayNum;
            let dateStr;
            let isCurrentMonth = false;

            if (i <= firstDayIndex) {
                dayNum = prevMonthDays - firstDayIndex + i;
                cell.classList.add('cd-other-month');
            } else if (i <= firstDayIndex + daysInMonth) {
                dayNum = i - firstDayIndex;
                dateStr = formatDate(new Date(displayYear, displayMonth, dayNum));
                isCurrentMonth = true;
                cell.classList.add('cd-current-month');
                
                if (dateStr === formatDate(todayDate)) {
                    cell.classList.add('cd-today');
                }
                
                if (isFutureDate(dateStr)) {
                    cell.classList.add('cd-future');
                } else {
                    cell.classList.add('cd-past-or-today');
                    cell.onclick = () => toggleCompletion(dateStr);
                }
            } else {
                dayNum = i - firstDayIndex - daysInMonth;
                cell.classList.add('cd-other-month');
            }

            // ADICIONADO PREFIXO cd-
            cell.innerHTML = `<div class="cd-day-number">${dayNum}</div>`;
            
            if (isCurrentMonth && appData.completions[dateStr]) {
                const dotsContainer = document.createElement('div');
                // ADICIONADO PREFIXO cd-
                dotsContainer.className = 'cd-dots-container';
                
                appData.completions[dateStr].forEach(cId => {
                    const challenge = appData.challenges.find(c => c.id === cId);
                    if (challenge) {
                        const dot = document.createElement('div');
                        // ADICIONADO PREFIXO cd-
                        dot.className = 'cd-completion-dot';
                        dot.style.backgroundColor = challenge.color;
                        dot.style.color = challenge.color; // Necessário por conta do currentColor no CSS box-shadow
                        
                        if(cId === currentSelectedId) {
                            dot.style.boxShadow = `0 0 0 2px #011733, 0 0 0 4px ${challenge.color}`;
                        }
                        dotsContainer.appendChild(dot);
                    }
                });
                cell.appendChild(dotsContainer);
            }

            elCalendarGrid.appendChild(cell);
        }
    }

    // --- Interações ---
    function setupColorPicker() {
        elColorPicker.innerHTML = '';
        PALETTE.forEach((color, index) => {
            const div = document.createElement('div');
            // ADICIONADO PREFIXO cd-
            div.className = `cd-color-option ${index === 0 ? 'selected' : ''}`;
            div.style.backgroundColor = color;
            div.onclick = () => {
                document.querySelectorAll('.cd-color-option').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                elChallengeColor.value = color;
            };
            elColorPicker.appendChild(div);
        });
        elChallengeColor.value = PALETTE[0];
    }

    function setupEventListeners() {
        elCreateForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('challengeName').value.trim();
            const meta = document.getElementById('challengeMeta').value.trim();
            const color = elChallengeColor.value;

            if (!name || !meta) return;

            const newChallenge = {
                id: Date.now().toString(),
                name,
                meta,
                color
            };

            appData.challenges.push(newChallenge);
            currentSelectedId = newChallenge.id;
            saveData();
            
            elCreateForm.reset();
            // ADICIONADO PREFIXO cd-
            document.querySelectorAll('.cd-color-option').forEach((el, idx) => {
                if(idx === 0) el.classList.add('selected');
                else el.classList.remove('selected');
            });
            elChallengeColor.value = PALETTE[0];

            showToast('Desafio criado com sucesso!');
            renderAll();
        };

        document.getElementById('btnPrevMonth').onclick = () => {
            displayMonth--;
            if (displayMonth < 0) {
                displayMonth = 11;
                displayYear--;
            }
            renderCalendar();
        };

        document.getElementById('btnNextMonth').onclick = () => {
            displayMonth++;
            if (displayMonth > 11) {
                displayMonth = 0;
                displayYear++;
            }
            renderCalendar();
        };

        document.getElementById('btnHoje').onclick = () => {
            displayMonth = todayDate.getMonth();
            displayYear = todayDate.getFullYear();
            renderCalendar();
        };
    }

    window.deleteChallenge = function(event, id) {
        event.stopPropagation(); 
        if(confirm('Tem certeza que deseja excluir este desafio e todo seu histórico?')) {
            appData.challenges = appData.challenges.filter(c => c.id !== id);
            
            for (let date in appData.completions) {
                appData.completions[date] = appData.completions[date].filter(cId => cId !== id);
                if (appData.completions[date].length === 0) {
                    delete appData.completions[date];
                }
            }

            if (currentSelectedId === id) {
                currentSelectedId = appData.challenges.length > 0 ? appData.challenges[0].id : null;
            }
            
            saveData();
            renderAll();
            showToast('Desafio excluído.');
        }
    };

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        // ADICIONADO PREFIXO cd-
        toast.className = 'cd-toast';
        toast.textContent = message;
        if(type === 'error') toast.style.backgroundColor = 'var(--cd-danger)';
        
        elToastContainer.appendChild(toast);
        
        void toast.offsetWidth;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    init();

})();

 const botaoSidebar = document.getElementById("bttn-oc");
    botaoSidebar.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-collapsed");
    });