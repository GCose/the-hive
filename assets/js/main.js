/**=========================================
 * Function that handles loading animation
 ==========================================*/
function initLoader() {
  const loader = document.querySelector(".loader");
  const progressBar = document.querySelector(".loader__progress-bar");

  let loadProgress = 0;
  const interval = setInterval(() => {
    loadProgress += Math.random() * 10;
    if (loadProgress > 100) loadProgress = 100;

    progressBar.style.width = `${loadProgress}%`;

    if (loadProgress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add("loader--hidden");
        document.body.style.overflow = "visible";
        initAnimations();
      }, 500);
    }
  }, 200);
}

/**============================================
 * Function that handles menu overlay toggle
 =============================================*/
function initMenuToggle() {
  const menuToggle = document.querySelector(".hero__menu-toggle");
  const menuClose = document.querySelector(".menu__close");
  const menuOverlay = document.querySelector(".menu__overlay");
  const menuLinks = document.querySelectorAll(".menu__link");

  const openMenu = () => {
    menuOverlay.classList.add("menu__overlay--active");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menuOverlay.classList.remove("menu__overlay--active");
    document.body.style.overflow = "visible";
  };

  menuToggle.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      menuOverlay.classList.contains("menu__overlay--active")
    ) {
      closeMenu();
    }
  });
}

/**==========================================================
 * Function that handles features scroll-triggered sliding.
 ===========================================================*/
