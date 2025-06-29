/**===========================================
 * Function that initializes shared features.
 ============================================*/
function initSharedFeatures() {
  initLoader();
  initMenuToggle();
  initScrollAnimations();
}

/**=========================================
 * Function that handles loading animation.
 ==========================================*/
function initLoader() {
  const loader = document.querySelector(".loader");
  const progressNumber = document.querySelector(".loader__progress-number");

  if (!loader || !progressNumber) return;

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
        initScrollAnimations();
      }, 500);
    }
  }, 150);
}

/**============================================
 * Function that handles menu overlay toggle.
 =============================================*/
function initMenuToggle() {
  const menuToggle = document.querySelector(".menu__toggle");
  const menuClose = document.querySelector(".menu__close");
  const menuOverlay = document.querySelector(".menu__overlay");
  const menuLinks = document.querySelectorAll(".menu__link");

  if (!menuToggle || !menuClose || !menuOverlay) return;

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

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      menuOverlay.classList.contains("menu__overlay--active")
    ) {
      closeMenu();
    }
  });
}

/**=========================================
 * Function that handles scroll animations.
 ==========================================*/
function initScrollAnimations() {
  const scrollTextElements = document.querySelectorAll(
    ".section__chapter-title, .features__spread-title, .spaces__slide-title, .spaces__chapter-title"
  );

  const textObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateTextReveal(entry.target);
          textObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.7 }
  );

  scrollTextElements.forEach((el) => textObserver.observe(el));
}

/**==============================================
 * Function that handles text reveal animation.
 ===============================================*/
function animateTextReveal(element) {
  if (element.classList.contains("text-revealed")) return;

  const text = element.textContent;
  const words = text.split(" ");
  element.innerHTML = "";

  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.style.display = "inline-block";
    wordSpan.style.overflow = "hidden";
    wordSpan.style.padding = "0.5rem";

    const letters = word.split("");
    letters.forEach((letter, letterIndex) => {
      const letterSpan = document.createElement("span");
      letterSpan.textContent = letter;
      letterSpan.style.display = "inline-block";
      letterSpan.style.transform = "translateY(100%)";
      letterSpan.style.transition = `transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      letterSpan.style.transitionDelay = `${
        wordIndex * 0.1 + letterIndex * 0.05
      }s`;

      wordSpan.appendChild(letterSpan);
    });

    element.appendChild(wordSpan);
  });

  setTimeout(() => {
    element.querySelectorAll("span span").forEach((letter) => {
      letter.style.transform = "translateY(0)";
    });
  }, 100);

  element.classList.add("text-revealed");
}

/**==============================================
 * Initialize shared features when DOM is ready.
 ===============================================*/
document.addEventListener("DOMContentLoaded", initSharedFeatures);
