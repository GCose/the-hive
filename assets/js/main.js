/**===============================
 *  Function that handles loading animation
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
 *  Function that handles menu overlay toggle
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
 *  Function that handles header state
 ================================*/
function initHeader() {
  const header = document.querySelector(".header");

  // Header scroll state for visibility on different sections
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  });
}

/**===============================
 *  Function that initializes smooth scrolling
 ================================*/
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: "smooth",
        });
      }
    });
  });
}

/**==========================================================
 *  Function that handles features scroll-triggered sliding.
 ===========================================================*/
function initFeaturesSliding() {
  const spreads = document.querySelectorAll(".features__spread");
  const featuresSection = document.querySelector(".features");
  const featuresContainer = document.querySelector(".features__container");
  const whySection = document.querySelector(".why");

  if (!spreads.length || !featuresSection || !whySection) return;

  // All spreads are part of the animation now
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
 *  Function that handles GSAP animations for features.
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
 *  Function that initializes all features functionality
 ========================================================*/
function initFeatures() {
  initFeaturesSliding();

  if (typeof gsap !== "undefined") {
    initFeaturesGSAP();
  }
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

  // Staggered animation for values
  gsap.from(".about__value", {
    scrollTrigger: {
      trigger: ".about__values",
      start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
  });

  // Spaces section animations
  gsap.from(".spaces__heading", {
    scrollTrigger: {
      trigger: ".spaces__heading",
      start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
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

  // Community section animations
  gsap.from(".community__heading", {
    scrollTrigger: {
      trigger: ".community__heading",
      start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  // Staggered animation for community items
  gsap.from(".community__item", {
    scrollTrigger: {
      trigger: ".community__grid",
      start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
  });

  gsap.from(".community__quote", {
    scrollTrigger: {
      trigger: ".community__quote",
      start: "top 80%",
    },
    scale: 0.9,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  // Sustainability section animations
  gsap.from(".sustainability__heading", {
    scrollTrigger: {
      trigger: ".sustainability__heading",
      start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(".sustainability__text", {
    scrollTrigger: {
      trigger: ".sustainability__text",
      start: "top 80%",
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  // Parallax effect for sustainability image
  gsap.to(".sustainability__parallax", {
    scrollTrigger: {
      trigger: ".sustainability__image",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    y: -100,
    ease: "none",
  });

  // Vision section animations
  gsap.to(".vision__parallax", {
    scrollTrigger: {
      trigger: ".vision",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    y: -100,
    ease: "none",
  });

  gsap.from(".vision__content", {
    scrollTrigger: {
      trigger: ".vision__content",
      start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  // Contact section animations
  gsap.from(".contact__heading", {
    scrollTrigger: {
      trigger: ".contact__heading",
      start: "top 80%",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(".contact__form-wrapper", {
    scrollTrigger: {
      trigger: ".contact__content",
      start: "top 80%",
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  gsap.from(".contact__info", {
    scrollTrigger: {
      trigger: ".contact__content",
      start: "top 80%",
    },
    x: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });
}

/**=========================================
 * Function that initializes all features.
 ==========================================*/
function init() {
  initLoader();
  initMenuToggle();
  initHeader();
  initSmoothScroll();
  initFeatures();
}

document.addEventListener("DOMContentLoaded", init);
