// Animations and interactions using GSAP and vanilla JS
// Safe to include on any page. Guards against missing DOM.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function initHeaderEffects() {
  const header = document.querySelector(".section-navbar");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const currentY = window.scrollY;
    const goingDown = currentY > lastY && currentY > 20;
    header.classList.toggle("nav-hidden", goingDown);
    lastY = currentY;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  if (!prefersReducedMotion()) {
    gsap.from(header, { y: -40, opacity: 0, duration: 0.6, ease: "power2.out" });
  }
}

export function initPageTransitions() {
  // Fade-in on load
  document.documentElement.classList.add("page-fade-in");

  // Intercept internal links
  const isModifier = (e) => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest("a[href]");
    if (!anchor) return;
    const url = new URL(anchor.href, window.location.href);
    const sameOrigin = url.origin === window.location.origin;
    const isDownload = anchor.hasAttribute("download") || anchor.getAttribute("target") === "_blank";
    if (!sameOrigin || isDownload || isModifier(e)) return;
    if (url.pathname === window.location.pathname && url.hash) return;

    e.preventDefault();
    document.documentElement.classList.add("page-exit");
    const duration = 250;
    setTimeout(() => {
      window.location.href = anchor.href;
    }, duration);
  });
}

export function initScrollAnimations() {
  if (prefersReducedMotion()) return;

  const revealTargets = [
    ".section-hero .section-hero--content",
    ".div-extra",
    ".why-choose--div",
    ".section-policy .div-policy",
    ".cards",
  ];
  revealTargets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
  });

  // Parallax on extra product images
  document.querySelectorAll(".div-extra .extra-img img").forEach((img) => {
    gsap.to(img, {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: img.closest(".div-extra") || img,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

export function initHeroAnimations() {
  const hero = document.querySelector(".section-hero");
  if (!hero || prefersReducedMotion()) return;

  const tl = gsap.timeline();
  tl.from(hero.querySelectorAll(".hero-subheading, .hero-heading, .hero-para, .hero-btn .btn"), {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.08,
  });
}

export function initSkeletons() {
  const container = document.querySelector("#productContainer");
  if (!container) return;
  if (container.querySelector("#productSkeletons")) return;
  const skeletonWrapper = document.createElement("div");
  skeletonWrapper.id = "productSkeletons";
  skeletonWrapper.style.display = "grid";
  skeletonWrapper.style.gridTemplateColumns = "repeat(3, 1fr)";
  skeletonWrapper.style.gap = "4.8rem";
  const skeletonCard = () => {
    const d = document.createElement("div");
    d.className = "cards skeleton-card";
    d.innerHTML = `
      <div class="information">
        <div class="skeleton skeleton-chip" style="width:90px;height:22px;border-radius:999px;"></div>
        <div class="skeleton" style="width:100%;height:200px;border-radius:8px;margin-top:12px;"></div>
        <div class="skeleton" style="width:60%;height:18px;border-radius:6px;margin-top:12px;"></div>
        <div class="skeleton" style="width:90%;height:14px;border-radius:6px;margin-top:10px;"></div>
        <div style="display:flex;gap:12px;margin-top:14px;">
          <div class="skeleton" style="width:80px;height:24px;border-radius:6px;"></div>
          <div class="skeleton" style="width:80px;height:24px;border-radius:6px;"></div>
        </div>
      </div>`;
    return d;
  };
  for (let i = 0; i < 6; i++) skeletonWrapper.appendChild(skeletonCard());
  container.appendChild(skeletonWrapper);
}

export function removeSkeletons() {
  document.querySelectorAll("#productSkeletons, .skeleton-card").forEach((n) => n.remove());
}

export function initProductCardInteractions(root = document) {
  const cards = Array.from(root.querySelectorAll(".cards"));
  if (!cards.length) return;

  // 3D tilt
  const enableTilt = (card) => {
    if (card.dataset.tiltReady === "1") return;
    card.dataset.tiltReady = "1";
    card.style.transformStyle = "preserve-3d";
    card.style.willChange = "transform";
    const bounds = () => card.getBoundingClientRect();
    const onMove = (e) => {
      const r = bounds();
      const relX = (e.clientX - r.left) / r.width - 0.5;
      const relY = (e.clientY - r.top) / r.height - 0.5;
      const rotX = -relY * 8;
      const rotY = relX * 8;
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
    };
    const onLeave = () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    };
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  };
  cards.forEach(enableTilt);

  // Image zoom-on-hover
  root.querySelectorAll(".imageContainer").forEach((wrap) => {
    wrap.style.overflow = "hidden";
    const img = wrap.querySelector("img");
    if (img) {
      img.style.transition = "transform 300ms ease";
      wrap.addEventListener("mouseenter", () => (img.style.transform = "scale(1.06)"));
      wrap.addEventListener("mouseleave", () => (img.style.transform = "scale(1)"));
    }
  });
}

export function initMagneticButtons() {
  const targets = document.querySelectorAll(".btn, .add-to-cart-button");
  targets.forEach((el) => {
    if (el.dataset.magnetic === "1") return;
    el.dataset.magnetic = "1";
    const radius = 120;
    const strength = 0.25;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const pull = Math.max(0, 1 - dist / radius) * strength;
      gsap.to(el, { x: dx * pull, y: dy * pull, duration: 0.2, overwrite: "auto" });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "expo.out" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  });
}

export function animateAddToCartFeedback(btnEl) {
  const cart = document.querySelector("#cartValue i, #cartValue");
  if (btnEl) {
    gsap.fromTo(btnEl, { scale: 1 }, { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.out" });
  }
  if (cart) {
    const icon = cart;
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(icon, { y: -6, scale: 1.15, duration: 0.18 }).to(icon, { y: 0, scale: 1, duration: 0.28 });
  }
}

export function initAnimations() {
  initHeaderEffects();
  initPageTransitions();
  initHeroAnimations();
  initScrollAnimations();
  initMagneticButtons();
  initProductCardInteractions();
}

export function rebindProductInteractionsAfterRender() {
  removeSkeletons();
  initProductCardInteractions();
  initMagneticButtons();
}
