const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const cursorDot = document.querySelector(".cursor-dot");
const canvas = document.querySelector("#heroCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let particles = [];
let hasCounted = false;

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

if (prefersReducedMotion.matches) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    if (hasCounted) return;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        hasCounted = true;
        counters.forEach(animateCounter);
      }
    });
  },
  { threshold: 0.5 }
);

if (counters.length > 0) {
  counterObserver.observe(counters[0]);
}

function animateCounter(counter) {
  const target = Number(counter.dataset.counter);
  if (prefersReducedMotion.matches) {
    counter.textContent = String(target);
    return;
  }

  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = String(target);
    }
  }

  requestAnimationFrame(update);
}

window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY + 120;

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const section = document.querySelector(href);
    if (!section) return;

    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    link.classList.toggle("active", scrollPosition >= top && scrollPosition < bottom);
  });
});

window.addEventListener("pointermove", (event) => {
  if (!cursorDot) return;
  cursorDot.style.left = `${event.clientX}px`;
  cursorDot.style.top = `${event.clientY}px`;
});

document.querySelectorAll("a, button, input, select, textarea").forEach((element) => {
  element.addEventListener("pointerenter", () => {
    if (!cursorDot) return;
    cursorDot.style.width = "34px";
    cursorDot.style.height = "34px";
  });

  element.addEventListener("pointerleave", () => {
    if (!cursorDot) return;
    cursorDot.style.width = "18px";
    cursorDot.style.height = "18px";
  });
});

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles(rect.width, rect.height);
  if (prefersReducedMotion.matches) {
    renderCanvasFrame();
  }
}

function createParticles(width, height) {
  const particleCount = Math.min(72, Math.floor(width / 18));

  particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    radius: Math.random() * 2 + 1,
  }));
}

function renderCanvasFrame() {
  if (!canvas || !ctx) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#070b14");
  gradient.addColorStop(0.45, "#0c1424");
  gradient.addColorStop(1, "#071b1d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  particles.forEach((particle) => {
    if (!prefersReducedMotion.matches) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
    }

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(79, 140, 255, 0.36)";
    ctx.fill();
  });

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 125) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(40, 217, 196, ${0.2 - distance / 850})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

function drawCanvas() {
  renderCanvasFrame();
  if (!prefersReducedMotion.matches) {
    requestAnimationFrame(drawCanvas);
  }
}

if (canvas && ctx) {
  resizeCanvas();
  drawCanvas();
  window.addEventListener("resize", resizeCanvas);
}

// Certificaciones Carousel (Mobile <768px scroll-snap + Dots + Arrows + Keyboard)
function initCertsCarousel() {
  const track = document.querySelector("#certsTrack");
  if (!track) return;

  const cards = Array.from(track.querySelectorAll(".cert-card"));
  const dots = Array.from(document.querySelectorAll(".certs-dot"));
  const prevBtn = document.querySelector("#certsPrev");
  const nextBtn = document.querySelector("#certsNext");

  if (cards.length === 0) return;

  let currentIndex = 0;
  let scrollTicking = false;

  function updateIndicators(index) {
    currentIndex = Math.max(0, Math.min(index, cards.length - 1));
    dots.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  }

  function scrollToCard(index) {
    const targetIndex = (index + cards.length) % cards.length;
    const targetCard = cards[targetIndex];
    if (!targetCard) return;

    const targetLeft = targetCard.offsetLeft - track.offsetLeft;
    track.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
    updateIndicators(targetIndex);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      scrollToCard(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      scrollToCard(currentIndex + 1);
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      scrollToCard(idx);
    });

    dot.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextIdx = (idx + 1) % dots.length;
        dots[nextIdx].focus();
        scrollToCard(nextIdx);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        const prevIdx = (idx - 1 + dots.length) % dots.length;
        dots[prevIdx].focus();
        scrollToCard(prevIdx);
      }
    });
  });

  track.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let closestIndex = 0;
        let minDistance = Infinity;

        cards.forEach((card, idx) => {
          const cardCenter = card.offsetLeft - track.offsetLeft + card.clientWidth / 2;
          const dist = Math.abs(trackCenter - cardCenter);
          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = idx;
          }
        });

        updateIndicators(closestIndex);
        scrollTicking = false;
      });
    },
    { passive: true }
  );

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToCard(currentIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToCard(currentIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      scrollToCard(0);
    } else if (event.key === "End") {
      event.preventDefault();
      scrollToCard(cards.length - 1);
    }
  });
}

initCertsCarousel();
