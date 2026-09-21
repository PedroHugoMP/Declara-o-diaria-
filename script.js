const photoFolder = "fotos";
const defaultPhotoCatalog = [
  "WhatsApp Image 2026-07-05 at 1.47.40 PM.jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.09 PM (1).jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.09 PM.jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM (1).jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM (2).jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM (3).jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM (4).jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM (5).jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM.jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.11 PM (1).jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.11 PM (2).jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.11 PM.jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.12 PM.jpeg",
  "WhatsApp Image 2026-07-30 at 4.24.13 PM.jpeg",
  "WhatsApp Image 2026-07-30 at 4.36.50 PM.jpeg",
  "WhatsApp Image 2026-07-30 at 4.37.26 PM.jpeg",
  "WhatsApp Image 2026-09-21 at 1.52.35 PM.jpeg",
  "WhatsApp Image 2026-09-21 at 1.53.39 PM (1).jpeg",
  "WhatsApp Image 2026-09-21 at 1.53.39 PM (2).jpeg",
  "WhatsApp Image 2026-09-21 at 1.53.39 PM.jpeg",
  "WhatsApp Image 2026-09-21 at 1.55.48 PM.jpeg",
  "WhatsApp Image 2026-09-21 at 1.55.49 PM (1).jpeg",
  "WhatsApp Image 2026-09-21 at 1.55.49 PM.jpeg"
];

function normalizePhotoCatalog(items) {
  const normalized = Array.isArray(items) ? items : [];
  return [...new Set(
    normalized
      .map((photo) => {
        if (typeof photo === "string") return photo.trim();
        if (photo && typeof photo === "object") return (photo.src || photo.url || photo.name || "").trim();
        return "";
      })
      .filter(Boolean)
  )];
}

const photoMessages = {
  "Foto.1.jpeg": "Porque seu abraço é o lugar onde encontro paz.",
  "Foto.2.jpeg": "Porque seu sorriso ilumina até os dias mais cinzentos.",
  "Foto.3.jpeg": "Porque sua presença faz o mundo parecer mais bonito.",
  "Foto.4.jpeg": "Porque você torna meus momentos especiais em memórias preciosas.",
  "Foto.5.jpeg": "Porque a sua voz me acalma como nenhuma outra.",
  "Foto.6.jpeg": "Porque eu amo a forma como você cuida do meu coração.",
  "Foto.7.jpeg": "Porque você transforma carinho em algo quase mágico.",
  "Foto.8.jpeg": "Porque seu jeito me faz sentir em casa.",
  "Foto.9.jpeg": "Porque cada conversa sua me aproxima de você.",
  "Foto.10.jpeg": "Porque seu amor é a minha música favorita.",
  "Foto.11.jpeg": "Porque eu nunca canso de te admirar.",
  "Foto.12.jpeg": "Porque você é a razão dos meus melhores sentimentos.",
  "Foto.13.jpeg": "Porque seu olhar transmite tudo o que meu coração sente.",
  "Foto.14.jpeg": "Porque você me ensina a amar com mais leveza.",
  "Foto.15.jpeg": "Porque o seu carinho me faz crescer cada dia mais.",
  "Foto.16.jpeg": "Porque esses eram apenas 30 motivos... e eu ainda tenho milhares para te dizer."
};

const dailyMessagePool = [
  "Você me fez sentir coisas que jamais senti antes, marejar meus olhos só com a beleza de tua palavra!",
  "Sempre manterei vivo o sentimento de te conhecer pois sempre que te encontro descubro que a vida pode ser um pouco mais bela!",
  "Com você não tenho medo de ter o amor que queima, com você o fogo cura e cauteriza onde não sabia que estava ferido!",
  "A fronteira do destino sempre esteve entre nós e ao cair percebi que sempre estive a sua espera pois sinto que te conheço como se fosse parte minha!",
  "A distância é cruel, maltrata-me, porém, ao derrotá-la sei que viverei algo que jamais será vivenciado em qualquer idealização já feita, pois, meu ideal estará ao meu lado todos os dias!",
  "O calor de tua palavra me aquece a alma, a deixa viva, acreditando que poderá ocorrer um futuro, um amanhã melhor que o hoje!",
  "Minha melhor versão é ao teu lado, ao teu lado me sinto completo, a vida não me pesa, o amanhã não me assusta!"
];

const state = {
  selectedPhoto: null,
  history: [],
  messageHistory: []
};

let activeHearts = 0;
let albumPhotoCatalog = defaultPhotoCatalog;
let albumPhotoAssignments = new Map();
let albumPageIndex = 0;
let albumIsFlipping = false;
let albumLastFocusedElement = null;
let albumPressTimer = null;
let albumLongPressActive = false;
let albumPressImage = null;
let albumZoomImage = null;
let albumZoomParent = null;
let albumZoomNextSibling = null;
let albumEmojiTimer = null;

