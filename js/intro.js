document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("introOverlay");
  const skipBtn = document.getElementById("skipIntroBtn");
  const percentEl = document.getElementById("introPercent");

  if (!overlay) {
    document.body.classList.remove("intro-active");
    return;
  }

  let closed = false;
  let progress = 0;

  // Contador fluido de 0% a 100% sincronizado con la barra
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
    document.body.classList.remove("intro-active");

    setTimeout(() => {
      overlay.remove();
    }, 680);
  }

  // Cierre automático al terminar la cinemática (2.65s)
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