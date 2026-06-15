/* script.js */

// =========================
// Estado e armazenamento
// =========================

const STORAGE_KEYS = {
  communities: 'bw6_communities_v1',
  messages: 'bw6_messages_v1',
  likes: 'bw6_likes_v1',
  activeId: 'bw6_active_comm_v1',
  polls: 'bw6_polls_v1'
};


const COMMUNITY_SEED = [
  {
    id: 'star-wars',
    name: 'Star Wars',
    desc: 'Discussões sobre a galáxia distante, lendas e o cânone.',
    color: '#3b82f6',
    image: ''
  },
  {
    id: 'jujutsu-kaisen',
    name: 'Jujutsu Kaisen',
    desc: 'Feiticeiros jujutsu, maldições e expansões de domínio.',
    color: '#ef4444',
    image: ''
  },
  {
    id: 'leitura-comum',
    name: 'Comunidade de Leitura Comum',
    desc: 'Clube ativo para debates sobre clássicos e lançamentos.',
    color: '#10b981',
    image: ''
  },
  {
    id: 'hellding',
    name: 'Hellding',
    desc: 'Estratégias de combate e lore nas profundezas sombrias.',
    color: '#8b5cf6',
    image: ''
  },
  {
    id: 'percy-jackson',
    name: 'Percy Jackson',
    desc: 'Semideuses, chalés e sagas mitológicas do Olimpo.',
    color: '#f59e0b',
    image: ''
  },
  {
    id: 'jojo-bizarre-adventure',
    name: 'JoJo Bizarre Adventure',
    desc: 'Usuários de Stand, linhagem Joestar e análises visuais.',
    color: '#ec4899',
    image: ''
  }
];

const initialMessages = {
  'star-wars': [
    {
      id: 'sw_1',
      author: 'Anakin99',
      text: 'Alguém aqui já leu algo sobre herdeiros do Império? Queria começar a discussão.',
      likesCount: 12,
      likedByMe: false,
      time: '14:02'
    },
    {
      id: 'sw_2',
      author: 'ObiWan_K',
      text: 'Ótima escolha. A trilogia Thrawn expande o universo de um jeito muito consistente.',
      likesCount: 25,
      likedByMe: false,
      time: '14:15'
    }
  ],
  'jujutsu-kaisen': [
    {
      id: 'jk_1',
      author: 'GojoSatoru',
      text: 'O volume recente tá absurdo… a combinação de ritmo e técnica é muito forte!',
      likesCount: 88,
      likedByMe: false,
      time: '10:30'
    }
  ],
  'leitura-comum': [
    {
      id: 'lc_1',
      author: 'MachadoFan',
      text: 'Capitu traiu ou não? Vamos manter o debate civil e com argumentos.',
      likesCount: 45,
      likedByMe: false,
      time: '16:00'
    }
  ],
  hellding: [
    {
      id: 'hd_1',
      author: 'VampireHunter',
      text: 'A atmosfera é perfeita: luta, política e sombra. É viciante.',
      likesCount: 14,
      likedByMe: false,
      time: '19:11'
    }
  ],
  'percy-jackson': [
    {
      id: 'pj_1',
      author: 'SeaWeedBrain',
      text: 'Qual arco te fez mais sentir que Percy cresceu de verdade? Quero ver perspectivas.',
      likesCount: 38,
      likedByMe: false,
      time: '11:22'
    }
  ],
  'jojo-bizarre-adventure': [
    {
      id: 'jj_1',
      author: 'Jotaro_K',
      text: 'Steel Ball Run é um espetáculo de ritmo. Vocês preferem combate ou estratégia?',
      likesCount: 72,
      likedByMe: false,
      time: '22:04'
    }
  ]
};

