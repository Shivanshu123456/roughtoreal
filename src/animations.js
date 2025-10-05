<<<<<<< HEAD
(function () {
  window.addEventListener("DOMContentLoaded", function () {
    const gsapRef = window.gsap;
    const ScrollTriggerRef = window.ScrollTrigger;

    if (!gsapRef) {
      console.warn(
        "[animations] GSAP not found. Include the GSAP CDN before animations.js",
      );
      return;
    }

    if (ScrollTriggerRef) {
      gsapRef.registerPlugin(ScrollTriggerRef);
    }

    // Utilities
    const qs = (sel, ctx) => (ctx || document).querySelector(sel);
    const qsa = (sel, ctx) =>
      Array.from((ctx || document).querySelectorAll(sel));

    // Subtle easing defaults
    const defaultEase = "power2.out";

    // 0) Ensure minimal styles for helper elements (progress bar, cursor glow)
    (function ensureHelperStyles() {
      const styleId = "animation-helpers-style";
      if (document.getElementById(styleId)) return;
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = `
        #scroll-progress { position: fixed; left: 0; top: 0; height: 3px; width: 0; background: linear-gradient(90deg,#7c3aed,#22d3ee); z-index: 9999; transition: width 0.1s linear; }
        #backToTop { position: fixed; right: 16px; bottom: 16px; opacity: 0; transform: translateY(8px); transition: opacity .25s ease, transform .25s ease; z-index: 9999; }
        #backToTop.is-visible { opacity: 1; transform: translateY(0); }
        .cursor-glow { position: absolute; width: 60px; height: 60px; pointer-events: none; border-radius: 9999px; background: radial-gradient(35px, rgba(124,58,237,.35), rgba(34,211,238,.08) 60%, transparent 70%); filter: blur(2px); mix-blend-mode: screen; transform: translate(-50%, -50%); }
        .three-d { transform-style: preserve-3d; }
        .will-change-transform { will-change: transform; }
      `;
      document.head.appendChild(styleEl);
    })();

    // 1) Page load transition (body/main fade-in)
    gsapRef.from(document.body, {
      opacity: 0,
      duration: 0.35,
      ease: defaultEase,
    });

    // 2) Navbar shrink / background on scroll
    (function navbarShrink() {
      const header =
        qs("header.section-navbar") ||
        qs("header") ||
        qs(".navbar") ||
        qs(".section-navbar");
      if (!header || !ScrollTriggerRef) return;

      gsapRef.set(header, { transformOrigin: "50% 0%" });

      ScrollTriggerRef.create({
        start: 10,
        end: 99999,
        onUpdate: (self) => {
          const t = Math.min(1, Math.max(0, self.scroll())) > 20 ? 1 : 0;
          gsapRef.to(header, {
            backgroundColor: t ? "rgba(255,255,255,0.92)" : "transparent",
            boxShadow: t ? "0 8px 24px rgba(0,0,0,0.06)" : "none",
            y: t ? 0 : 0,
            scaleY: t ? 0.98 : 1,
            duration: 0.25,
            ease: defaultEase,
          });
        },
      });
    })();

    // 3) Scroll progress bar
    (function progressBar() {
      const bar = qs("#scroll-progress");
      if (!bar) return;
      const update = () => {
        const scrollTop = window.scrollY || window.pageYOffset;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + "%";
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
    })();

    // 4) Hero fade-in sequence
    (function heroIntro() {
      const hero = qs(".section-hero");
      if (!hero) return;
      const tl = gsapRef.timeline({ defaults: { ease: defaultEase } });
      const content = qs(".section-hero--content", hero);
      const image = qs(".section-hero-image", hero);
      tl.from(hero, { opacity: 0, duration: 0.2 })
        .from(content, { y: 20, opacity: 0, duration: 0.7 }, "-=0.05")
        .from(image, { y: 24, opacity: 0, duration: 0.7 }, "-=0.5");
    })();

    // 5) Button hover pulse
    (function buttonHoverPulse() {
      const buttons = qsa("button, .btn, .cta-btn, .add-to-cart-button");
      buttons.forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
          gsapRef.to(btn, { scale: 1.05, duration: 0.18, ease: "power1.out" });
        });
        btn.addEventListener("mouseleave", () => {
          gsapRef.to(btn, { scale: 1.0, duration: 0.18, ease: "power1.out" });
        });
      });
    })();

    // 6) Product card entrance on scroll
    (function productCardEntrance() {
      if (!ScrollTriggerRef) return;
      const cards = qsa(".product-card, .card, .cards");
      cards.forEach((el, idx) => {
        gsapRef.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.5,
          ease: defaultEase,
          delay: Math.min(0.15, idx * 0.02),
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });
    })();

    // 7) Image hover parallax
    (function imageParallaxHover() {
      const images = qsa(
        ".product-img, .productImage, .gallery-item, .gallery-item img",
      );
      images.forEach((img) => {
        img.classList.add("will-change-transform");
        let bounds = null;
        img.addEventListener("mouseenter", () => {
          bounds = img.getBoundingClientRect();
        });
        img.addEventListener("mousemove", (e) => {
          if (!bounds) bounds = img.getBoundingClientRect();
          const relX = (e.clientX - bounds.left) / bounds.width;
          const relY = (e.clientY - bounds.top) / bounds.height;
          const moveX = (relX - 0.5) * 8; // subtle
          const moveY = (relY - 0.5) * 8;
          gsapRef.to(img, {
            x: moveX,
            y: moveY,
            duration: 0.35,
            ease: "power1.out",
          });
        });
        img.addEventListener("mouseleave", () => {
          gsapRef.to(img, { x: 0, y: 0, duration: 0.35, ease: "power1.out" });
        });
      });
    })();

    // 8) Text reveal on scroll
    (function textReveal() {
      if (!ScrollTriggerRef) return;
      const texts = qsa(
        ".headline, .section-title, .section-common--heading, .section-common-heading, .section-common--title, .hero-heading",
      );
      texts.forEach((el) => {
        gsapRef.from(el, {
          y: 18,
          opacity: 0,
          duration: 0.5,
          ease: defaultEase,
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    })();

    // 9) Add to cart animation (button + cart icon)
    (function addToCartAnimation() {
      const cartIcon = qs(".cart-icon");
      const buttons = qsa(".add-to-cart-button");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          gsapRef.fromTo(
            btn,
            { scale: 1 },
            { scale: 1.08, yoyo: true, repeat: 1, duration: 0.18 },
          );
          if (cartIcon) {
            gsapRef.fromTo(
              cartIcon,
              { y: 0 },
              {
                y: -8,
                duration: 0.22,
                ease: "power1.out",
                yoyo: true,
                repeat: 1,
              },
            );
          }
        });
      });
      if (cartIcon) {
        gsapRef.to(cartIcon, {
          y: -3,
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    })();

    // 10) Section divider scroll animation
    (function sectionDividerScroll() {
      if (!ScrollTriggerRef) return;
      const dividers = qsa('.section-divider, [class*="custom-shape-divider"]');
      dividers.forEach((el) => {
        gsapRef.from(el, {
          y: 16,
          opacity: 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top center",
            scrub: true,
          },
        });
      });
    })();

    // 11) Testimonial carousel (simple auto-fader)
    (function testimonialCarousel() {
      const container = qs(".reviews-section");
      if (!container) return;
      const cards = qsa(".testimonial-card", container);
      if (cards.length <= 1) return;
      cards.forEach((c, i) =>
        gsapRef.set(c, {
          opacity: i === 0 ? 1 : 0,
          position: "absolute",
          inset: 0,
        }),
      );
      let index = 0;
      setInterval(() => {
        const current = cards[index % cards.length];
        const next = cards[(index + 1) % cards.length];
        gsapRef.to(current, { opacity: 0, duration: 0.6, ease: defaultEase });
        gsapRef.to(next, { opacity: 1, duration: 0.6, ease: defaultEase });
        index++;
      }, 4000);
    })();

    // 12) Product image zoom on hover
    (function productImageZoom() {
      const imgs = qsa(".product-img, .productImage");
      imgs.forEach((img) => {
        img.addEventListener("mouseenter", () =>
          gsapRef.to(img, { scale: 1.05, duration: 0.2 }),
        );
        img.addEventListener("mouseleave", () =>
          gsapRef.to(img, { scale: 1.0, duration: 0.2 }),
        );
      });
    })();

    // 13) Footer fade-up
    (function footerFadeUp() {
      const footer = qs("footer");
      if (!footer || !ScrollTriggerRef) return;
      gsapRef.from(footer, {
        y: 24,
        opacity: 0,
        duration: 0.55,
        ease: defaultEase,
        scrollTrigger: { trigger: footer, start: "top 90%" },
      });
    })();

    // 14) Feature icons spin-in
    (function featureIconsSpin() {
      if (!ScrollTriggerRef) return;
      const icons = qsa(".feature-icon, .section-policy .icons i");
      icons.forEach((icon) => {
        gsapRef.from(icon, {
          rotateY: 90,
          opacity: 0,
          transformOrigin: "50% 50%",
          duration: 0.5,
          ease: defaultEase,
          scrollTrigger: { trigger: icon, start: "top 95%" },
        });
      });
    })();

    // 15) Back to top button behavior
    (function backToTop() {
      const btn = qs("#backToTop");
      if (!btn) return;
      const onScroll = () => {
        const show = (window.scrollY || window.pageYOffset) > 300;
        btn.classList.toggle("is-visible", show);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    })();

    // 16) Category cards flip (hover)
    (function categoryCardsFlip() {
      const cards = qsa(".category-card");
      cards.forEach((card) => {
        card.classList.add("three-d");
        card.addEventListener("mouseenter", () =>
          gsapRef.to(card, { rotateY: 8, duration: 0.25, ease: defaultEase }),
        );
        card.addEventListener("mouseleave", () =>
          gsapRef.to(card, { rotateY: 0, duration: 0.25, ease: defaultEase }),
        );
      });
    })();

    // 17) Typing subtitle (.hero-subtitle or fallback to .hero-subheading)
    (function typingSubtitle() {
      const el = qs(".hero-subtitle") || qs(".hero-subheading");
      if (!el) return;
      const full = el.textContent.trim();
      if (!full) return;
      el.setAttribute("aria-live", "polite");
      el.textContent = "";
      let idx = 0;
      const step = () => {
        el.textContent = full.slice(0, idx++);
        if (idx <= full.length) {
          setTimeout(step, 24);
        }
      };
      setTimeout(step, 300);
    })();

    // 18) Scroll-triggered background color change for sections
    (function sectionBgColorChange() {
      if (!ScrollTriggerRef) return;
      const sections = qsa(
        "main section, .section-why--choose, .section-policy, .section-extra-product, .section-products, .section-contact",
      );
      sections.forEach((sec, i) => {
        const color = i % 2 === 0 ? "#ffffff" : "#f8fafc";
        ScrollTriggerRef.create({
          trigger: sec,
          start: "top 60%",
          onEnter: () =>
            gsapRef.to(document.body, {
              backgroundColor: color,
              duration: 0.4,
              ease: defaultEase,
            }),
          onEnterBack: () =>
            gsapRef.to(document.body, {
              backgroundColor: color,
              duration: 0.4,
              ease: defaultEase,
            }),
        });
      });
    })();

    // 19) Cursor trail glow in hero section
    (function cursorTrailGlow() {
      const hero = qs(".section-hero");
      if (!hero) return;
      const glow = document.createElement("div");
      glow.className = "cursor-glow";
      hero.style.position = hero.style.position || "relative";
      hero.appendChild(glow);

      const moveX = gsapRef.quickTo(glow, "left", {
        duration: 0.2,
        ease: "power3",
      });
      const moveY = gsapRef.quickTo(glow, "top", {
        duration: 0.2,
        ease: "power3",
      });

      hero.addEventListener("pointermove", (e) => {
        const rect = hero.getBoundingClientRect();
        moveX(e.clientX - rect.left);
        moveY(e.clientY - rect.top);
      });
      hero.addEventListener("pointerleave", () => {
        gsapRef.to(glow, { opacity: 0, duration: 0.3 });
      });
      hero.addEventListener("pointerenter", () => {
        gsapRef.to(glow, { opacity: 1, duration: 0.3 });
      });
    })();

    // 20) Page transition on link clicks (subtle fade-out)
    (function pageLeaveTransition() {
      const links = qsa("a[href]:not([target])");
      links.forEach((a) => {
        a.addEventListener("click", (e) => {
          const href = a.getAttribute("href");
          if (!href || href.startsWith("#") || href.startsWith("javascript:"))
            return;
          // Allow middle/ctrl/cmd click to open new tab
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault();
          gsapRef.to(document.body, {
            opacity: 0,
            duration: 0.2,
            ease: defaultEase,
            onComplete: () => {
              window.location.href = href;
            },
          });
        });
      });
    })();
  });
})();
=======
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
>>>>>>> main

