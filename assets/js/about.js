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
}

/**=========================================
 * Initialize About page when DOM is ready.
 ==========================================*/
document.addEventListener("DOMContentLoaded", initAboutPage);