function initFeaturesSliding() {
  const spreads = document.querySelectorAll(".features__spread");
  const featuresSection = document.querySelector(".features");
  const featuresContainer = document.querySelector(".features__container");

  if (!spreads.length || !featuresSection) return;

  // Initial setup - hide all spreads and set positioning
  spreads.forEach((spread, index) => {
    spread.style.position = "fixed";
    spread.style.top = "0";
    spread.style.transform = "translateY(100%)";
    spread.style.zIndex = 50 + index;
    spread.style.opacity = "0";
    spread.style.visibility = "hidden";
  });

  let ticking = false;
  let isCompleted = false;
  let lastScrollTop = 0;

  function updateSpreadsOnScroll() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    const featuresRect = featuresSection.getBoundingClientRect();
    const featuresTop = scrollTop + featuresRect.top;
    const featuresBottom = featuresTop + featuresSection.offsetHeight;

    // Get the next section to determine when to complete
    const spacesSection = document.querySelector(".spaces__horizontal");
    const spacesTop = spacesSection
      ? scrollTop + spacesSection.getBoundingClientRect().top
      : featuresBottom;

    // Start animation when features header comes into view
    const featuresHeaderBottom = featuresContainer
      ? featuresTop + featuresContainer.offsetHeight
      : featuresTop;
    const featuresStartTrigger = featuresHeaderBottom - windowHeight * 0.8;
    const featuresEndTrigger = featuresBottom - windowHeight * 1.2;

    // Determine scroll direction
    const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
    lastScrollTop = scrollTop;

    // Check if we're in the active features section
    const inFeaturesSection =
      scrollTop >= featuresStartTrigger && scrollTop <= featuresEndTrigger;

    // Check if we've completed the features section
    const hasCompletedFeatures = scrollTop > featuresEndTrigger;

    if (hasCompletedFeatures && !isCompleted) {
      // Mark as completed - transition to static positioning like spaces section
      isCompleted = true;

      // Add completed class to features section
      featuresSection.classList.add("features--completed");

      spreads.forEach((spread, index) => {
        if (index === spreads.length - 1) {
          // Keep the last spread visible and transition to static positioning
          spread.style.position = "absolute";
          spread.style.top = "auto";
          spread.style.bottom = "0";
          spread.style.opacity = "1";
          spread.style.visibility = "visible";
          spread.style.transform = "translateY(0)";
          spread.classList.add("features__spread--visible");

          const elements = spread.querySelectorAll(
            ".features__spread-number, .features__spread-meta, .features__spread-text, .features__spread-visual"
          );
          elements.forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          });
        } else {
          // Hide previous spreads
          spread.style.opacity = "0";
          spread.style.visibility = "hidden";
          spread.style.transform = "translateY(-100%)";
          spread.classList.remove("features__spread--visible");
        }
      });

      ticking = false;
      return;
    }

    if (scrollTop < featuresStartTrigger) {
      // Before features section - reset everything
      isCompleted = false;
      featuresSection.classList.remove("features--completed");

      spreads.forEach((spread) => {
        spread.style.position = "fixed";
        spread.style.top = "0";
        spread.style.bottom = "auto";
        spread.style.opacity = "0";
        spread.style.visibility = "hidden";
        spread.style.transform = "translateY(100%)";
        spread.classList.remove("features__spread--visible");

        const elements = spread.querySelectorAll(
          ".features__spread-number, .features__spread-meta, .features__spread-text, .features__spread-visual"
        );
        elements.forEach((el) => {
          el.style.opacity = "0";
          el.style.transform = "translateY(50px)";
        });
      });
      ticking = false;
      return;
    }

    if (isCompleted && scrollDirection === "up" && inFeaturesSection) {
      // Re-entering features section from below - reset completed state and positioning
      isCompleted = false;
      featuresSection.classList.remove("features--completed");

      // Reset all spreads back to fixed positioning
      spreads.forEach((spread) => {
        spread.style.position = "fixed";
        spread.style.top = "0";
        spread.style.bottom = "auto";
      });
    }

    if (inFeaturesSection && !isCompleted) {
      // Active features section - handle progressive reveal
      const featuresScrollRange = featuresEndTrigger - featuresStartTrigger;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (scrollTop - featuresStartTrigger) / featuresScrollRange)
      );

      spreads.forEach((spread, index) => {
        const cardStartProgress = index * 0.2;
        const cardCompleteProgress = cardStartProgress + 0.15;
        const nextCardStartProgress = (index + 1) * 0.2;

        if (
          scrollProgress >= cardStartProgress &&
          (index === spreads.length - 1 ||
            scrollProgress < nextCardStartProgress)
        ) {
          // Current active card
          const cardProgress = Math.max(
            0,
            Math.min(
              1,
              (scrollProgress - cardStartProgress) /
                (cardCompleteProgress - cardStartProgress)
            )
          );

          let scale = 1;
          let opacity = 1;

          // Special handling for first card
          if (index === 0 && cardProgress < 1) {
            // First card: starts at scale(0.7) and scales up to scale(1)
            scale = 0.7 + cardProgress * 0.3; // 0.7 → 1.0
          }

          const translateY = (1 - cardProgress) * 100;
          spread.style.transform = `translateY(${translateY}%) scale(${scale})`;
          spread.style.opacity = opacity;
          spread.style.visibility = "visible";
          spread.classList.add("features__spread--visible");

          const elements = spread.querySelectorAll(
            ".features__spread-number, .features__spread-meta, .features__spread-text, .features__spread-visual"
          );

          if (cardProgress > 0.3) {
            elements.forEach((el) => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            });
          } else {
            elements.forEach((el) => {
              el.style.opacity = "0";
              el.style.transform = "translateY(50px)";
            });
          }
        } else if (scrollProgress < cardStartProgress) {
          // Card is before its time
          spread.style.transform = "translateY(100%)";
          spread.style.opacity = "0";
          spread.style.visibility = "hidden";
          spread.classList.remove("features__spread--visible");

          const elements = spread.querySelectorAll(
            ".features__spread-number, .features__spread-meta, .features__spread-text, .features__spread-visual"
          );
          elements.forEach((el) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(50px)";
          });
        } else if (scrollProgress >= cardCompleteProgress) {
          // Card has completed its entrance
          let scale = 1;
          let opacity = 1;

          // Check if the NEXT card is starting to come in
          if (index < spreads.length - 1) {
            const nextCardStart = (index + 1) * 0.2;
            if (scrollProgress >= nextCardStart) {
              // Next card is sliding in, so THIS card (previous) should scale out
              const nextCardProgress = Math.min(
                1,
                (scrollProgress - nextCardStart) / 0.15
              );
              scale = 1 - nextCardProgress * 0.2; // Scale from 1 to 0.8
              opacity = 1 - nextCardProgress * 0.3; // Fade from 1 to 0.7
            }
          }

          spread.style.transform = `translateY(0%) scale(${scale})`;
          spread.style.opacity = opacity;
          spread.style.visibility = "visible";
          spread.classList.add("features__spread--visible");

          const elements = spread.querySelectorAll(
            ".features__spread-number, .features__spread-meta, .features__spread-text, .features__spread-visual"
          );
          elements.forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          });
        }
      });
    }

    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateSpreadsOnScroll);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });

  // Initialize element transitions
  spreads.forEach((spread) => {
    const elements = spread.querySelectorAll(
      ".features__spread-number, .features__spread-meta, .features__spread-text, .features__spread-visual"
    );

    elements.forEach((el) => {
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      el.style.opacity = "0";
      el.style.transform = "translateY(50px)";
    });
  });

  updateSpreadsOnScroll();
}