const elements = {
  dayLabel: document.getElementById("day-label"),
  reasonTitle: document.getElementById("reason-title"),
  reasonText: document.getElementById("reason-text"),
  counter: document.getElementById("counter"),
  dateBadge: document.getElementById("date-badge"),
  photo: document.getElementById("photo"),
  themeToggle: document.getElementById("theme-toggle"),
  specialTitle: document.getElementById("special-title"),
  specialText: document.getElementById("special-text"),
  heartLayer: document.getElementById("heart-layer"),
  canvas: document.getElementById("bg-canvas")
};

const albumElements = {
  modal: document.getElementById("album-modal"),
  book: document.getElementById("album-book"),
  cover: document.querySelector(".album-cover"),
  spread: document.getElementById("album-spread"),
  openButton: document.getElementById("open-album-btn"),
  closeButton: document.getElementById("album-close-btn"),
  restartButton: document.getElementById("album-restart-btn"),
  previousButton: document.getElementById("album-prev-btn"),
  nextButton: document.getElementById("album-next-btn"),
  indicator: document.getElementById("album-page-indicator"),
  emojiLayer: document.getElementById("album-emoji-layer")
};

const albumPages = [
  {
    type: "spread",
    left: {
      layout: "intro",
      eyebrow: "I",
      title: "PEDRO & CAIO",
      text: "Duas pessoas, um caminho e uma história que continua escolhendo ficar.",
      label: "JUNTOS HA",
      counter: true
    },
    right: {
      layout: "letter",
      title: "Para Caio,",
      paragraphs: [
        "Prâna, a energia divina que orienta o homem, que o mantém de pé, não acredito no além mas o mais perto que cheguei dele foi por você.",
        "Entre músicas e conversas conheci a força que me movimenta.",
        "Obrigado por ser minha Prâna."
      ],
      image: 0,
      date: "30.05.2026",
      signature: "Com amor, Pedro"
    }
  },
  {
    type: "spread",
    left: {
      layout: "photo-feature",
      eyebrow: "II",
      title: "O primeiro brilho",
      text: "Aquele tipo de instante que parece pequeno, mas muda o desenho inteiro dos dias.",
      image: 1,
      caption: "um instante guardado"
    },
    right: {
      layout: "photo-poster",
      eyebrow: "III",
      title: "Brilhando juntos",
      text: "Quando a gente se encontra, até o espelho vira testemunha.",
      image: 2,
      caption: "a nossa melhor versao"
    }
  },
  {
    type: "spread",
    left: {
      layout: "collage",
      eyebrow: "IV",
      title: "Entre risos e planos",
      text: "A vida fica mais bonita quando tem uma pessoa para dividir os detalhes.",
      images: [3, 4, 5]
    },
    right: {
      layout: "quote",
      title: "O amor mora nos detalhes",
      quote: "Não foi um momento grandioso. Foi a soma delicada de todos eles.",
      detail: "Conversas longas. Olhares demorados. A vontade de contar tudo.",
      image: 6
    }
  },
  {
    type: "spread",
    left: {
      layout: "star-map",
      eyebrow: "V",
      title: "Alinhamento Milenar",
      text: "Três Rios, RJ, Brasil",
      date: "30 de maio de 2026",
      coordinates: "22° 07' 45\" S  |  43° 12' 28\" W",
      image: "Constelação.jpeg"
    },
    right: {
      layout: "memory",
      eyebrow: "VI",
      title: "A nossa constelação",
      text: "Em algum ponto entre uma música e outra, o universo fez a gentileza de cruzar nossos caminhos.",
      image: 7,
      caption: "um ceu so nosso"
    }
  },
  {
    type: "spread",
    left: {
      layout: "photo-full",
      eyebrow: "VII",
      title: "Um momento que o tempo parou",
      image: 8,
      caption: "e eu escolheria de novo"
    },
    right: {
      layout: "note",
      title: "Para guardar",
      text: "Que a gente nunca perca a curiosidade de descobrir o outro de novo. Há sempre uma nova página esperando por nós.",
      label: "NOTA DE RODAPE",
      detail: "feito de memoria, musica e presenca"
    }
  },
  {
    type: "spread",
    left: {
      layout: "polaroid",
      eyebrow: "VIII",
      title: "Pequenas provas",
      text: "O amor também é lembrar da foto, do lugar e da piada que ninguém mais entenderia.",
      image: 10,
      caption: "so a gente entende"
    },
    right: {
      layout: "photo-feature",
      eyebrow: "IX",
      title: "A caminho do sempre",
      text: "Ainda temos muitos lugares para conhecer e tantas páginas para preencher.",
      image: 11,
      caption: "proximo capitulo"
    }
  },
  {
    type: "spread",
    left: {
      layout: "letter",
      eyebrow: "X",
      title: "Uma promessa simples",
      paragraphs: [
        "Eu prometo prestar atenção nos seus detalhes.",
        "Celebrar suas pequenas vitórias e ficar por perto nos dias difíceis.",
        "Prometo continuar escolhendo você."
      ],
      signature: "Sempre seu"
    },
    right: {
      layout: "photo-feature",
      eyebrow: "XI",
      title: "Mil motivos depois",
      text: "Esses eram apenas alguns motivos. O resto a gente escreve vivendo.",
      image: 13,
      caption: "continua..."
    }
  },
  {
    type: "spread",
    left: {
      layout: "closing",
      eyebrow: "XII",
      title: "Para sempre",
      text: "A nossa história não cabe num álbum só. Ainda bem.",
      counter: true
    },
    right: {
      layout: "photo-final",
      title: "Pedro & Caio",
      text: "O melhor ainda esta sendo escrito.",
      image: 15,
      caption: "fim? nunca."
    }
  }
];

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function resolvePhotoUrl(photo) {
  if (!photo) return "";
  if (/^https?:\/\//i.test(photo) || photo.startsWith("data:")) {
    return photo;
  }
  return `${photoFolder}/${encodeURIComponent(photo)}`;
}

