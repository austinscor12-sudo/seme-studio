(function () {
  const overlay = document.getElementById("introOverlay");
  const skipBtn = document.getElementById("skipIntroBtn");
  const body = document.body;

  if (!overlay) {
    body.classList.remove("intro-active");
    body.classList.add("site-ready");
    return;
  }

  let finalizado = false;

  function finalizarCinematica() {
    if (finalizado) return;
    finalizado = true;

    // Inicia la salida tipo telón y habilita la entrada en cascada del Hero
    overlay.classList.add("is-leaving");
    body.classList.remove("intro-active");
    body.classList.add("site-ready");

    // Desactiva el overlay por completo cuando termina la transición de salida
    setTimeout(() => {
      overlay.style.display = "none";
    }, 750);
  }

  // Tiempo total de la cinemática antes de levantar el telón
  const timerPrincipal = setTimeout(finalizarCinematica, 2200);

  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      clearTimeout(timerPrincipal);
      finalizarCinematica();
    });
  }
})();