const ICON_SVGS = {
  // Paleta coerente com o design (sem emojis)
  star: `
    <svg viewBox="0 0 64 64" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M32 6l7 18 19 1-15 12 5 19-16-10-16 10 5-19-15-12 19-1 7-18Z"/>
    </svg>
  `,
  chain: `
    <svg viewBox="0 0 64 64" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 40l-6 6a10 10 0 1 1-14-14l6-6"/>
      <path d="M40 24l6-6a10 10 0 1 1 14 14l-6 6"/>
      <path d="M26 38l12-12"/>
      <path d="M30 34l-2 2"/>
    </svg>
  `,
  book: `
    <svg viewBox="0 0 64 64" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 10h26a6 6 0 0 1 6 6v38H24a6 6 0 0 0-6 6V10Z"/>
      <path d="M18 54h26"/>
      <path d="M28 18h18"/>
    </svg>
  `,
  shield: `
    <svg viewBox="0 0 64 64" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M32 6l22 10v18c0 14-9 24-22 24S10 48 10 34V16l22-10Z"/>
      <path d="M26 34l-4-4"/>
      <path d="M26 34l10-10"/>
    </svg>
  `,
  trident: `
    <svg viewBox="0 0 64 64" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M30 8v16c0 5-6 9-10 9"/>
      <path d="M34 8v16c0 5 6 9 10 9"/>
      <path d="M26 24h12"/>
      <path d="M32 24v32"/>
      <path d="M26 56h12"/>
    </svg>
  `,
  jojo: `
    <svg viewBox="0 0 64 64" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 38c0-12 8-22 18-22"/>
      <path d="M46 26c0 12-8 22-18 22"/>
      <path d="M14 26l6 6"/>
      <path d="M50 38l-6-6"/>
      <path d="M32 14l4 8"/>
    </svg>
  `
};

function slugFromName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);
}