/**=====================================================
 * Function that handles GSAP animations for features.
 ======================================================*/
function initFeaturesGSAP() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".features__spread").forEach((spread) => {
    gsap.to(spread, {
      backgroundPosition: "50% 20%",
      ease: "none",
      scrollTrigger: {
        trigger: spread,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    const quote = spread.querySelector(".features__spread-quote");
    if (quote) {
      gsap.fromTo(
        quote,
        { scale: 0.98 },
        {
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: quote,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    }
  });
}

/**=======================================================
 * Function that initializes all features functionality
 ========================================================*/
function initFeatures() {
  initFeaturesSliding();

  if (typeof gsap !== "undefined") {
    initFeaturesGSAP();
  }
}

/**==================================================================
 * Function that handles horizontal scroll based on vertical scroll
 ===================================================================*/
function initSpacesHorizontal() {
  const spacesSection = document.querySelector(".spaces__horizontal");
  if (!spacesSection) return;

  const spacesWrapper = document.querySelector(".spaces__wrapper");
  const slides = document.querySelectorAll(".spaces__slide");
  const scrollArea = document.querySelector(".spaces__scroll-area");

  // Calculate total width based on slides
  const totalSlides = slides.length;
  const slideWidth = window.innerWidth; // Each slide is 100vw
  const totalWidth = slideWidth * totalSlides;

  // Set wrapper width to accommodate all slides
  spacesWrapper.style.width = `${totalWidth}px`;

  // Set scroll area height based on number of slides and desired scroll speed
  const scrollMultiplier = 1.2;
  scrollArea.style.height = `${totalSlides * 100 * scrollMultiplier}vh`;

  let isFixed = false;
  let isCompleted = false;
  let lastScrollTop = 0; // Track last scroll position for direction detection

  // Track if we're actually scrolling
  let isScrolling = false;
  let scrollTimeout;

  // Update values on resize
  function updateDimensions() {
    const newSlideWidth = window.innerWidth;
    const newTotalWidth = newSlideWidth * totalSlides;

    spacesWrapper.style.width = `${newTotalWidth}px`;

    // If we're currently in the fixed state, update the transform
    if (isFixed && !isCompleted) {
      const scrollTop = window.pageYOffset;
      const sectionTop = spacesSection.offsetTop;
      const scrollableHeight = scrollArea.offsetHeight;

      const scrollProgress = (scrollTop - sectionTop) / scrollableHeight;
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      const transformX = -clampedProgress * (newTotalWidth - newSlideWidth);

      spacesWrapper.style.transform = `translateX(${transformX}px)`;
    }
  }

  // Handle scroll event
  function handleScroll() {
    const scrollTop = window.pageYOffset;
    const sectionTop = spacesSection.offsetTop;
    const sectionHeight = spacesSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableHeight = scrollArea.offsetHeight;

    // Determine scroll direction
    const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";

    const bufferHeight = viewportHeight * 0.5;
    const isInSectionRange =
      (scrollDirection === "down" &&
        scrollTop >= sectionTop &&
        scrollTop <= sectionTop + sectionHeight - viewportHeight) ||
      (scrollDirection === "up" &&
        scrollTop >= sectionTop - bufferHeight &&
        scrollTop <= sectionTop + sectionHeight - viewportHeight);

    if (isInSectionRange) {
      // Fix the wrapper when we're in the section
      if (!isFixed) {
        isFixed = true;
        spacesSection.classList.add("is-fixed");
      }

      const scrollProgress = Math.max(
        0,
        (scrollTop - sectionTop) / scrollableHeight
      );
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      const transformX = -clampedProgress * (totalWidth - slideWidth);

      // Apply the translation with smooth easing
      requestAnimationFrame(() => {
        spacesWrapper.style.transform = `translateX(${transformX}px)`;
      });

      // Reset completed state if we're scrolling back up
      if (scrollDirection === "up" && isCompleted) {
        isCompleted = false;
        spacesSection.classList.remove("completed");
      }
    } else if (
      scrollTop <
      sectionTop - (scrollDirection === "up" ? bufferHeight : 0)
    ) {
      if (isFixed) {
        isFixed = false;
        isCompleted = false;
        spacesSection.classList.remove("is-fixed", "completed");

        // Smooth transition back to start position
        requestAnimationFrame(() => {
          spacesWrapper.style.transform = "translateX(0)";
        });
      }
    } else if (scrollTop > sectionTop + sectionHeight - viewportHeight) {
      // Mark as completed when we've scrolled past, but don't force transform
      if (isFixed && !isCompleted) {
        isFixed = false;
        isCompleted = true;
        spacesSection.classList.remove("is-fixed");
        spacesSection.classList.add("completed");
      }
    }

    // Store last scroll position for direction detection
    lastScrollTop = scrollTop;

    // Reset scrolling flag after a delay
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 100);
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      isScrolling = true;
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  let resizeTimeout;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateDimensions();
      }, 100);
    },
    { passive: true }
  );
  updateDimensions();

  setTimeout(() => {
    handleScroll();
  }, 100);
}

