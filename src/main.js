import './style.scss';
import products from './products.json';
import { showProductContainer } from './homeProductsCards';
import { showToast } from './showToast';
import viteLogo from '/vite.svg';
import javascriptLogo from './javascript.svg';

// Render products on homepage (existing functionality)
showProductContainer(products);

// Respect user preference for reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Feature 6: Loading spinner overlay - hide after initial work is done
function initializeLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;
  // Hide overlay after a short delay to display a brief loading affordance
  window.addEventListener('load', () => {
    overlay.setAttribute('aria-busy', 'false');
    overlay.classList.remove('active');
  });
  // If the page is already loaded (module executed late), hide immediately
  if (document.readyState === 'complete') {
    overlay.setAttribute('aria-busy', 'false');
    overlay.classList.remove('active');
  } else {
    // Ensure visible until load completes
    overlay.classList.add('active');
  }
}

// Feature 1: Fade-in hero section (and subtle fade-out when scrolled away)
function initializeHeroFade() {
  const heroContent = document.querySelector('.section-hero--content');
  if (!heroContent) return;
  // Show on mount
  requestAnimationFrame(() => heroContent.classList.add('show'));
  // Optional: fade-out once user scrolls significantly past hero
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    const fadeStart = 120; // start diminishing after 120px
    const fadeEnd = 400; // fully diminished by 400px
    if (scrolled <= fadeStart) {
      heroContent.style.opacity = '';
      return;
    }
    const ratio = Math.max(0, 1 - (scrolled - fadeStart) / (fadeEnd - fadeStart));
    heroContent.style.opacity = String(ratio);
  });
}

// Feature 4: Scroll-triggered element animations using IntersectionObserver
function initializeScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;
  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealElements.forEach((el) => observer.observe(el));
}

