/**======================================================
 * Function that handles scroll-based section detection
 =======================================================*/
function initSectionObservers() {
  const featuresSection = document.querySelector(".features");
  const spacesSection = document.querySelector(".spaces__horizontal");

  let featuresScrollHandler = null;
  let spacesScrollHandler = null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === featuresSection) {
          if (entry.isIntersecting) {
            featuresScrollHandler = createFeaturesScrollHandler();
            window.addEventListener("scroll", featuresScrollHandler, {
              passive: true,
            });
          } else {
            if (featuresScrollHandler) {
              window.removeEventListener("scroll", featuresScrollHandler);
              featuresScrollHandler = null;
            }
          }
        }

        if (entry.target === spacesSection) {
          if (entry.isIntersecting) {
            spacesScrollHandler = createSpacesScrollHandler();
            window.addEventListener("scroll", spacesScrollHandler, {
              passive: true,
            });
          } else {
            if (spacesScrollHandler) {
              window.removeEventListener("scroll", spacesScrollHandler);
              spacesScrollHandler = null;
            }
          }
        }
      });
    },
    {
      rootMargin: "20% 0px 20% 0px",
    }
  );

  if (featuresSection) observer.observe(featuresSection);
  if (spacesSection) observer.observe(spacesSection);
}

/**================================================
 * Function that creates features scroll handler
 =================================================*/
function createFeaturesScrollHandler() {
  const spreads = document.querySelectorAll(".features__spread");
  const featuresSection = document.querySelector(".features");
  const featuresContainer = document.querySelector(".features__container");

  // Cache DOM measurements
  let cachedFeaturesTop = featuresSection.offsetTop;
  let cachedFeaturesHeight = featuresSection.offsetHeight;
  let cachedFeaturesBottom = cachedFeaturesTop + cachedFeaturesHeight;
  let cachedContainerHeight = featuresContainer
    ? featuresContainer.offsetHeight
    : 0;

  // Update cache on resize
  const updateCache = () => {
    cachedFeaturesTop = featuresSection.offsetTop;
    cachedFeaturesHeight = featuresSection.offsetHeight;
    cachedFeaturesBottom = cachedFeaturesTop + cachedFeaturesHeight;
    cachedContainerHeight = featuresContainer
      ? featuresContainer.offsetHeight
      : 0;
  };

  window.addEventListener("resize", updateCache, { passive: true });

  spreads.forEach((spread, index) => {
    spread.style.zIndex = 1 + index;
    spread.style.transform = `translate3d(0, ${cachedFeaturesHeight}px, 0)`;
    spread.style.opacity = "0";
    spread.style.visibility = "hidden";
    spread.classList.remove("features__spread--visible");
  });

  let ticking = false;
  let lastScrollTop = 0;
  let isCompleted = false;

  return function handleFeaturesScroll() {
    if (ticking) return;

    requestAnimationFrame(() => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;

      const featuresHeaderBottom = cachedFeaturesTop + cachedContainerHeight;
      const featuresStartTrigger = featuresHeaderBottom - windowHeight * 0.8;
      const featuresEndTrigger = cachedFeaturesBottom - windowHeight * 1.2;

      const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
      lastScrollTop = scrollTop;

      const inFeaturesSection =
        scrollTop >= featuresStartTrigger && scrollTop <= featuresEndTrigger;

      const hasCompletedFeatures = scrollTop > featuresEndTrigger;

      if (hasCompletedFeatures && !isCompleted) {
        isCompleted = true;
        featuresSection.classList.add("features--completed");

        spreads.forEach((spread) => {
          spread.style.position = "absolute";
          spread.style.top = "auto";
          spread.style.bottom = "0";
          spread.style.opacity = "1";
          spread.style.visibility = "visible";
          spread.style.transform = "translate3d(0, 0, 0)";
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
        isCompleted = false;
        featuresSection.classList.remove("features--completed");

        spreads.forEach((spread) => {
          spread.style.position = "fixed";
          spread.style.top = "0";
          spread.style.bottom = "auto";
        });
      }

      if (inFeaturesSection && !isCompleted) {
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

            if (index === 0 && cardProgress < 1) {
              scale = 0.7 + cardProgress * 0.3;
            }

            const marginTop = cachedFeaturesHeight * 0.015;
            const marginBottom = cachedFeaturesHeight * 0.015;
            const effectiveHeight =
              cachedFeaturesHeight - marginTop - marginBottom;

            const initialOffset = effectiveHeight + marginBottom;
            const translateY = (1 - cardProgress) * initialOffset;

            spread.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
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
            const marginBottom = cachedFeaturesHeight * 0.015;
            const effectiveHeight =
              cachedFeaturesHeight - cachedFeaturesHeight * 0.03;
            const initialOffset = effectiveHeight + marginBottom;

            spread.style.transform = `translate3d(0, ${initialOffset}px, 0)`;
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
            let scale = 1;
            let opacity = 1;

            if (index < spreads.length - 1) {
              const nextCardStart = (index + 1) * 0.2;
              if (scrollProgress >= nextCardStart) {
                const nextCardProgress = Math.min(
                  1,
                  (scrollProgress - nextCardStart) / 0.15
                );
                scale = 1 - nextCardProgress * 0.2;
                opacity = 1 - nextCardProgress * 0.3;
              }
            }

            spread.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
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
    });

    ticking = true;
  };
}

/**========================================================
 * Function that creates spaces horizontal scroll handler
 =========================================================*/
function createSpacesScrollHandler() {
  const spacesSection = document.querySelector(".spaces__horizontal");
  const spacesWrapper = document.querySelector(".spaces__wrapper");
  const slides = document.querySelectorAll(".spaces__slide");

  const totalSlides = slides.length;

  let cachedSectionTop = spacesSection.offsetTop;
  let cachedSectionHeight = spacesSection.offsetHeight;

  const updateCache = () => {
    cachedSectionTop = spacesSection.offsetTop;
    cachedSectionHeight = spacesSection.offsetHeight;
  };

  function updateDimensions() {
    const slideWidth = window.innerWidth;
    const totalWidth = slideWidth * totalSlides;
    spacesWrapper.style.width = `${totalWidth}px`;
    updateCache();
  }

  const isCurrentlyFixed = spacesSection.classList.contains("is-fixed");
  const isCurrentlyCompleted = spacesSection.classList.contains("completed");

  let isFixed = isCurrentlyFixed;
  let isCompleted = isCurrentlyCompleted;
  let lastScrollTop = window.pageYOffset;

  updateDimensions();
  window.addEventListener("resize", updateDimensions, { passive: true });

  return function handleSpacesScroll() {
    updateCache();

    const scrollTop = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";

    const sectionStart = cachedSectionTop;
    const sectionEnd = cachedSectionTop + cachedSectionHeight - viewportHeight;
    const isInSection = scrollTop >= sectionStart && scrollTop <= sectionEnd;

    if (isInSection) {
      if (isCompleted) {
        isCompleted = false;
        spacesSection.classList.remove("completed");
      }

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

      spacesWrapper.style.transform = `translate3d(${transformX}px, 0, 0)`;
    } else if (scrollTop < sectionStart) {
      if (isFixed) {
        isFixed = false;
        isCompleted = false;
        spacesSection.classList.remove("is-fixed", "completed");
        spacesWrapper.style.transform = "translate3d(0, 0, 0)";
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
  };
}

document.addEventListener("DOMContentLoaded", initSectionObservers);
