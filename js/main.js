const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

window.addEventListener("load", () => {
  window.setTimeout(() => $("#loader")?.classList.add("is-hidden"), 520);
});

const navbar = $("#navbar");
const hamburger = $("#hamburger");
const mobileMenu = $("#mob-menu");

const updateNavbar = () => {
  navbar?.classList.toggle("is-scrolled", window.scrollY > 20);
};

updateNavbar();
window.addEventListener("scroll", updateNavbar, { passive: true });

hamburger?.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("is-open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
  mobileMenu?.classList.toggle("is-open", isOpen);
});

$$('#mob-menu a').forEach((link) => {
  link.addEventListener("click", () => {
    hamburger?.classList.remove("is-open");
    hamburger?.setAttribute("aria-expanded", "false");
    mobileMenu?.classList.remove("is-open");
  });
});

const marquee = $("#marquee");
if (marquee) {
  const words = [
    "Closets a medida",
    "Cocinas integrales",
    "Muebles de oficina",
    "Diseño personalizado",
    "Fabricación directa",
    "Acabados modernos",
    "Soluciones funcionales",
    "Alta calidad"
  ];
  marquee.innerHTML = [...words, ...words].map((word) => `<span>${word}</span>`).join("");
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

$$(".reveal").forEach((el) => revealObserver.observe(el));

const countNumbers = (scope) => {
  $$(".stat-num", scope).forEach((el) => {
    if (el.dataset.done) return;
    el.dataset.done = "true";

    const end = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(end * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
};

const stats = $("#stats");
if (stats) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countNumbers(stats);
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.35 });

  statsObserver.observe(stats);
}

const canvas = $("#hero-canvas");
const ctx = canvas?.getContext("2d");
let particles = [];
let rafId;

const setupCanvas = () => {
  if (!canvas || !ctx) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = window.innerWidth < 720 ? 22 : 42;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * rect.width,
    y: Math.random() * rect.height,
    r: Math.random() * 1.7 + 0.6,
    vx: (Math.random() - 0.5) * 0.18,
    vy: Math.random() * 0.16 + 0.04,
    a: Math.random() * 0.3 + 0.12
  }));
};

const drawCanvas = () => {
  if (!canvas || !ctx) return;
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y > rect.height + 8) p.y = -8;
    if (p.x < -8) p.x = rect.width + 8;
    if (p.x > rect.width + 8) p.x = -8;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(229, 212, 189, ${p.a})`;
    ctx.fill();
  });
  rafId = requestAnimationFrame(drawCanvas);
};

if (canvas && ctx && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setupCanvas();
  drawCanvas();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(rafId);
    setupCanvas();
    drawCanvas();
  });
}

const form = $("#wa-form");
const formNote = $("#form-note");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = $("#f-name")?.value.trim();
  const interest = $("#f-interest")?.value;
  const message = $("#f-msg")?.value.trim();

  if (!name || !message) {
    formNote.textContent = "Completa tu nombre y el detalle del proyecto para preparar la solicitud.";
    formNote.classList.remove("success");
    return;
  }

  const summary = `Hola, soy ${name}. Me interesa: ${interest}. Detalle del proyecto: ${message}`;

  try {
    await navigator.clipboard.writeText(summary);
    formNote.textContent = "Solicitud preparada. El resumen quedó copiado para compartirlo por el canal oficial de Muebles Melgar.";
  } catch {
    formNote.textContent = summary;
  }

  formNote.classList.add("success");
  form.reset();
});

const year = $("#year");
if (year) year.textContent = new Date().getFullYear();
