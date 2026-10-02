/**
 * OM ESHWAR ACHARY (OMY) — EDITORIAL ENGINE
 * AI & Backend Developer
 * Lightweight, accessible, refined interactions
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // 01. Sticky Navigation & Scroll Spy
  // --------------------------------------------------------------------------
  function initNavigation() {
    const nav = document.getElementById('site-nav');
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Sticky Nav background elevation
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    }, { passive: true });

    // Active Section Spy
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(sec => spyObserver.observe(sec));

    // Mobile Hamburger Menu
    if (mobileToggle && mobileDrawer) {
      function toggleMenu() {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        mobileDrawer.setAttribute('aria-hidden', isExpanded);
        mobileDrawer.classList.toggle('is-open');
      }

      mobileToggle.addEventListener('click', toggleMenu);

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileDrawer.setAttribute('aria-hidden', 'true');
          mobileDrawer.classList.remove('is-open');
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // 02. Editorial Scroll Reveal Animations
  // --------------------------------------------------------------------------
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');

    if (prefersReducedMotion) {
      reveals.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // --------------------------------------------------------------------------
  // 03. Subtle Portrait Parallax (Natural & Non-intrusive)
  // --------------------------------------------------------------------------
  function initPortraitParallax() {
    const portrait = document.getElementById('hero-portrait');
    if (!portrait || prefersReducedMotion || window.innerWidth <= 1024) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY;
          if (scrollPos < 900) {
            // Very subtle movement (max ~18px)
            const translateY = scrollPos * 0.05;
            portrait.style.transform = `translate3d(0, ${translateY}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 04. Unified Showcase Lightbox Modal
  // --------------------------------------------------------------------------
  const lightboxModal = (function () {
    const lightbox = document.getElementById('peek-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxBadge = document.getElementById('lightbox-badge');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxIndicator = document.getElementById('lightbox-indicator');
    const lightboxClose = document.getElementById('lightbox-close-btn');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const lightboxPrev = document.getElementById('lightbox-prev-btn');
    const lightboxNext = document.getElementById('lightbox-next-btn');

    let activeCarousel = null;

    function sync() {
      if (!activeCarousel || !lightboxImg) return;
      const slide = activeCarousel.getCurrentSlide();
      if (!slide) return;
      const img = slide.querySelector('.carousel-img');
      const caption = slide.getAttribute('data-caption') || 'Project Preview';
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || caption;
      }
      if (lightboxTitle) lightboxTitle.textContent = caption;
      if (lightboxBadge && activeCarousel.badge) lightboxBadge.textContent = activeCarousel.badge;
      if (lightboxIndicator) {
        const cur = activeCarousel.getCurrentIndex() + 1;
        const total = activeCarousel.getTotalSlides();
        lightboxIndicator.textContent = `${cur < 10 ? '0' : ''}${cur} / ${total < 10 ? '0' : ''}${total}`;
      }
    }

    function open(carouselInstance) {
      if (!lightbox) return;
      activeCarousel = carouselInstance;
      if (lightboxPrev) lightboxPrev.style.display = '';
      if (lightboxNext) lightboxNext.style.display = '';
      sync();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (activeCarousel && activeCarousel.stopAutoPlay) {
        activeCarousel.stopAutoPlay();
      }
    }

    function openSingle(data) {
      if (!lightbox) return;
      activeCarousel = null;
      if (lightboxImg) {
        lightboxImg.src = data.src;
        lightboxImg.alt = data.alt || data.caption || 'Project View';
      }
      if (lightboxTitle) lightboxTitle.textContent = data.caption || 'Project View';
      if (lightboxBadge) lightboxBadge.textContent = data.badge || 'PROJECT VIEW';
      if (lightboxIndicator) lightboxIndicator.textContent = '01 / 01';
      if (lightboxPrev) lightboxPrev.style.display = 'none';
      if (lightboxNext) lightboxNext.style.display = 'none';

      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      if (!lightbox) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lightboxPrev) lightboxPrev.style.display = '';
      if (lightboxNext) lightboxNext.style.display = '';
      if (activeCarousel && activeCarousel.startAutoPlay) {
        activeCarousel.startAutoPlay();
      }
      activeCarousel = null;
    }

    if (lightboxClose) lightboxClose.addEventListener('click', close);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', close);

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (activeCarousel) {
          activeCarousel.prevSlide();
          sync();
        }
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (activeCarousel) {
          activeCarousel.nextSlide();
          sync();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightbox || !lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowRight') {
        if (activeCarousel) {
          activeCarousel.nextSlide();
          sync();
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeCarousel) {
          activeCarousel.prevSlide();
          sync();
        }
      }
    });

    return {
      open,
      openSingle,
      close,
      sync,
      isOpen: () => !!(lightbox && lightbox.classList.contains('is-open')),
      isCurrent: (c) => activeCarousel === c
    };
  })();

  // --------------------------------------------------------------------------
  // 05. Showcase Carousel Controller
  // --------------------------------------------------------------------------
  function createShowcaseCarousel(config) {
    const carousel = document.querySelector(config.selector);
    if (!carousel) return null;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById(config.prevBtnId);
    const nextBtn = document.getElementById(config.nextBtnId);
    const captionEl = document.getElementById(config.captionId);
    const counterEl = document.getElementById(config.counterId);
    const zoomBtn = document.getElementById(config.zoomBtnId);
    const viewport = document.getElementById(config.viewportId);

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayTimer = null;
    const autoPlayDelay = config.autoPlayDelay || 4500;

    const instance = {
      badge: config.badge,
      getCurrentIndex: () => currentIndex,
      getTotalSlides: () => totalSlides,
      getCurrentSlide: () => slides[currentIndex],
      updateSlide,
      nextSlide,
      prevSlide,
      startAutoPlay,
      stopAutoPlay
    };

    function updateSlide(newIndex) {
      if (newIndex < 0) {
        currentIndex = totalSlides - 1;
      } else if (newIndex >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = newIndex;
      }

      // Update slide classes
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentIndex);
      });

      // Update dots
      dots.forEach((dot, idx) => {
        const isActive = idx === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update caption & counter
      const activeSlide = slides[currentIndex];
      const caption = activeSlide ? activeSlide.getAttribute('data-caption') : '';
      if (captionEl && caption) {
        captionEl.style.opacity = '0';
        setTimeout(() => {
          captionEl.textContent = caption;
          captionEl.style.opacity = '1';
        }, 120);
      }

      if (counterEl) {
        const cur = currentIndex + 1;
        counterEl.textContent = `${cur < 10 ? '0' : ''}${cur} / ${totalSlides < 10 ? '0' : ''}${totalSlides}`;
      }

      // Update lightbox if currently open for this carousel
      if (lightboxModal.isOpen() && lightboxModal.isCurrent(instance)) {
        lightboxModal.sync();
      }
    }

    function nextSlide() {
      updateSlide(currentIndex + 1);
    }

    function prevSlide() {
      updateSlide(currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      if (!prefersReducedMotion) {
        autoPlayTimer = setInterval(nextSlide, autoPlayDelay);
      }
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    // Nav buttons
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
        startAutoPlay();
      });
    }

    // Dot indicators
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(targetIndex)) {
          updateSlide(targetIndex);
          startAutoPlay();
        }
      });
    });

    // Pause on interaction
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    carousel.addEventListener('focusin', stopAutoPlay);
    carousel.addEventListener('focusout', startAutoPlay);

    // Touch Swipe Gestures
    if (viewport) {
      let touchStartX = 0;
      let touchEndX = 0;

      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
        startAutoPlay();
      }, { passive: true });
    }

    // Keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        startAutoPlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        startAutoPlay();
      }
    });

    // Zoom trigger & slide image click opens lightbox
    if (zoomBtn) {
      zoomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        lightboxModal.open(instance);
      });
    }

    slides.forEach((slide) => {
      const img = slide.querySelector('.carousel-img');
      if (img) {
        img.addEventListener('click', () => {
          lightboxModal.open(instance);
        });
      }
    });

    // Initial setup
    updateSlide(0);
    startAutoPlay();

    return instance;
  }

  // --------------------------------------------------------------------------
  // 06. Single Image Lightbox Triggers (IRIS, TECHVERSE)
  // --------------------------------------------------------------------------
  function initSingleLightboxes() {
    const singleTriggers = document.querySelectorAll('[data-lightbox-single]');
    singleTriggers.forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = el.getAttribute('data-lightbox-src') || el.querySelector('img')?.getAttribute('src');
        const badge = el.getAttribute('data-lightbox-badge') || 'PROJECT VIEW';
        const caption = el.getAttribute('data-lightbox-caption') || el.querySelector('img')?.getAttribute('alt') || 'Project Preview';
        const alt = el.getAttribute('data-lightbox-alt') || el.querySelector('img')?.getAttribute('alt') || caption;
        if (src) {
          lightboxModal.openSingle({ src, badge, caption, alt });
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 07. The Journey Interactive Timeline Filter
  // --------------------------------------------------------------------------
  function initTimelineFilter() {
    const filterBtns = document.querySelectorAll('.timeline-filter-btn');
    const steps = document.querySelectorAll('.timeline-step');
    if (!filterBtns.length || !steps.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach(b => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        steps.forEach((step, idx) => {
          const year = step.getAttribute('data-year');
          if (filter === 'all' || year === filter) {
            step.classList.remove('is-filtered-out');
            step.style.display = '';
            // Smooth micro-animation stagger on reveal
            step.style.animation = 'none';
            step.offsetHeight; // trigger reflow
            step.style.animation = `hero-fade-up 0.4s var(--ease-editorial) ${idx * 0.035}s both`;
          } else {
            step.classList.add('is-filtered-out');
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 08. Interactive Skills Cloud Filtering
  // --------------------------------------------------------------------------
  function initSkillsInteractive() {
    const chips = document.querySelectorAll('.skill-chip');
    const tokens = document.querySelectorAll('.skill-token');

    // Category filter chips
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = chip.getAttribute('data-skill-cat');

        chips.forEach(c => {
          const isActive = c === chip;
          c.classList.toggle('active', isActive);
          c.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        tokens.forEach(tok => {
          const tokenCats = (tok.getAttribute('data-cat') || '').split(' ');
          if (cat === 'all' || tokenCats.includes(cat)) {
            tok.classList.remove('is-dimmed');
            tok.classList.toggle('is-active-filter', cat !== 'all');
          } else {
            tok.classList.add('is-dimmed');
            tok.classList.remove('is-active-filter');
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // Initialize Everything on DOM Load
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollReveal();
    initPortraitParallax();

    // 1. Briz Carousel
    createShowcaseCarousel({
      selector: '.briz-carousel',
      prevBtnId: 'briz-prev-btn',
      nextBtnId: 'briz-next-btn',
      captionId: 'briz-slide-caption',
      counterId: 'briz-slide-counter',
      zoomBtnId: 'briz-zoom-btn',
      viewportId: 'briz-carousel-viewport',
      badge: 'BRIZ // FLAGSHIP PLATFORM',
      autoPlayDelay: 4800
    });

    // 2. Peek AI Carousel
    createShowcaseCarousel({
      selector: '.peek-carousel:not(.zigsy-carousel):not(.briz-carousel):not(.reel-carousel)',
      prevBtnId: 'peek-prev-btn',
      nextBtnId: 'peek-next-btn',
      captionId: 'peek-slide-caption',
      counterId: 'peek-slide-counter',
      zoomBtnId: 'peek-zoom-btn',
      viewportId: 'peek-carousel-viewport',
      badge: 'PEEK AI // NATIONAL FINALIST',
      autoPlayDelay: 4500
    });

    // 3. Zigsy Carousel
    createShowcaseCarousel({
      selector: '.zigsy-carousel',
      prevBtnId: 'zigsy-prev-btn',
      nextBtnId: 'zigsy-next-btn',
      captionId: 'zigsy-slide-caption',
      counterId: 'zigsy-slide-counter',
      zoomBtnId: 'zigsy-zoom-btn',
      viewportId: 'zigsy-carousel-viewport',
      badge: 'ZIGSY // GEN Z COMMERCE',
      autoPlayDelay: 5000
    });

    // 4. Reel Analyzer Carousel
    createShowcaseCarousel({
      selector: '.reel-carousel',
      prevBtnId: 'reel-prev-btn',
      nextBtnId: 'reel-next-btn',
      captionId: 'reel-slide-caption',
      counterId: 'reel-slide-counter',
      zoomBtnId: 'reel-zoom-btn',
      viewportId: 'reel-carousel-viewport',
      badge: 'REEL ANALYZER // CONTENT AI',
      autoPlayDelay: 4800
    });

    // 5. Single Image Lightboxes (IRIS, Techverse)
    initSingleLightboxes();

    // 4. The Journey Interactive Timeline Filter
    initTimelineFilter();

    // 5. Interactive Skills & Engineering Inspector
    initSkillsInteractive();

    // 6. Achievements Horizontal Carousel Track
    initAchievementsCarousel();
  });

  // --------------------------------------------------------------------------
  // 09. Achievements Horizontal Carousel Track
  // --------------------------------------------------------------------------
  function initAchievementsCarousel() {
    const track = document.getElementById('achievements-track');
    const prevBtn = document.getElementById('achievements-prev-btn');
    const nextBtn = document.getElementById('achievements-next-btn');
    const counter = document.getElementById('achievements-counter');
    const cards = document.querySelectorAll('.achievement-card');

    if (!track || !cards.length) return;

    function getCardWidth() {
      const card = cards[0];
      const gap = 28; // 1.75rem in pixels
      return (card ? card.offsetWidth + gap : 360);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
      });
    }

    // Update counter on scroll
    track.addEventListener('scroll', () => {
      const scrollPos = track.scrollLeft;
      const cardWidth = getCardWidth();
      const activeIdx = Math.min(cards.length - 1, Math.max(0, Math.round(scrollPos / cardWidth)));
      if (counter) {
        counter.innerHTML = `<span class="text-burgundy">${String(activeIdx + 1).padStart(2, '0')}</span> / ${String(cards.length).padStart(2, '0')}`;
      }
    }, { passive: true });

    // Lightbox click on achievement cards
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const src = card.getAttribute('data-lightbox-src');
        const badge = card.getAttribute('data-lightbox-badge') || 'ACHIEVEMENT';
        const caption = card.getAttribute('data-lightbox-caption') || card.querySelector('.achievement-card-title')?.textContent || 'Achievement';
        const alt = card.querySelector('img')?.getAttribute('alt') || caption;
        if (src) {
          lightboxModal.openSingle({ src, badge, caption, alt });
        }
      });
    });
  }

})();