function getDaysTogether() {
  const start = new Date(2026, 4, 30);
  const today = new Date();
  const diff = today - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getSpecialMessage(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dayMonth = `${day}/${month}`;
  const specials = {
    "01/01": { title: "Ano Novo", text: "Um novo ciclo, o mesmo amor, mais profundo e bonito." },
    "14/02": { title: "Dia dos Namorados", text: "Hoje é o dia perfeito para celebrar o amor com carinho e ternura." },
    "30/05": { title: "Aniversário de namoro", text: "Mais um dia para lembrar o quanto nossa história é especial." },
    "25/12": { title: "Natal", text: "Que a magia do Natal seja só mais um motivo para lembrar do seu amor." },
    "01": { title: "Primeiro dia do mês", text: "Hoje completa mais um mês da nossa primeira troca de olhares" },
    "30": { title: "Dia 30", text: "Hoje completa mais um de muitos meses que comemoraremos nosso aniversario." }
  };

  if (day === "01") {
    return specials["01"];
  }

  if (day === "30") {
    return specials["30"];
  }

  return specials[dayMonth] || null;
}

function loadTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
  elements.themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
}

function saveTheme(theme) {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
  elements.themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
}

function ensureInitialState() {
  if (!localStorage.getItem("lastDate")) {
    localStorage.setItem("lastDate", "");
  }
  if (!localStorage.getItem("selectedPhoto")) {
    localStorage.setItem("selectedPhoto", "");
  }
  if (!localStorage.getItem("photoHistory")) {
    localStorage.setItem("photoHistory", "[]");
  }
  if (!localStorage.getItem("messageHistory")) {
    localStorage.setItem("messageHistory", "[]");
  }
}

async function loadPhotoCatalog() {
  try {
    const response = await fetch(`${photoFolder}/photos.json`, { cache: "no-store" });
    if (!response.ok) throw new Error("manifest unavailable");
    const data = await response.json();
    const mergedCatalog = normalizePhotoCatalog([
      ...defaultPhotoCatalog,
      ...(Array.isArray(data.photos) ? data.photos : [])
    ]);

    if (mergedCatalog.length > 0) {
      return mergedCatalog;
    }
  } catch (error) {
    return normalizePhotoCatalog(defaultPhotoCatalog);
  }

  return normalizePhotoCatalog(defaultPhotoCatalog);
}

async function getPhotoSelection() {
  const todayKey = formatDateKey(new Date());
  const savedDate = localStorage.getItem("lastDate");
  const savedPhoto = localStorage.getItem("selectedPhoto");
  const history = JSON.parse(localStorage.getItem("photoHistory") || "[]");
  const photoCatalog = await loadPhotoCatalog();

  if (savedDate === todayKey && savedPhoto && photoCatalog.includes(savedPhoto)) {
    state.selectedPhoto = savedPhoto;
    state.history = history;
    return photoCatalog;
  }

  const remaining = photoCatalog.filter((photo) => !history.includes(photo));
  let nextPhoto;

  if (remaining.length === 0) {
    state.history = [];
    nextPhoto = photoCatalog[Math.floor(Math.random() * photoCatalog.length)];
  } else {
    nextPhoto = remaining[Math.floor(Math.random() * remaining.length)];
  }

  state.selectedPhoto = nextPhoto;
  state.history = [...history, nextPhoto];
  localStorage.setItem("lastDate", todayKey);
  localStorage.setItem("selectedPhoto", nextPhoto);
  localStorage.setItem("photoHistory", JSON.stringify(state.history));
  return photoCatalog;
}

