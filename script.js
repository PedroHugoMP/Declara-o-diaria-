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
  "WhatsApp Image 2026-07-30 at 4.37.26 PM.jpeg"
];

const photoMessages = {
  "WhatsApp Image 2026-07-05 at 1.47.40 PM.jpeg": "Porque seu abraço é o lugar onde encontro paz.",
  "WhatsApp Image 2026-07-30 at 4.24.09 PM (1).jpeg": "Porque seu sorriso ilumina até os dias mais cinzentos.",
  "WhatsApp Image 2026-07-30 at 4.24.09 PM.jpeg": "Porque sua presença faz o mundo parecer mais bonito.",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM (1).jpeg": "Porque você torna meus momentos especiais em memórias preciosas.",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM (2).jpeg": "Porque a sua voz me acalma como nenhuma outra.",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM (3).jpeg": "Porque eu amo a forma como você cuida do meu coração.",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM (4).jpeg": "Porque você transforma carinho em algo quase mágico.",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM (5).jpeg": "Porque seu jeito me faz sentir em casa.",
  "WhatsApp Image 2026-07-30 at 4.24.10 PM.jpeg": "Porque cada conversa sua me aproxima de você.",
  "WhatsApp Image 2026-07-30 at 4.24.11 PM (1).jpeg": "Porque seu amor é a minha música favorita.",
  "WhatsApp Image 2026-07-30 at 4.24.11 PM (2).jpeg": "Porque eu nunca canso de te admirar.",
  "WhatsApp Image 2026-07-30 at 4.24.11 PM.jpeg": "Porque você é a razão dos meus melhores sentimentos.",
  "WhatsApp Image 2026-07-30 at 4.24.12 PM.jpeg": "Porque seu olhar transmite tudo o que meu coração sente.",
  "WhatsApp Image 2026-07-30 at 4.24.13 PM.jpeg": "Porque você me ensina a amar com mais leveza.",
  "WhatsApp Image 2026-07-30 at 4.36.50 PM.jpeg": "Porque o seu carinho me faz crescer cada dia mais.",
  "WhatsApp Image 2026-07-30 at 4.37.26 PM.jpeg": "Porque esses eram apenas 30 motivos... e eu ainda tenho milhares para te dizer."
};

const state = {
  selectedPhoto: null,
  history: [],
  messageHistory: []
};

let activeHearts = 0;

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

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
  if (window.location.protocol === "file:") {
    return defaultPhotoCatalog;
  }

  try {
    const response = await fetch(`${photoFolder}/photos.json`);
    if (!response.ok) throw new Error("manifest unavailable");
    const data = await response.json();
    if (Array.isArray(data.photos) && data.photos.length > 0) {
      return data.photos;
    }
  } catch (error) {
    return defaultPhotoCatalog;
  }

  return defaultPhotoCatalog;
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
  const currentMessage = photoMessages[state.selectedPhoto] || "Uma nova foto para o seu dia.";
  const recentMessages = storedMessages.filter((entry) => {
    const entryDate = new Date(entry.date);
    const diffDays = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 15;
  });

  const usedRecently = recentMessages.some((entry) => entry.message === currentMessage);
  if (usedRecently) {
    const fallback = Object.values(photoMessages).find((message) => !recentMessages.some((entry) => entry.message === message));
    return fallback || currentMessage;
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
  const safePhoto = encodeURIComponent(state.selectedPhoto || "");
  image.src = `${photoFolder}/${safePhoto}`;
  image.onload = () => {
    elements.photo.classList.add("is-fading");
    setTimeout(() => {
      elements.photo.src = image.src;
      elements.photo.alt = `Foto do dia ${state.selectedPhoto}`;
      elements.photo.classList.remove("is-fading");
    }, 180);
  };

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

function initSpotifyPlayer() {
  const iframe = document.getElementById("spotify-embed");
  const playButton = document.getElementById("spotify-play-btn");
  const hint = document.getElementById("spotify-hint");
  if (!iframe) return;

  const playlistUrl = "https://open.spotify.com/playlist/0OIk5e0hm5NVgvOqGqYHBg?si=f443d9a5057346e0";
  const baseSrc = iframe.getAttribute("src") || "";
  const autoplaySrc = baseSrc.includes("autoplay=")
    ? baseSrc.replace(/autoplay=[^&]+/, "autoplay=1")
    : `${baseSrc}${baseSrc.includes("?") ? "&" : "?"}autoplay=1`;

  iframe.setAttribute("src", autoplaySrc);

  if (playButton) {
    playButton.addEventListener("click", () => {
      if (hint) {
        hint.textContent = "Abrindo a playlist no Spotify...";
      }
      window.open(playlistUrl, "_blank", "noopener,noreferrer");
    });
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      iframe.setAttribute("src", autoplaySrc);
      if (hint) {
        hint.textContent = "Se o navegador bloquear, clique em Tocar agora.";
      }
    }, 800);
  });
}

function attachInteractions() {
  elements.photo.addEventListener("click", (event) => {
    const rect = elements.photo.getBoundingClientRect();
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

async function init() {
  ensureInitialState();
  loadTheme();
  await getPhotoSelection();
  renderReason();
  initSpotifyPlayer();
  attachInteractions();
  initParticles();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

init();
