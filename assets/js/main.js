/**===============================
 * Function that handles loading animation
 ================================*/
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

/**===============================
 * Function that handles header state
 ================================*/
// function initHeader() {
//   const header = document.querySelector(".header");

//   // Header scroll state for visibility on different sections
//   window.addEventListener("scroll", () => {
//     if (window.scrollY > 100) {
//       header.classList.add("header--scrolled");
//     } else {
//       header.classList.remove("header--scrolled");
//     }
//   });
// }

/**===============================
 * Function that initializes smooth scrolling
 ================================*/
// function initSmoothScroll() {
//   document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//     anchor.addEventListener("click", function (e) {
//       e.preventDefault();

//       const targetId = this.getAttribute("href");
//       if (targetId === "#") return;

//       const targetElement = document.querySelector(targetId);
//       if (targetElement) {
//         window.scrollTo({
//           top: targetElement.offsetTop - 80, // Adjust for header height
//           behavior: "smooth",
//         });
//       }
//     });
//   });
// }

/**==========================================================
 * Function that handles features scroll-triggered sliding.
 ===========================================================*/
function initFeaturesSliding() {
  const spreads = document.querySelectorAll(".features__spread");
  const featuresSection = document.querySelector(".features");
  const featuresContainer = document.querySelector(".features__container");
  const whySection = document.querySelector(".why");

  if (!spreads.length || !featuresSection || !whySection) return;

  spreads.forEach((spread, index) => {
    spread.style.transform = "translateY(100%)";
    spread.style.zIndex = 50 + index;
    spread.style.opacity = "0";
    spread.style.visibility = "hidden";
  });

  let ticking = false;

  function updateSpreadsOnScroll() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    const featuresRect = featuresSection.getBoundingClientRect();
    const featuresTop = scrollTop + featuresRect.top;
    const featuresBottom = featuresTop + featuresSection.offsetHeight;
    const spacesSection = document.querySelector(".spaces");
    const spacesTop = spacesSection
      ? scrollTop + spacesSection.getBoundingClientRect().top
      : featuresBottom;

    // Start animation when features header comes into view
    const featuresHeaderBottom = featuresContainer
      ? featuresTop + featuresContainer.offsetHeight
      : featuresTop;
    const featuresStartTrigger = featuresHeaderBottom - windowHeight * 0.8;
    const featuresEndTrigger = Math.min(
      featuresBottom - windowHeight,
      spacesTop - windowHeight
    );

    const inFeaturesSection =
      scrollTop >= featuresStartTrigger && scrollTop <= featuresEndTrigger;

    if (!inFeaturesSection) {
      spreads.forEach((spread) => {
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

    const featuresScrollRange = featuresEndTrigger - featuresStartTrigger;
    const scrollProgress = Math.max(
      0,
      Math.min(1, (scrollTop - featuresStartTrigger) / featuresScrollRange)
    );

    spreads.forEach((spread, index) => {
      const cardStartProgress = index * 0.2; // 5 cards, so 0.2 each
      const cardCompleteProgress = cardStartProgress + 0.15;
      const nextCardStartProgress = (index + 1) * 0.2;

      if (
        scrollProgress >= cardStartProgress &&
        (index === spreads.length - 1 || scrollProgress < nextCardStartProgress)
      ) {
        const cardProgress = Math.max(
          0,
          Math.min(
            1,
            (scrollProgress - cardStartProgress) /
              (cardCompleteProgress - cardStartProgress)
          )
        );

        const translateY = (1 - cardProgress) * 100;
        spread.style.transform = `translateY(${translateY}%)`;
        spread.style.opacity = "1";
        spread.style.visibility = "visible";
        spread.classList.add("features__spread--visible");

        const elements = spread.querySelectorAll(
          ".features__spread-number, .features__spread-meta, .features__spread-text, .features__spread-visual"
        );

        if (cardProgress > 0.3) {
          elements.forEach((el, elIndex) => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            el.style.transitionDelay = `${elIndex * 0.1}s`;
          });
        } else {
          elements.forEach((el) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(50px)";
            el.style.transitionDelay = "0s";
          });
        }
      } else if (scrollProgress < cardStartProgress) {
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
          el.style.transitionDelay = "0s";
        });
      } else if (scrollProgress >= cardCompleteProgress) {
        spread.style.transform = "translateY(0)";
        spread.style.opacity = "1";
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

    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateSpreadsOnScroll);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });

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
  const scrollMultiplier = 1.2; // Adjust to change scroll sensitivity
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

    // FIX FOR ISSUE #3: Proper handling of scrolling back up
    // Improved condition to check if we're in the spaces section
    // For smoother transition, include a buffer when scrolling up
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

      // Calculate horizontal translation based on vertical scroll
      // For scrolling up, ensure we use the proper range to prevent jumps
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
      // Reset when scrolling above the section
      // Only reset if we're sufficiently above the section to prevent flickering
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

        // No forced transform - let scroll position determine final position
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

  // Use passive scroll event listener with improved throttling
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

  // Handle resize with debouncing
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

  // Initial setup
  updateDimensions();

  // Delay initial handleScroll to ensure proper positioning
  setTimeout(() => {
    handleScroll();
  }, 100);
}

/**=============================================
 *  Function that initializes GSAP animations.
 ==============================================*/
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero section animations
  gsap.to(".hero__bg-image", {
    scale: 1,
    duration: 2,
    ease: "power2.out",
  });

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

  // Chapter header animation
  gsap.from(".why__chapter-number", {
    scrollTrigger: {
      trigger: ".why__header",
      start: "top 80%",
    },
    scale: 0.5,
    opacity: 0,
    duration: 5,
    ease: "power3.out",
  });

  gsap.from(".why__chapter-info", {
    scrollTrigger: {
      trigger: ".why__header",
      start: "top 80%",
    },
    x: -30,
    opacity: 0,
    duration: 4,
    delay: 0.3,
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

  // Parallax effect for about image
  gsap.to(".about__image-parallax", {
    scrollTrigger: {
      trigger: ".about__image",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    y: -100,
    ease: "none",
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
  // initHeader();
  // initSmoothScroll();
  initFeatures();
  initSpacesHorizontal();
}

document.addEventListener("DOMContentLoaded", init);