function timeNowHHMM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function safeJsonParse(val, fallback) {
  try {
    if (!val) return fallback;
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

const state = {
  communities: [],
  messagesByCommunityId: {},
  likesByMessageId: {},
  activeCommunityId: '',

  // Posts e enquetes
  pollsByPostId: {} // { [postId]: { votes:{A: n, B:n}, myChoice:'A'|'B'|'' } }
};


function persistAll() {
  localStorage.setItem(STORAGE_KEYS.communities, JSON.stringify(state.communities));
  localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(state.messagesByCommunityId));
  localStorage.setItem(STORAGE_KEYS.likes, JSON.stringify(state.likesByMessageId));
  localStorage.setItem(STORAGE_KEYS.activeId, state.activeCommunityId);
  localStorage.setItem(STORAGE_KEYS.polls, JSON.stringify(state.pollsByPostId || {}));
}


function loadAll() {
  const savedComms = safeJsonParse(localStorage.getItem(STORAGE_KEYS.communities), null);
  const savedMsgs = safeJsonParse(localStorage.getItem(STORAGE_KEYS.messages), null);
  const savedLikes = safeJsonParse(localStorage.getItem(STORAGE_KEYS.likes), null);
  const savedPolls = safeJsonParse(localStorage.getItem(STORAGE_KEYS.polls), null);
  const active = localStorage.getItem(STORAGE_KEYS.activeId);


  if (savedComms && savedComms.length) {
    state.communities = savedComms;
  } else {
    state.communities = [...COMMUNITY_SEED];
  }

  state.messagesByCommunityId = savedMsgs && Object.keys(savedMsgs).length ? savedMsgs : { ...initialMessages };
  state.likesByMessageId = savedLikes && Object.keys(savedLikes).length ? savedLikes : {};

  if (active && state.communities.some((c) => c.id === active)) {
    state.activeCommunityId = active;
  } else {
    state.activeCommunityId = state.communities[0]?.id || '';
  }

  // Posts/enquetes persistidos
  state.pollsByPostId = savedPolls && typeof savedPolls === 'object' ? savedPolls : {};

  // Sincroniza likedByMe a partir de likesByMessageId
  for (const commId of Object.keys(state.messagesByCommunityId)) {

    const list = state.messagesByCommunityId[commId];
    if (!Array.isArray(list)) continue;
    for (const m of list) {
      if (state.likesByMessageId[m.id] && typeof state.likesByMessageId[m.id].likedByMe === 'boolean') {
        m.likedByMe = state.likesByMessageId[m.id].likedByMe;
        m.likesCount = state.likesByMessageId[m.id].likesCount;
      }
    }
  }
}

function getCommById(id) {
  return state.communities.find((c) => c.id === id);
}

function avatarFallbackSvgForCommunity(commId) {
  if (commId === 'star-wars') return ICON_SVGS.star;
  if (commId === 'jujutsu-kaisen') return ICON_SVGS.chain;
  if (commId === 'leitura-comum') return ICON_SVGS.book;
  if (commId === 'hellding') return ICON_SVGS.shield;
  if (commId === 'percy-jackson') return ICON_SVGS.trident;
  if (commId === 'jojo-bizarre-adventure') return ICON_SVGS.jojo;
  return ICON_SVGS.book;
}

function renderSidebar() {
  const ul = document.getElementById('bw-community-list');
  if (!ul) return;
  ul.innerHTML = '';

  state.communities.forEach((comm) => {
    const li = document.createElement('li');
    li.className = `bw-community-item ${comm.id === state.activeCommunityId ? 'active' : ''}`;

    const a = document.createElement('button');
    a.type = 'button';
    a.className = 'bw-community-link';
    a.setAttribute('data-comm-id', comm.id);
    a.addEventListener('click', () => selecionarComunidade(comm.id));

    const avatar = comm.image
      ? `
        <div class="bw-comm-avatar" title="${escapeHtml(comm.name)}">
          <img src="${escapeHtml(comm.image)}" alt="${escapeHtml(comm.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'" />
          <div class="bw-comm-avatar-fallback" style="display:grid; color:${escapeHtml(comm.color)}; border:1px solid rgba(245,245,220,0.35);" aria-hidden="true">${avatarFallbackSvgForCommunity(comm.id)}</div>
        </div>
      `
      : `
        <div class="bw-comm-avatar" aria-hidden="true" style="background: rgba(0,0,0,0.18);">
          <div class="bw-comm-avatar-fallback" style="color:${escapeHtml(comm.color)}; border:none;">${avatarFallbackSvgForCommunity(comm.id)}</div>
        </div>
      `;

    a.innerHTML = `
      ${avatar}
      <div class="bw-comm-title">${escapeHtml(comm.name)}</div>
      <div class="bw-comm-border" style="background:${escapeHtml(comm.color)}"></div>
    `;

    li.appendChild(a);
    ul.appendChild(li);
  });
}

function selecionarComunidade(commId) {
  if (!state.communities.some((c) => c.id === commId)) return;
  state.activeCommunityId = commId;
  persistAll();

  renderSidebar();
  renderHeader(commId);
  renderPosts(commId);
  renderMessages(commId);
}



function renderHeader(commId) {
  const comm = getCommById(commId);
  const titleEl = document.getElementById('bw-chat-title');
  const descEl = document.getElementById('bw-chat-desc');
  const dot = document.getElementById('bw-theme-dot');
  const themeName = document.getElementById('bw-theme-name');

  if (!comm || !titleEl || !descEl) return;

  titleEl.textContent = comm.name;
  descEl.textContent = comm.desc;

  if (dot) dot.style.background = comm.color || '#3b82f6';
  if (themeName) themeName.textContent = comm.color ? comm.color.toUpperCase() : 'Tema';
}

function renderMessages(commId) {
  const box = document.getElementById('bw-chat-messages');

  if (!box) return;

  const list = state.messagesByCommunityId[commId] || [];
  box.innerHTML = '';

  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.style.textAlign = 'center';
    empty.style.opacity = '0.55';
    empty.style.padding = '40px 0';
    empty.style.fontFamily = 'Inter, sans-serif';
    empty.style.fontSize = '14px';
    empty.textContent = 'Comece o debate enviando uma mensagem.';
    box.appendChild(empty);
    return;
  }

  for (const msg of list) {
    box.appendChild(renderMessageCard(msg, commId));
  }

  // scroll bottom
  box.scrollTop = box.scrollHeight;
}

