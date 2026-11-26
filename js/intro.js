document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("introOverlay");
  const skipBtn = document.getElementById("skipIntroBtn");
  const percentEl = document.getElementById("introPercent");

  function revealHeroContent() {
    document.body.classList.remove("intro-active");
    document.querySelectorAll(".reveal-item").forEach((el) => {
      el.classList.add("is-visible", "revealed", "active");
    });
    window.dispatchEvent(new Event("introFinished"));
  }

  if (!overlay) {
    revealHeroContent();
    return;
  }

  let closed = false;
  let progress = 0;

  const counterInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 9) + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(counterInterval);
    }
    if (percentEl) percentEl.textContent = `${progress}%`;
  }, 110);

  function closeIntro() {
    if (closed) return;
    closed = true;
    clearInterval(counterInterval);
    if (percentEl) percentEl.textContent = "100%";

    overlay.classList.add("is-leaving");
    revealHeroContent();

    setTimeout(() => {
      overlay.remove();
    }, 680);
  }

  const autoTimer = setTimeout(closeIntro, 2650);

  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      clearTimeout(autoTimer);
      closeIntro();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      clearTimeout(autoTimer);
      closeIntro();
    }
  });
});