/**=============================================
 *  Function that initializes GSAP animations.
 ==============================================*/
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Create a master timeline for coordinated animations
  const masterTL = gsap.timeline({ paused: true });

  // Hero section - more connected entrance
  const heroTL = gsap.timeline();
  
  heroTL
    .to(".hero__background img", {
      scale: 1,
      duration: 2.5,
      ease: "power3.out"
    })
    .from(".hero__title", {
      y: 100,
      opacity: 0,
      duration: 1.8,
      ease: "power4.out"
    }, "-=1.8")
    .from(".hero__caption", {
      x: 80,
      opacity: 0,
      duration: 1.6,
      ease: "power3.out"
    }, "-=1.2")
    .from(".hero__menu", {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "back.out(1.7)"
    }, "-=0.8");

  // Why section - orchestrated sequence
  ScrollTrigger.create({
    trigger: ".why__header",
    start: "top 85%",
    onEnter: () => {
      const whyTL = gsap.timeline();
      
      whyTL
        .from(".why__chapter-number", {
          scale: 0.3,
          rotation: -180,
          opacity: 0,
          duration: 1.5,
          ease: "back.out(1.7)"
        })
        .from(".why__chapter-info", {
          x: -50,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out"
        }, "-=1")
        .from(".why__headline", {
          y: 60,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out"
        }, "-=0.6")
        .from(".why__byline span", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.8");
    }
  });

  // Why content - flowing sequence
  ScrollTrigger.create({
    trigger: ".why__editorial",
    start: "top 80%",
    onEnter: () => {
      const contentTL = gsap.timeline();
      
      contentTL
        .from(".why__column--primary p", {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out"
        })
        .from(".why__pullquote", {
          scale: 0.9,
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: "back.out(1.7)"
        }, "-=0.5")
        .from(".why__stat", {
          y: 25,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out"
        }, "-=0.6")
        .from(".why__feature-image", {
          scale: 1.1,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out"
        }, "-=1")
        .from(".why__caption", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power2.out"
        }, "-=0.5");
    }
  });

  // Enhanced parallax with smoother performance
  gsap.utils.toArray("[data-parallax]").forEach(element => {
    const speed = element.dataset.parallax || -50;
    gsap.to(element, {
      yPercent: speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        refreshPriority: -1
      }
    });
  });

  // Community section - wave animation
  ScrollTrigger.create({
    trigger: ".community",
    start: "top 75%",
    onEnter: () => {
      gsap.from(".community__item", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: {
          amount: 0.6,
          from: "start",
          ease: "power2.out"
        },
        ease: "back.out(1.7)"
      });
      
      gsap.from(".community__quote", {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        delay: 0.8,
        ease: "elastic.out(1, 0.8)"
      });
    }
  });

  // Sustainability section - connected reveal
  ScrollTrigger.create({
    trigger: ".sustainability",
    start: "top 70%",
    onEnter: () => {
      const sustainTL = gsap.timeline();
      
      sustainTL
        .from(".sustainability__heading", {
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out"
        })
        .from(".sustainability__text", {
          x: -60,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out"
        }, "-=0.6")
        .from(".sustainability__features li", {
          x: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.8")
        .from(".sustainability__image", {
          scale: 1.1,
          opacity: 0,
          duration: 1.6,
          ease: "power3.out"
        }, "-=1.2");
    }
  });

  // Vision section - dramatic entrance
  ScrollTrigger.create({
    trigger: ".vision",
    start: "top 80%",
    onEnter: () => {
      gsap.from(".vision__content", {
        scale: 0.9,
        y: 100,
        opacity: 0,
        duration: 2,
        ease: "power4.out"
      });
    }
  });

  // Smooth scroll performance optimization
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    ignoreMobileResize: true
  });

  // Start the master timeline
  masterTL.play();
}

/**=========================================
 * Function that initializes all features.
 ==========================================*/
function init() {
  initLoader();
  initMenuToggle();
  initFeatures();
  initSpacesHorizontal();
}

document.addEventListener("DOMContentLoaded", init);