function getMessageForToday() {
  const today = new Date();
  const special = getSpecialMessage(today);
  if (special) {
    return special.text;
  }

  const storedMessages = JSON.parse(localStorage.getItem("messageHistory") || "[]");
  const allAvailableMessages = [...new Set([...Object.values(photoMessages), ...dailyMessagePool])];
  const preferredMessage = photoMessages[state.selectedPhoto] || allAvailableMessages[Math.floor(Math.random() * allAvailableMessages.length)];
  const recentMessages = storedMessages.filter((entry) => {
    const entryDate = new Date(entry.date);
    const diffDays = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 15;
  });

  const availableMessages = allAvailableMessages.filter((message) => !recentMessages.some((entry) => entry.message === message));
  let currentMessage = preferredMessage;

  if (recentMessages.some((entry) => entry.message === currentMessage)) {
    currentMessage = availableMessages.find((message) => message !== currentMessage) || preferredMessage;
  }

  if (availableMessages.length > 0 && !availableMessages.includes(currentMessage)) {
    currentMessage = availableMessages[0];
  }

  storedMessages.push({ date: today.toISOString(), message: currentMessage });
  localStorage.setItem("messageHistory", JSON.stringify(storedMessages));
  return currentMessage;
}

function renderReason() {
  const today = new Date();
  const todayText = today.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const specialMessage = getSpecialMessage(today);
  const todayMessage = getMessageForToday();

  if (specialMessage) {
    elements.reasonTitle.textContent = specialMessage.text;
    elements.reasonText.textContent = specialMessage.title;
  } else {
    elements.reasonTitle.textContent = todayMessage;
    elements.reasonText.textContent = "Mensagem do dia";
  }

  elements.counter.textContent = `Estamos juntos há ❤️ ${getDaysTogether()} dias ❤️`;
  elements.dateBadge.textContent = `Hoje • ${todayText}`;
  elements.dayLabel.textContent = "Hoje";

  const image = new Image();
  const fallbackPhoto = defaultPhotoCatalog.find((photo) => typeof photo === "string" && !/^https?:\/\//i.test(photo) && !photo.startsWith("data:")) || defaultPhotoCatalog[0];
  const fallbackUrl = resolvePhotoUrl(fallbackPhoto);
  const selectedUrl = resolvePhotoUrl(state.selectedPhoto);

  image.onload = () => {
    elements.photo.classList.add("is-fading");
    setTimeout(() => {
      elements.photo.src = image.src;
      elements.photo.alt = `Foto do dia ${state.selectedPhoto}`;
      elements.photo.classList.remove("is-fading");
    }, 180);
  };

  image.onerror = () => {
    if (image.src !== fallbackUrl) {
      image.src = fallbackUrl;
      return;
    }

    elements.photo.src = fallbackUrl;
    elements.photo.alt = "Foto do dia indisponível";
    elements.photo.classList.remove("is-fading");
  };

  image.src = selectedUrl;

  if (elements.specialTitle && elements.specialText) {
    if (specialMessage) {
      elements.specialTitle.textContent = specialMessage.title;
      elements.specialText.textContent = specialMessage.text;
    } else {
      elements.specialTitle.textContent = "Mensagem especial";
      elements.specialText.textContent = "Esses eram apenas 30 motivos... mas eu poderia passar a vida inteira encontrando novos motivos para amar você.";
    }
  }
}

function createHeartBurst(x, y) {
  const symbols = ["💖", "💗", "❤️", "💘", "💝", "💞"];
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const burstCount = prefersReducedMotion
    ? 8
    : isMobile
      ? 10 + Math.floor(Math.random() * 4)
      : 16 + Math.floor(Math.random() * 6);
  const maxConcurrentHearts = 72;
  const heartsToCreate = Math.min(burstCount, Math.max(0, maxConcurrentHearts - activeHearts));

  if (heartsToCreate <= 0) {
    return;
  }

  const fragment = document.createDocumentFragment();
  const originX = Math.min(Math.max(x, 24), viewportWidth - 24);
  const originY = Math.min(Math.max(y, 24), viewportHeight - 24);
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;

  for (let index = 0; index < heartsToCreate; index += 1) {
    const heart = document.createElement("span");
    heart.className = "heart-burst";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const angle = (Math.PI * 2 * index) / heartsToCreate + (Math.random() - 0.5) * 0.45;
    const spread = isMobile ? 0.7 + Math.random() * 0.16 : 0.8 + Math.random() * 0.16;
    const offsetX = Math.cos(angle) * viewportWidth * spread * 0.44;
    const offsetY = Math.sin(angle) * viewportHeight * spread * 0.44;
    const driftX = (Math.random() - 0.5) * (isMobile ? 440 : 560);
    const driftY = (Math.random() - 0.5) * (isMobile ? 440 : 560);
    const size = isMobile ? 0.8 + Math.random() * 0.7 : 0.9 + Math.random() * 0.8;
    const duration = 1.2 + Math.random() * 0.7;
    const opacity = 0.4 + Math.random() * 0.35;

    const startX = Math.min(Math.max(originX + offsetX, 12), viewportWidth - 28);
    const startY = Math.min(Math.max(originY + offsetY, 12), viewportHeight - 28);

    heart.style.left = `${startX}px`;
    heart.style.top = `${startY}px`;
    heart.style.fontSize = `${size}rem`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.opacity = `${opacity}`;
    heart.style.setProperty("--drift-x", `${driftX}px`);
    heart.style.setProperty("--drift-y", `${driftY}px`);
    heart.style.setProperty("--rotate", `${(Math.random() - 0.5) * 45}deg`);
    heart.style.setProperty("--scale-start", `${0.7 + Math.random() * 0.2}`);
    heart.style.setProperty("--scale-end", `${1.05 + Math.random() * 0.2}`);

    fragment.appendChild(heart);
    activeHearts += 1;

    window.setTimeout(() => {
      if (heart.isConnected) {
        heart.remove();
      }
      activeHearts = Math.max(0, activeHearts - 1);
    }, duration * 1000 + 140);
  }

  elements.heartLayer.appendChild(fragment);
}

function initMusicPlayer() {
  const audio = document.getElementById("couple-audio");
  const playButton = document.getElementById("spotify-play-btn");
  if (!audio) return;
  audio.muted = true;

  const iframe = document.getElementById("spotify-embed");
  const tracks = {
    home: "Musicas/Por%20Voc%C3%AA.mp3",
    album: "Musicas/Alinhamento%20Milenar.mp3"
  };

  function playTrack(track) {
    if (!audio.src.endsWith(track)) {
      audio.src = track;
      audio.load();
    }
    audio.play().catch(() => {});
  }

  window.playAlbumTrack = () => {
    audio.muted = false;
    playTrack(tracks.album);
  };
  playTrack(tracks.home);
  window.playPhotoTrack = () => {
    audio.muted = false;
    audio.volume = 1;
    audio.play().catch(() => {});
  };

  if (playButton) {
    playButton.addEventListener("click", () => {
      const playlistUrl = "https://open.spotify.com/playlist/1llw3TDJxgIloAVXuGzLNA?si=e91c393fca2c4416";
      window.open(playlistUrl, "_blank", "noopener,noreferrer");
    });
  }

  if (iframe) {
    const baseSrc = iframe.getAttribute("src") || "";
    const autoplaySrc = baseSrc.includes("autoplay=")
      ? baseSrc.replace(/autoplay=[^&]+/, "autoplay=1")
      : `${baseSrc}${baseSrc.includes("?") ? "&" : "?"}autoplay=1`;
    iframe.setAttribute("src", autoplaySrc);
  }
}

function attachInteractions() {
  elements.photo.addEventListener("click", (event) => {
    const rect = elements.photo.getBoundingClientRect();
    window.playPhotoTrack?.();
    createHeartBurst(event.clientX, event.clientY);
  });

  document.addEventListener("mousemove", (event) => {
    document.body.style.setProperty("--pointer-x", `${event.clientX}px`);
    document.body.style.setProperty("--pointer-y", `${event.clientY}px`);
  });

  elements.themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    saveTheme(nextTheme);
  });

  setInterval(async () => {
    const now = new Date();
    const storedDate = localStorage.getItem("lastDate");
    if (storedDate !== formatDateKey(now)) {
      localStorage.removeItem("selectedPhoto");
      localStorage.removeItem("lastDate");
      await getPhotoSelection();
      renderReason();
    }
  }, 60000);
}

