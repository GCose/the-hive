/**=======================================
 * Function that handles checkbox limits
 ========================================*/
function initCheckboxLimits() {
  const checkboxes = document.querySelectorAll(
    'input[name="workspaceMatters"]'
  );
  const helpText = document.querySelector(
    '.contact__field:has(input[name="workspaceMatters"]) small'
  );

  const updateCount = () => {
    const checked = document.querySelectorAll(
      'input[name="workspaceMatters"]:checked'
    ).length;
    if (helpText)
      helpText.textContent = `Select up to 3 options (${checked}/3 selected)`;
  };

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateCount);
  });
}

/**=======================================
   * Function that handles form submission
   ========================================*/
function initFormSubmission() {
  const form = document.querySelector(".contact__form");
  const submitBtn = document.querySelector(".contact__submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    submitBtn.textContent = "Sent Successfully!";
    submitBtn.style.background = "var(--color-primary)";
    submitBtn.style.color = "var(--color-white)";

    setTimeout(() => {
      form.reset();
      submitBtn.textContent = "Submit & Request a Tour";
      submitBtn.style.background = "";
      submitBtn.style.color = "";
      submitBtn.disabled = false;

      // Reset help text
      const helpText = document.querySelector(
        '.contact__field:has(input[name="workspaceMatters"]) small'
      );
      if (helpText) helpText.textContent = "Select up to 3 options";
    }, 3000);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCheckboxLimits();
  initFormSubmission();
});
