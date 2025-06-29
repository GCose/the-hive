/**=================================================
 * Function that handles About page initialization.
 ==================================================*/
function initAboutPage() {
  initSharedFeatures();
  initAboutAnimations();
}

/**==============================================
 * Function that handles About page animations.
 ===============================================*/
function initAboutAnimations() {
  // Hero image parallax effect
  const heroImage = document.querySelector(".about__hero-image img");

  if (heroImage) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transform = "scale(1)";
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(heroImage);
  }

  // Value cards stagger animation
  const valueCards = document.querySelectorAll(".about__value");

  if (valueCards.length > 0) {
    const valuesObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, index * 150);
            valuesObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    valueCards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      valuesObserver.observe(card);
    });
  }
}

/**=========================================
 * Initialize About page when DOM is ready.
 ==========================================*/
document.addEventListener("DOMContentLoaded", initAboutPage);