function initParticles() {
  const ctx = elements.canvas.getContext("2d");
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    size: Math.random() * 2.2 + 0.6,
    alpha: Math.random() * 0.6 + 0.2
  }));

  let pointer = { x: null, y: null };
  document.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  const resize = () => {
    elements.canvas.width = window.innerWidth;
    elements.canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resize);
  resize();

  const animate = () => {
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (pointer.x && pointer.y) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          particle.x -= dx / 220;
          particle.y -= dy / 220;
        }
      }

      if (particle.x < -20 || particle.x > elements.canvas.width + 20) particle.vx *= -1;
      if (particle.y < -20 || particle.y > elements.canvas.height + 20) particle.vy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 145, 218, ${particle.alpha})`;
      ctx.fill();

      for (let j = index + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < 90) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - distance / 90)})`;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  };

  animate();
}

function getAlbumPhoto(photoReference) {
  if (albumPhotoAssignments.has(photoReference)) {
    return albumPhotoAssignments.get(photoReference);
  }
  if (typeof photoReference === "number") {
    return albumPhotoCatalog[photoReference] || defaultPhotoCatalog[photoReference] || "";
  }
  return photoReference || "";
}

function shuffleAlbumPhotos(photos) {
  const shuffled = [...photos];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function collectAlbumPhotoReferences(page) {
  const references = [];
  const collect = (panel) => {
    if (panel.image !== undefined) references.push(panel.image);
    if (Array.isArray(panel.images)) references.push(...panel.images);
  };
  collect(page.left);
  collect(page.right);
  return references;
}

function prepareAlbumPhotos() {
  albumPhotoAssignments = new Map();
  const fixedReferences = new Set();
  const fixedPageIndexes = new Set([5, 6, 7]);

  albumPages.forEach((page, pageIndex) => {
    if (fixedPageIndexes.has(pageIndex)) {
      collectAlbumPhotoReferences(page).forEach((reference) => fixedReferences.add(reference));
    }
  });

  const fixedPhotos = new Set([...fixedReferences].map((reference) => {
    if (typeof reference === "number") return albumPhotoCatalog[reference];
    return reference;
  }).filter(Boolean));
  const availablePhotos = shuffleAlbumPhotos(albumPhotoCatalog.filter((photo) => !fixedPhotos.has(photo)));
  let nextPhotoIndex = 0;

  albumPages.forEach((page, pageIndex) => {
    if (fixedPageIndexes.has(pageIndex)) return;
    collectAlbumPhotoReferences(page).forEach((reference) => {
      if (typeof reference === "string") return;
      if (!albumPhotoAssignments.has(reference)) {
        const nextPhoto = availablePhotos[nextPhotoIndex % availablePhotos.length];
        albumPhotoAssignments.set(reference, nextPhoto || albumPhotoCatalog[0] || "");
        nextPhotoIndex += 1;
      }
    });
  });
}

function albumImageMarkup(photoReference, alt, className = "") {
  const photo = getAlbumPhoto(photoReference);
  if (!photo) {
    return `<div class="album-photo-placeholder ${className}" role="img" aria-label="Fotografia ainda nao adicionada"><span>✦</span><small>fotografia em breve</small></div>`;
  }

  return `<div class="album-photo-wrap ${className}"><img data-album-image src="${resolvePhotoUrl(photo)}" alt="${alt}" loading="lazy" /></div>`;
}

function renderAlbumPanel(page, side) {
  const image = page.image !== undefined ? albumImageMarkup(page.image, page.title || "Memoria do album") : "";
  const counter = page.counter ? `<strong class="album-counter">${getDaysTogether()} <span>dias</span></strong>` : "";
  const eyebrow = page.eyebrow ? `<span class="album-page-eyebrow">${page.eyebrow}</span>` : "";
  const paragraphs = page.paragraphs ? page.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("") : "";
  const title = page.title ? `<h3>${page.title}</h3>` : "";
  const text = page.text ? `<p class="album-page-text">${page.text}</p>` : "";
  let content = "";

  switch (page.layout) {
    case "intro":
      content = `${eyebrow}${title}${text}<span class="album-rule"></span><span class="album-label">${page.label}</span>${counter}<span class="album-doodle">♡</span>`;
      break;
    case "letter":
      content = `${eyebrow}<div class="album-letter-heading">${title}</div><div class="album-letter-copy">${paragraphs}</div>${image}<span class="album-date">${page.date || ""}</span><span class="album-signature">${page.signature || ""}</span><span class="album-stamp">♡</span>`;
      break;
    case "photo-feature":
      content = `${eyebrow}${title}${image}<span class="album-caption">${page.caption || ""}</span>${text}`;
      break;
    case "photo-poster":
      content = `${eyebrow}${image}<div class="album-poster-title">${title}</div><span class="album-caption">${page.caption || ""}</span>${text}`;
      break;
    case "collage":
      content = `${eyebrow}${title}${text}<div class="album-collage">${(page.images || []).map((photo, index) => albumImageMarkup(photo, `Fotografia da memoria ${index + 1}`)).join("")}</div>`;
      break;
    case "quote":
      content = `<span class="album-quote-mark">“</span>${title}<blockquote>${page.quote || ""}</blockquote><p class="album-page-text">${page.detail || ""}</p>${image}`;
      break;
    case "star-map":
      content = `${eyebrow}${title}${text}<div class="album-star-map album-star-map--photo" aria-label="Fotografia da constelacao">${albumImageMarkup(page.image, "Fotografia da constelacao")}</div><span class="album-date">${page.date || ""}</span><span class="album-coordinates">${page.coordinates || ""}</span>`;
      break;
    case "memory":
      content = `${eyebrow}${title}${image}<span class="album-caption">${page.caption || ""}</span>${text}`;
      break;
    case "photo-full":
      content = `${eyebrow}${title}${image}<span class="album-caption">${page.caption || ""}</span>`;
      break;
    case "note":
      content = `<span class="album-note-line"></span>${title}${text}<span class="album-rule"></span><span class="album-label">${page.label || ""}</span><small class="album-note-detail">${page.detail || ""}</small>`;
      break;
    case "polaroid":
      content = `${eyebrow}${title}${text}<div class="album-polaroid">${image}<span>${page.caption || ""}</span></div>`;
      break;
    case "closing":
      content = `${eyebrow}${title}${text}<span class="album-closing-heart">♥</span>${counter}<span class="album-label">a historia continua</span>`;
      break;
    case "photo-final":
      content = `<div class="album-final-copy">${title}${text}</div>${image}<span class="album-caption">${page.caption || ""}</span>`;
      break;
    default:
      content = `${eyebrow}${title}${text}${image}`;
  }

  return `<article class="album-page album-page--${side} album-layout-${page.layout || "default"}">${content}</article>`;
}

function renderAlbum() {
  if (!albumElements.spread || !albumElements.modal) return;
  const isCover = albumPageIndex === 0;
  const spread = albumPages[albumPageIndex - 1];

  albumElements.modal.classList.toggle("is-cover", isCover);
  albumElements.book.classList.toggle("is-open", !isCover);
  albumElements.cover.setAttribute("aria-hidden", String(!isCover));
  albumElements.spread.setAttribute("aria-hidden", String(isCover));
  albumElements.spread.innerHTML = spread
    ? `${renderAlbumPanel(spread.left, "left")}${renderAlbumPanel(spread.right, "right")}`
    : "";
  albumElements.indicator.textContent = isCover ? "Capa" : `${albumPageIndex} / ${albumPages.length}`;
  albumElements.previousButton.disabled = albumPageIndex === 0;
  albumElements.nextButton.disabled = albumPageIndex === albumPages.length;

  albumElements.spread.querySelectorAll("[data-album-image]").forEach((image) => {
    image.addEventListener("error", () => {
      console.error("Album: imagem nao encontrada", image.src);
      const placeholder = document.createElement("div");
      placeholder.className = "album-photo-placeholder album-photo-fallback";
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute("aria-label", "Fotografia indisponivel");
      placeholder.innerHTML = "<span>♡</span><small>memoria em revelacao</small>";
      image.parentElement.replaceWith(placeholder);
    }, { once: true });
  });
}

function saveAlbumState() {
  localStorage.setItem("albumLastPage", String(albumPageIndex));
}

function loadAlbumState() {
  const savedPage = Number.parseInt(localStorage.getItem("albumLastPage") || "0", 10);
  return Number.isInteger(savedPage) && savedPage >= 0 && savedPage <= albumPages.length ? savedPage : 0;
}

function goToAlbumPage(nextPage, direction = "forward") {
  if (albumIsFlipping || nextPage < 0 || nextPage > albumPages.length || nextPage === albumPageIndex) return;
  albumIsFlipping = true;
  albumElements.book.classList.toggle("flip-backward", direction === "backward");
  albumElements.book.classList.add("is-flipping");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.setTimeout(() => {
    albumPageIndex = nextPage;
    saveAlbumState();
    renderAlbum();
    albumElements.book.classList.remove("is-flipping", "flip-backward");
    albumIsFlipping = false;
  }, reducedMotion ? 40 : 720);
}

function nextAlbumPage() {
  goToAlbumPage(Math.min(albumPages.length, albumPageIndex + 1), "forward");
}

function previousAlbumPage() {
  goToAlbumPage(Math.max(0, albumPageIndex - 1), "backward");
}

function openAlbum() {
  if (!albumElements.modal) return;
  window.playAlbumTrack?.();
  albumLastFocusedElement = document.activeElement;
  albumPageIndex = loadAlbumState();
  renderAlbum();
  albumElements.modal.classList.add("is-visible");
  albumElements.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("album-open");
  startAlbumEmojis();
  window.setTimeout(() => albumElements.book.focus(), 40);
}

function closeAlbum() {
  if (!albumElements.modal) return;
  albumElements.modal.classList.remove("is-visible");
  albumElements.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("album-open");
  stopAlbumEmojis();
  if (albumLastFocusedElement && typeof albumLastFocusedElement.focus === "function") {
    albumLastFocusedElement.focus();
  }
}

function createAlbumEmoji() {
  if (!albumElements.emojiLayer || !albumElements.modal.classList.contains("is-visible")) return;
  const symbols = ["♥", "♡", "❤", "💖", "💗", "💞", "✦", "✧"];
  const emoji = document.createElement("span");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reducedMotion ? 4.8 : 3.8 + Math.random() * 3.2;

  emoji.className = "album-floating-emoji";
  emoji.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  emoji.style.left = `${4 + Math.random() * 92}%`;
  emoji.style.fontSize = `${0.8 + Math.random() * 0.85}rem`;
  emoji.style.animationDuration = `${duration}s`;
  emoji.style.setProperty("--emoji-drift", `${(Math.random() - 0.5) * 130}px`);
  emoji.style.setProperty("--emoji-rotate", `${(Math.random() - 0.5) * 35}deg`);
  albumElements.emojiLayer.appendChild(emoji);
  window.setTimeout(() => emoji.remove(), duration * 1000 + 200);
}

function startAlbumEmojis() {
  if (albumEmojiTimer || !albumElements.emojiLayer) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  createAlbumEmoji();
  albumEmojiTimer = window.setInterval(createAlbumEmoji, reducedMotion ? 1300 : 620);
}

function stopAlbumEmojis() {
  if (albumEmojiTimer) {
    window.clearInterval(albumEmojiTimer);
    albumEmojiTimer = null;
  }
  albumElements.emojiLayer?.replaceChildren();
}

function openAlbumLightbox(image) {
  if (!albumElements.modal) return;
  albumZoomImage = image;
  albumZoomParent = image.parentElement;
  albumZoomNextSibling = image.nextSibling;
  albumZoomParent?.classList.add("is-photo-zoomed");
  albumElements.modal.classList.add("album-photo-zooming");
  document.body.classList.add("album-photo-zooming");
  document.body.appendChild(image);
  image.classList.add("is-zoomed");
}

function closeAlbumLightbox() {
  if (albumZoomImage) {
    albumZoomImage.classList.remove("is-zoomed");
    if (albumZoomParent) {
      if (albumZoomNextSibling && albumZoomNextSibling.parentNode === albumZoomParent) {
        albumZoomParent.insertBefore(albumZoomImage, albumZoomNextSibling);
      } else {
        albumZoomParent.appendChild(albumZoomImage);
      }
      albumZoomParent.classList.remove("is-photo-zoomed");
    }
    albumZoomImage = null;
    albumZoomParent = null;
    albumZoomNextSibling = null;
  }
  albumElements.modal.classList.remove("album-photo-zooming");
  document.body.classList.remove("album-photo-zooming");
}

function startAlbumPhotoPress(image) {
  if (albumPressTimer) {
    window.clearTimeout(albumPressTimer);
  }

  albumLongPressActive = false;
  albumPressImage = image;
  albumPressTimer = window.setTimeout(() => {
    albumLongPressActive = true;
    openAlbumLightbox(image);
  }, 420);
}

function endAlbumPhotoPress() {
  if (albumPressTimer) {
    window.clearTimeout(albumPressTimer);
    albumPressTimer = null;
  }

  if (albumLongPressActive) {
    albumLongPressActive = false;
    closeAlbumLightbox();
  }

  albumPressImage = null;
}

function initAlbum(photoCatalog) {
  if (!albumElements.modal) return;
  albumPhotoCatalog = Array.isArray(photoCatalog) && photoCatalog.length ? photoCatalog : defaultPhotoCatalog;
  prepareAlbumPhotos();
  albumPageIndex = 0;
  renderAlbum();

  albumElements.openButton.addEventListener("click", openAlbum);
  albumElements.closeButton.addEventListener("click", closeAlbum);
  albumElements.previousButton.addEventListener("click", previousAlbumPage);
  albumElements.nextButton.addEventListener("click", nextAlbumPage);
  albumElements.restartButton.addEventListener("click", () => {
    albumPageIndex = 0;
    saveAlbumState();
    renderAlbum();
  });
  albumElements.cover.addEventListener("click", nextAlbumPage);
  albumElements.spread.addEventListener("pointerdown", (event) => {
    const image = event.target.closest("[data-album-image]");
    if (!image) return;
    event.preventDefault();
    try {
      image.setPointerCapture?.(event.pointerId);
    } catch (error) {
      return startAlbumPhotoPress(image);
    }
    startAlbumPhotoPress(image);
  });
  albumElements.spread.addEventListener("pointerup", (event) => {
    if (event.target.closest("[data-album-image]")) endAlbumPhotoPress();
  });
  albumElements.spread.addEventListener("pointercancel", endAlbumPhotoPress);
  albumElements.spread.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && !albumLongPressActive) endAlbumPhotoPress();
  });
  albumElements.spread.addEventListener("click", (event) => {
    const image = event.target.closest("[data-album-image]");
    if (image) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.target.closest(".album-page--left")) previousAlbumPage();
    if (event.target.closest(".album-page--right")) nextAlbumPage();
  });
  albumElements.modal.addEventListener("click", (event) => {
    if (event.target.dataset.albumClose === "true") closeAlbum();
  });
  document.addEventListener("keydown", (event) => {
    if (albumZoomImage) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAlbumLightbox();
      }
      return;
    }
    if (!albumElements.modal.classList.contains("is-visible")) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextAlbumPage();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousAlbumPage();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeAlbum();
    }
  });
  document.addEventListener("pointerup", (event) => {
    if (albumPressImage) {
      endAlbumPhotoPress();
    }
  });
  document.addEventListener("pointercancel", endAlbumPhotoPress);
}

async function init() {
  ensureInitialState();
  loadTheme();
  const photoCatalog = await getPhotoSelection();
  renderReason();
  initMusicPlayer();
  attachInteractions();
  initParticles();
  initAlbum(photoCatalog);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

init();
