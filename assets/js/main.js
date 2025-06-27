/**=========================================
 * Function that handles loading animation
 ==========================================*/
function initLoader() {
  const loader = document.querySelector(".loader");
  const progressNumber = document.querySelector(".loader__progress-number");

  let loadProgress = 0;
  const interval = setInterval(() => {
    loadProgress += Math.random() * 8 + 2;
    if (loadProgress > 100) loadProgress = 100;

    progressNumber.textContent = Math.floor(loadProgress);

    if (loadProgress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add("loader--hidden");
        document.body.style.overflow = "visible";
        initAnimations();
      }, 500);
    }
  }, 150);
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

  // Initial setup - hide all spreads and set positioning
  spreads.forEach((spread, index) => {
    spread.style.zIndex = 1 + index;
  });

  let ticking = false;
  let lastScrollTop = 0;
  let isCompleted = false;

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
    const featuresStartTrigger = featuresHeaderBottom - windowHeight * 0.5;
    const featuresEndTrigger = featuresBottom - windowHeight * 1.2;

    // Determine scroll direction
    const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
    lastScrollTop = scrollTop;

    // Check if we're in the active features section
    const inFeaturesSection =
      scrollTop >= featuresStartTrigger && scrollTop <= featuresEndTrigger;

    const hasCompletedFeatures = scrollTop > featuresEndTrigger;

    if (hasCompletedFeatures && !isCompleted) {
      // Mark as completed - transition to static positioning
      isCompleted = true;

      featuresSection.classList.add("features--completed");

      spreads.forEach((spread, index) => {
        // Keep all spreads visible and transition to static positioning
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

          // The spread needs to slide from below the viewport considering its margins
          const viewportHeight = window.innerHeight;
          const marginTop = viewportHeight * 0.015;
          const marginBottom = viewportHeight * 0.015;
          const effectiveHeight = viewportHeight - marginTop - marginBottom;

          // Calculate translateY to account for margins
          const initialOffset = effectiveHeight + marginBottom;
          const translateY = (1 - cardProgress) * initialOffset;

          spread.style.transform = `translateY(${translateY}px) scale(${scale})`;
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
          // Card is before its time - position it below the viewport
          const viewportHeight = window.innerHeight;
          const marginBottom = viewportHeight * 0.015;
          const effectiveHeight = viewportHeight - viewportHeight * 0.03;
          const initialOffset = effectiveHeight + marginBottom;

          spread.style.transform = `translateY(${initialOffset}px)`;
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

          spread.style.transform = `translateY(0px) scale(${scale})`;
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

  // Handle window resize to recalculate margins
  window.addEventListener(
    "resize",
    () => {
      requestScrollUpdate();
    },
    { passive: true }
  );

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

/**==================================================================
 * Function that handles horizontal scroll based on vertical scroll
 ===================================================================*/
function initSpacesHorizontal() {
  const spacesSection = document.querySelector(".spaces__horizontal");
  if (!spacesSection) return;

  const spacesWrapper = document.querySelector(".spaces__wrapper");
  const slides = document.querySelectorAll(".spaces__slide");
  const scrollArea = document.querySelector(".spaces__scroll-area");

  const totalSlides = slides.length;

  function updateDimensions() {
    const slideWidth = window.innerWidth;
    const totalWidth = slideWidth * totalSlides;
    spacesWrapper.style.width = `${totalWidth}px`;

    const transformDistance = (totalSlides - 1) * slideWidth;
    const viewportEquivalent = transformDistance / slideWidth; // How many "screens"
    const scrollHeight = (viewportEquivalent + 1) * 100; // +1 for the section itself

    scrollArea.style.height = `${scrollHeight}vh`;
  }

  let isFixed = false;
  let isCompleted = false;
  let lastScrollTop = 0;

  function handleScroll() {
    const scrollTop = window.pageYOffset;
    const sectionTop = spacesSection.offsetTop;
    const sectionHeight = spacesSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";

    const sectionStart = sectionTop;
    const sectionEnd = sectionTop + sectionHeight - viewportHeight;
    const isInSection = scrollTop >= sectionStart && scrollTop <= sectionEnd;

    if (isInSection) {
      if (!isFixed) {
        isFixed = true;
        spacesSection.classList.add("is-fixed");
      }

      const scrollIntoSection = scrollTop - sectionStart;
      const maxScroll = sectionEnd - sectionStart;
      const scrollProgress = scrollIntoSection / maxScroll;
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

      const slideWidth = window.innerWidth;
      const maxTransform = (totalSlides - 1) * slideWidth;
      const transformX = -clampedProgress * maxTransform;

      requestAnimationFrame(() => {
        spacesWrapper.style.transform = `translateX(${transformX}px)`;
      });

      if (scrollDirection === "up" && isCompleted) {
        isCompleted = false;
        spacesSection.classList.remove("completed");
      }
    } else if (scrollTop < sectionStart) {
      if (isFixed) {
        isFixed = false;
        isCompleted = false;
        spacesSection.classList.remove("is-fixed", "completed");
        requestAnimationFrame(() => {
          spacesWrapper.style.transform = "translateX(0)";
        });
      }
    } else if (scrollTop > sectionEnd) {
      if (isFixed && !isCompleted) {
        isFixed = false;
        isCompleted = true;
        spacesSection.classList.remove("is-fixed");
        spacesSection.classList.add("completed");
      }
    }

    lastScrollTop = scrollTop;
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
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

  window.addEventListener("resize", updateDimensions, { passive: true });

  updateDimensions();
  setTimeout(handleScroll, 100);
}

/**=============================================
 * Function that initializes GSAP animations.
 ==============================================*/
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Chapter header animation
  gsap.from(".chapter__chapter-number", {
    scrollTrigger: {
      trigger: ".chapter__header",
      start: "top 80%",
    },
    scale: 0.5,
    opacity: 0,
    duration: 5,
    ease: "power3.out",
  });

  gsap.from(".chapter__chapter-info", {
    scrollTrigger: {
      trigger: ".chapter__header",
      start: "top 80%",
    },
    x: -30,
    opacity: 0,
    duration: 4,
    delay: 0.3,
    ease: "power3.out",
  });

  // Hero section animation
  gsap.from(".hero__title", {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power3.out",
  });

  gsap.from(".hero__caption", {
    x: 50,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power3.out",
  });

  gsap.from(".why__headline", {
    scrollTrigger: {
      trigger: ".why__lead-content",
      start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 5,
    ease: "power3.out",
  });

  gsap.from(".why__byline", {
    scrollTrigger: {
      trigger: ".why__lead-content",
      start: "top 80%",
    },
    y: 30,
    opacity: 0,
    duration: 3,
    delay: 0.2,
    ease: "power3.out",
  });

  gsap.from(".why__column--primary", {
    scrollTrigger: {
      trigger: ".why__columns",
      start: "top 80%",
    },
    x: -50,
    opacity: 0,
    duration: 6,
    ease: "power3.out",
  });

  gsap.from(".why__pullquote", {
    scrollTrigger: {
      trigger: ".why__column--secondary",
      start: "top 80%",
    },
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.8,
    ease: "power3.out",
  });

  // Stats animation with stagger
  gsap.from(".why__stat", {
    scrollTrigger: {
      trigger: ".why__stats",
      start: "top 80%",
    },
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
  });

  // Feature image animation
  gsap.from(".why__feature-image img", {
    scrollTrigger: {
      trigger: ".why__feature-image",
      start: "top 80%",
    },
    scale: 1.1,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(".why__caption", {
    scrollTrigger: {
      trigger: ".why__feature-image",
      start: "top 80%",
    },
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power3.out",
  });

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

  // Each space item animation
  document.querySelectorAll(".spaces__item").forEach((item) => {
    // Content animation
    gsap.from(item.querySelector(".spaces__item-content"), {
      scrollTrigger: {
        trigger: item,
        start: "top 70%",
      },
      x: item.classList.contains("spaces__item:nth-child(even)") ? 50 : -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Parallax effect for spaces images
    gsap.to(item.querySelector(".spaces__parallax"), {
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: -100,
      ease: "none",
    });
  });
}

/**=========================================
 * Function that initializes all features.
 ==========================================*/
function init() {
  initLoader();
  initMenuToggle();
  initFeaturesSliding();
  initSpacesHorizontal();
}

document.addEventListener("DOMContentLoaded", init);
