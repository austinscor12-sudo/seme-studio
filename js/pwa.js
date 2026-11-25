let deferredPrompt = null;

const btnInstallNav = document.getElementById("btnInstallNav");
const btnInstallMain = document.getElementById("btnInstallMain");
const btnManualPwa = document.getElementById("btnManualPwa");
const pwaStatusText = document.getElementById("pwaStatusText");
const pwaHelpModal = document.getElementById("pwaHelpModal");
const pwaHelpClose = document.getElementById("pwaHelpClose");

// Registrar Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => console.log("Service Worker PWA registrado."))
      .catch((err) => console.warn("Error registrando Service Worker:", err));
  });
}

// Capturar evento nativo de instalación en Android / Chrome / Edge
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (pwaStatusText) {
    pwaStatusText.textContent = "Tu navegador soporta instalación directa con un clic.";
  }
});

async function ejecutarInstalacionPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted" && pwaStatusText) {
      pwaStatusText.textContent = "¡SEME STUDIO se está instalando en tu dispositivo!";
    }
    deferredPrompt = null;
  } else if (pwaHelpModal) {
    pwaHelpModal.classList.add("open");
    pwaHelpModal.setAttribute("aria-hidden", "false");
  }
}

if (btnInstallNav) btnInstallNav.addEventListener("click", ejecutarInstalacionPWA);
if (btnInstallMain) btnInstallMain.addEventListener("click", ejecutarInstalacionPWA);

if (btnManualPwa && pwaHelpModal) {
  btnManualPwa.addEventListener("click", () => {
    pwaHelpModal.classList.add("open");
    pwaHelpModal.setAttribute("aria-hidden", "false");
  });
}

if (pwaHelpClose && pwaHelpModal) {
  pwaHelpClose.addEventListener("click", () => {
    pwaHelpModal.classList.remove("open");
    pwaHelpModal.setAttribute("aria-hidden", "true");
  });
}

window.addEventListener("appinstalled", () => {
  if (pwaStatusText) {
    pwaStatusText.textContent = "App instalada correctamente en tu pantalla de inicio.";
  }
});