function renderMessageCard(msg, commId) {
  const card = document.createElement('article');
  card.className = 'bw-message';

  const isVoce = msg.author === 'Você';
  const initials = (msg.author || '?').trim().slice(0, 2).toUpperCase();
  const comm = getCommById(commId);
  const avatarBg = isVoce ? 'rgba(59,130,246,0.95)' : 'rgba(1,23,51,0.75)';

  const liked = !!msg.likedByMe;

  card.innerHTML = `
    <div class="bw-message-avatar" style="background:${escapeHtml(avatarBg)}">${escapeHtml(initials)}</div>
    <div class="bw-message-body">
      <div class="bw-message-top">
        <div class="bw-message-author" style="color:${isVoce ? '#f5f5dc' : 'var(--bw-soft)'}">${escapeHtml(msg.author)}</div>
        <div class="bw-message-time">${escapeHtml(msg.time || 'Agora')}</div>
      </div>
      <div class="bw-message-text">${escapeHtml(msg.text)}</div>
    <div class="bw-message-actions">
        <button class="bw-like-btn ${liked ? 'liked' : ''}" type="button" data-like-id="${escapeHtml(msg.id)}" aria-pressed="${liked}">
          <svg class="bw-heart" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span data-like-count="${escapeHtml(msg.id)}">${Number(msg.likesCount ?? 0)}</span>
        </button>
      </div>
    </div>
  `;

  const likeBtn = card.querySelector('button[data-like-id]');
  likeBtn.addEventListener('click', () => alternarLike(commId, msg.id));

  return card;
}

function alternarLike(commId, messageId) {
  const list = state.messagesByCommunityId[commId] || [];
  const m = list.find((x) => x.id === messageId);
  if (!m) return;

  const likedNow = !m.likedByMe;
  m.likedByMe = likedNow;
  m.likesCount = Math.max(0, Number(m.likesCount || 0) + (likedNow ? 1 : -1));

  state.likesByMessageId[messageId] = {
    likedByMe: m.likedByMe,
    likesCount: m.likesCount
  };

  persistAll();
  renderMessages(commId);
}

function setupMessageForm() {
  const form = document.getElementById('bw-message-form');
  const input = document.getElementById('bw-message-input');

  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const commId = state.activeCommunityId;
    if (!commId) return;

    if (!Array.isArray(state.messagesByCommunityId[commId])) {
      state.messagesByCommunityId[commId] = [];
    }

    const newMsg = {
      id: 'm_' + Date.now() + '_' + Math.random().toString(16).slice(2),
      author: 'Você',
      text,
      likesCount: 0,
      likedByMe: false,
      time: timeNowHHMM()
    };

    state.messagesByCommunityId[commId].push(newMsg);
    persistAll();

    input.value = '';
    renderMessages(commId);
  });
}

function setupCreateButton() {
  const btn = document.getElementById('btn-open-create');
  if (btn) {
    btn.addEventListener('click', () => {
      if (typeof window.abrirModal === 'function') window.abrirModal();
    });
  }
}

// =========================
// Função global exigida
// =========================

window.adicionarComunidade = function adicionarComunidade(comunidade) {

  const name = (comunidade?.name || '').trim();
  if (!name) return;

  const desc = (comunidade?.desc || '').trim();
  const color = (comunidade?.color || '#3b82f6').toString();
  const image = (comunidade?.image || '').toString();

  let id = slugFromName(name);
  if (!id) id = 'custom-' + Date.now();

  // Garante unicidade
  if (state.communities.some((c) => c.id === id)) {
    id = id + '-' + Math.floor(Math.random() * 900 + 100);
  }

  const nova = {
    id,
    name,
    desc: desc || 'Comunidade recém-criada no BookWay.',
    color,
    image
  };

  state.communities.push(nova);
  if (!Array.isArray(state.messagesByCommunityId[id])) state.messagesByCommunityId[id] = [];

  state.activeCommunityId = id;
  persistAll();

  renderSidebar();
  renderHeader(id);
  renderMessages(id);
};

// =========================
// Inicialização
// =========================

document.addEventListener('DOMContentLoaded', () => {
  loadAll();
  setupCreateButton();
  setupMessageForm();

  renderSidebar();
  renderHeader(state.activeCommunityId);
  renderPosts(state.activeCommunityId);
  renderMessages(state.activeCommunityId);
});