// Feature 7: Scroll progress bar
function initializeScrollProgress() {
  const progress = document.getElementById('scroll-progress');
  if (!progress) return;
  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const ratio = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = `${ratio}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// Feature 8: Smooth dropdown transitions with ARIA updates
function initializeDropdown() {
  const dropdown = document.querySelector('.nav-item.dropdown');
  if (!dropdown) return;
  const toggle = dropdown.querySelector('.dropdown-toggle');
  const menu = dropdown.querySelector('.dropdown-menu');
  if (!toggle || !menu) return;

  const closeDropdown = () => {
    dropdown.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  const openDropdown = () => {
    dropdown.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  };
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.contains('open') ? closeDropdown() : openDropdown();
  });
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) closeDropdown();
  });
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const firstItem = menu.querySelector('a');
      if (firstItem) firstItem.focus();
    }
  });
}

// Feature 10: Text typing animation for headings
function initializeTypewriter() {
  const heading = document.getElementById('typedHeading');
  if (!heading) return;
  if (prefersReducedMotion) return; // respect reduced motion
  const fullText = heading.textContent?.trim() || '';
  if (!fullText) return;
  let index = 0;
  heading.textContent = '';

  const typeNext = () => {
    if (index > fullText.length) return;
    heading.textContent = fullText.slice(0, index);
    index += 1;
    const delay = 36; // typing speed in ms per character
    setTimeout(typeNext, delay);
  };
  typeNext();
}

// Feature 11: Parallax scrolling effects for the hero background
function initializeParallax() {
  const layer = document.querySelector('.section-hero .parallax-bg');
  if (!layer) return;
  if (prefersReducedMotion) return;
  const onScroll = () => {
    const hero = document.querySelector('.section-hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    // Move background slightly based on scroll position within hero
    const progress = Math.min(1, Math.max(0, 1 - Math.abs(rect.top) / (rect.height || 1)));
    const translate = Math.round((1 - progress) * 40); // up to 40px parallax
    layer.style.transform = `translateY(${translate}px)`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Feature 12: Card flip animations (hover and tap)
function initializeFlipCard() {
  const flipCard = document.getElementById('dealFlipCard');
  if (!flipCard) return;
  const toggle = (force) => flipCard.classList.toggle('is-flipped', force);
  flipCard.addEventListener('mouseenter', () => toggle(true));
  flipCard.addEventListener('mouseleave', () => toggle(false));
  flipCard.addEventListener('click', () => toggle(!flipCard.classList.contains('is-flipped')));
  flipCard.setAttribute('tabindex', '0');
  flipCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(!flipCard.classList.contains('is-flipped'));
    }
  });
}

// Feature 13 & 14: Sticky navbar and Back-to-top
function initializeStickyNavbarAndBackToTop() {
  const header = document.querySelector('.section-navbar');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-sticky', scrolled > 32);
    if (backToTop) backToTop.classList.toggle('show', scrolled > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Feature 16: Modal open/close animation with focus handling
function initializeModal() {
  const modal = document.getElementById('app-modal');
  const openBtn = document.getElementById('openModalButton');
  const closeBtn = document.getElementById('closeModalButton');
  if (!modal || !openBtn || !closeBtn) return;
  let lastFocusedElement = null;
  const open = () => {
    lastFocusedElement = document.activeElement;
    modal.classList.add('open');
    closeBtn.focus();
  };
  const close = () => {
    modal.classList.remove('open');
    if (lastFocusedElement && lastFocusedElement.focus) lastFocusedElement.focus();
  };
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

// Feature 17: Hamburger menu open/close animation
function initializeHamburger() {
  const button = document.getElementById('hamburger');
  const nav = document.getElementById('primaryNav');
  if (!button || !nav) return;
  const toggle = () => {
    const willOpen = !button.classList.contains('is-active');
    button.classList.toggle('is-active', willOpen);
    nav.classList.toggle('open', willOpen);
    button.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  };
  button.addEventListener('click', toggle);
}

// Feature 18: Tab switching animation with ARIA updates and keyboard support
function initializeTabs() {
  const tabsContainer = document.getElementById('infoTabs');
  if (!tabsContainer) return;
  const tabButtons = Array.from(
    tabsContainer.querySelectorAll('[role="tab"]')
  );
  const panels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"]')
  );
  const setActive = (nextId) => {
    tabButtons.forEach((btn) => {
      const isActive = btn.id === nextId;
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) btn.focus();
    });
    panels.forEach((panel) => {
      const isActive = panel.getAttribute('aria-labelledby') === nextId;
      panel.classList.toggle('active', isActive);
      if (isActive) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });
  };
  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('[role="tab"]');
    if (!btn) return;
    setActive(btn.id);
  });
  tabsContainer.addEventListener('keydown', (e) => {
    const currentIndex = tabButtons.findIndex((b) => b.getAttribute('aria-selected') === 'true');
    if (currentIndex === -1) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = (currentIndex + dir + tabButtons.length) % tabButtons.length;
      setActive(tabButtons[next].id);
    }
  });
}

// Feature 2 & 9: Carousel (auto-play, controls, and dots)
function initializeCarousel() {
  const carousel = document.getElementById('homeCarousel');
  const track = document.getElementById('homeCarouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  if (!carousel || !track || !prevBtn || !nextBtn || !dotsContainer) return;
  const slides = Array.from(track.children);
  let currentIndex = 0;
  let autoPlayTimer = null;

  // Create dots
  slides.forEach((_s, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const updateDots = () => {
    const dots = Array.from(dotsContainer.children);
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  };
  const goTo = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };
  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Auto-play unless user prefers reduced motion
  const startAutoPlay = () => {
    if (prefersReducedMotion) return;
    stopAutoPlay();
    autoPlayTimer = window.setInterval(next, 3500);
  };
  const stopAutoPlay = () => {
    if (autoPlayTimer) window.clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  };
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  goTo(0);
  startAutoPlay();
}

// Feature 20: Footer reveal on scroll
function initializeFooterReveal() {
  const footer = document.querySelector('footer.section-footer');
  if (!footer) return;
  footer.classList.remove('reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.classList.add('reveal');
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );
  observer.observe(footer);
}

// Feature 19: Notification/toast slide-in demo button
function initializeDemoToast() {
  const button = document.getElementById('demoToastButton');
  if (!button) return;
  button.addEventListener('click', () => {
    showToast('add', 'DEMO');
  });
}

// Initialize all features
initializeLoadingOverlay();
initializeHeroFade();
initializeScrollReveal();
initializeScrollProgress();
initializeDropdown();
initializeTypewriter();
initializeParallax();
initializeFlipCard();
initializeStickyNavbarAndBackToTop();
initializeModal();
initializeHamburger();
initializeTabs();
initializeCarousel();
initializeFooterReveal();
initializeDemoToast();