function getDefaultPostsForCommunity(commId) {
  // IMPORTANTE: comunidades personalizadas (criadas via modal) NÃO devem vir com posts padrão.
  // Detectamos isso pelo fato de que os seeds têm id fixo e os custom ids começam com `custom-`.
  if (!['star-wars', 'jujutsu-kaisen', 'leitura-comum', 'hellding', 'percy-jackson', 'jojo-bizarre-adventure'].includes(commId)) {
    return [];
  }

  // Cards style YouTube: thumbnail + título + descrição curta + enquete 2 opções.
  // As enquetes contam votos e persistem em state.pollsByPostId.
  const base = {
    star: {
      thumb: '../Site/imagens/DanDaDan.png',
      title: 'Qual foi o melhor momento em Star Wars?',
      a: 'A New Hope (começo épico)',
      b: 'The Empire Strikes Back (plot tenso)'
    },
    jj: {
      thumb: '../Site/imagens/SteelBallRun.png',
      title: 'Qual elemento do seu coração faz você continuar?',
      a: 'Amizade e lealdade',
      b: 'Ambição e evolução'
    },
    jk: {
      thumb: '../Site/imagens/HunterXHunter.png',
      title: 'Você prefere… combate ou estratégia?',
      a: 'Combate intenso',
      b: 'Estratégia e armadilhas'
    },
    lc: {
      thumb: '../Site/imagens/DomQuixote.png',
      title: 'Entre clássicos e lançamentos, o que te prende mais?',
      a: 'Clássicos (reler e debater)',
      b: 'Lançamentos (descobertas)'
    },

    hd: {
      thumb: '../Site/imagens/Hellsing.png',
      title: 'Qual aspecto te marcou mais em Hellsing?',
      a: 'Lore e atmosfera',
      b: 'Ação e ritmo'
    },
    pj: {
      thumb: '../Site/imagens/AttackOnTitan.png',
      title: 'Qual arco foi mais marcante pra você?',
      a: 'Intriga e construção',
      b: 'Reviravoltas e impacto'
    }
  };

  if (commId === 'star-wars') return [
    {
      postId: 'sw_post_1',
      author: 'Curador BookWay',
      thumb: base.star.thumb,
      title: base.star.title,
      subtitle: 'Vote e comente a sua escolha nos textos abaixo.',
      options: { A: base.star.a, B: base.star.b }
    }
  ];

  if (commId === 'jujutsu-kaisen') return [
    {
      postId: 'jk_post_1',
      author: 'Curador BookWay',
      thumb: base.jk.thumb,
      title: base.jk.title,
      subtitle: 'Vote: o debate rende mais com opinião específica.',
      options: { A: base.jk.a, B: base.jk.b }
    }
  ];

  if (commId === 'leitura-comum') return [
    {
      postId: 'lc_post_1',
      author: 'Curador BookWay',
      thumb: base.lc.thumb,
      title: base.lc.title,
      subtitle: 'Clássicos ou lançamentos? O que você sente mais hoje?',
      options: { A: base.lc.a, B: base.lc.b }
    }
  ];

  if (commId === 'hellding') return [
    {
      postId: 'hd_post_1',
      author: 'Curador BookWay',
      thumb: base.hd.thumb,
      title: base.hd.title,
      subtitle: 'Vote e traga um argumento do seu ponto favorito.',
      options: { A: base.hd.a, B: base.hd.b }
    }
  ];

  if (commId === 'percy-jackson') return [
    {
      postId: 'pj_post_1',
      author: 'Curador BookWay',
      thumb: base.pj.thumb,
      title: base.pj.title,
      subtitle: 'Vote e depois encontre nos comentários outros leitores.',
      options: { A: base.pj.a, B: base.pj.b }
    }
  ];

  if (commId === 'jojo-bizarre-adventure') return [
    {
      postId: 'jj_post_1',
      author: 'Curador BookWay',
      thumb: base.jj.thumb,
      title: base.jj.title,
      subtitle: 'Escolha uma opção e justifique com uma cena.',
      options: { A: base.jj.a, B: base.jj.b }
    }
  ];

  return [];
}


function getPollState(postId) {
  return state.pollsByPostId?.[postId] || { votes: { A: 0, B: 0 }, myChoice: '' };
}

function votarNoPost(postId, optionKey) {
  const poll = getPollState(postId);
  const option = optionKey === 'A' ? 'A' : 'B';

  if (poll.myChoice === option) {
    // permite des-votar? manter simples: impede voto repetido
    return;
  }

  // Se já votou em outra opção, transfere (subtrai da anterior)
  if (poll.myChoice && (poll.myChoice === 'A' || poll.myChoice === 'B')) {
    poll.votes[poll.myChoice] = Math.max(0, Number(poll.votes[poll.myChoice] || 0) - 1);
  }

  poll.votes[option] = Math.max(0, Number(poll.votes[option] || 0) + 1);
  poll.myChoice = option;

  state.pollsByPostId[postId] = poll;
  persistAll();

  renderPosts(state.activeCommunityId);
}

function renderPosts(commId) {
  const postsEmpty = document.getElementById('bw-posts-empty');
  const grid = document.getElementById('bw-posts-grid');
  if (!postsEmpty || !grid) return;

  const posts = getDefaultPostsForCommunity(commId);

  if (!posts || posts.length === 0) {
    postsEmpty.textContent = 'Sem posts disponíveis nesta comunidade.';
    postsEmpty.style.display = 'block';
    grid.style.display = 'none';
    grid.innerHTML = '';
    return;
  }

  postsEmpty.style.display = 'none';
  grid.style.display = 'grid';

  grid.innerHTML = '';

  for (const post of posts) {
    const poll = getPollState(post.postId);
    const votesA = Number(poll.votes?.A || 0);
    const votesB = Number(poll.votes?.B || 0);
    const total = Math.max(1, votesA + votesB);
    const pctA = Math.round((votesA / total) * 100);
    const pctB = Math.round((votesB / total) * 100);
    const myChoice = poll.myChoice || '';

    const card = document.createElement('article');

    card.innerHTML = `
      <div class="bw-post-thumb">
        <img src="${escapeHtml(post.thumb)}" alt="${escapeHtml(post.title)}" />
        <div class="bw-post-badge">Enquete</div>
      </div>
      <div class="bw-post-body">
        <div class="bw-post-title">${escapeHtml(post.title)}</div>
        <div class="bw-post-sub">${escapeHtml(post.subtitle || '')}</div>
        <div class="bw-poll">
          <button type="button" class="bw-poll-option ${myChoice === 'A' ? 'selected' : ''}" data-post-id="${escapeHtml(post.postId)}" data-option="A" aria-pressed="${myChoice === 'A'}">
            <span>${escapeHtml(post.options.A)}</span>
            <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono','Courier New', monospace; font-weight:900; color: rgba(245,245,220,0.9);">${pctA}%</span>
          </button>
          <div class="bw-poll-bar-wrap" aria-hidden="true"><div class="bw-poll-bar" style="width:${pctA}%;"></div></div>

          <button type="button" class="bw-poll-option ${myChoice === 'B' ? 'selected' : ''}" data-post-id="${escapeHtml(post.postId)}" data-option="B" aria-pressed="${myChoice === 'B'}">
            <span>${escapeHtml(post.options.B)}</span>
            <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono','Courier New', monospace; font-weight:900; color: rgba(245,245,220,0.9);">${pctB}%</span>
          </button>
          <div class="bw-poll-bar-wrap" aria-hidden="true"><div class="bw-poll-bar" style="background: rgba(245,158,11,1); width:${pctB}%;"></div></div>
        </div>
        <div class="bw-post-foot">Votos: A ${votesA} • B ${votesB}${myChoice ? ' • Você: ' + myChoice : ''}</div>
      </div>
    `;

    const optBtns = card.querySelectorAll('button[data-post-id][data-option]');
    optBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-post-id');
        const opt = btn.getAttribute('data-option');
        votarNoPost(pid, opt);
      });
    });

    grid.appendChild(card);
  }
}




// =========================
// Util: escape HTML
// =========================
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')

    .replaceAll('"', '"')

    .replaceAll("'", '&#039;');

}





