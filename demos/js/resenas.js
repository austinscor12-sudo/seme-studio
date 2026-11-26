const DESCRIPCION_ESTRELLAS = {
  1: "1 ★ — Muy disconforme (activa buzón privado)",
  2: "2 ★ — Regular (activa buzón privado)",
  3: "3 ★ — Aceptable, pero mejorable (activa buzón privado)",
  4: "4 ★ — ¡Muy buena! (activa Google Maps)",
  5: "5 ★ — ¡Excelente! (activa Google Maps)"
};

const HISTORIAL_FEEDBACK = [
  {
    titulo: "5 ★ • Florencia M.",
    detalle: "Redirigida directamente a ficha de Google Maps",
    tipo: "public",
    badge: "Google Maps ↗",
    nuevo: false
  },
  {
    titulo: "2 ★ • Rodrigo Acosta (Privado)",
    detalle: "Motivo: Demora en el pedido • Resuelto por encargado",
    tipo: "private",
    badge: "Contenida 🛡️",
    nuevo: false
  },
  {
    titulo: "5 ★ • Marcos Villalba",
    detalle: "Redirigido directamente a ficha de Google Maps",
    tipo: "public",
    badge: "Google Maps ↗",
    nuevo: false
  }
];

let estrellasSeleccionadas = 0;
let motivoSeleccionado = "Demora en el pedido";
let totalGoogle = 48;
let totalContenidas = 6;

const starsRow = document.getElementById("starsRow");
const googleRoutePanel = document.getElementById("googleRoutePanel");
const privateRouteForm = document.getElementById("privateRouteForm");
const resultModal = document.getElementById("resultModal");

function mostrarToast(texto) {
  const toast = document.getElementById("toastMsg");
  toast.textContent = texto;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function seleccionarEstrellas(valor) {
  estrellasSeleccionadas = valor;

  document.querySelectorAll(".star-btn").forEach((btn) => {
    const starVal = Number(btn.dataset.val);
    btn.classList.toggle("active", starVal <= valor);
  });

  document.getElementById("ratingCaption").textContent = DESCRIPCION_ESTRELLAS[valor];

  if (valor >= 4) {
    googleRoutePanel.classList.remove("hidden");
    privateRouteForm.classList.add("hidden");
  } else {
    privateRouteForm.classList.remove("hidden");
    googleRoutePanel.classList.add("hidden");
  }
}

function renderFeed() {
  document.getElementById("googleCountVal").textContent = totalGoogle;
  document.getElementById("containedCountVal").textContent = totalContenidas;

  document.getElementById("feedbackFeedList").innerHTML = HISTORIAL_FEEDBACK.map(
    (item) => `
      <div class="feed-row ${item.nuevo ? "is-new" : ""}">
        <div class="feed-left">
          <strong>${item.titulo} ${item.nuevo ? "🆕" : ""}</strong>
          <span>${item.detalle}</span>
        </div>
        <span class="feed-pill ${item.tipo}">${item.badge}</span>
      </div>
    `
  ).join("");
}

// Clic en estrellas
starsRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".star-btn");
  if (!btn) return;
  seleccionarEstrellas(Number(btn.dataset.val));
});

// Copiar frase sugerida
document.getElementById("copyPhraseBtn").addEventListener("click", () => {
  const frase = document.getElementById("suggestedText").textContent.replaceAll('"', "");
  navigator.clipboard?.writeText(frase);
  mostrarToast("Frase sugerida copiada ✓");
});

// Simular envío a Google Maps (4-5 estrellas)
document.getElementById("simulateGoogleBtn").addEventListener("click", () => {
  totalGoogle += 1;
  HISTORIAL_FEEDBACK.unshift({
    titulo: `${estrellasSeleccionadas} ★ • Cliente en Local`,
    detalle: "Enviado directo al formulario de reseña de Google Maps",
    tipo: "public",
    badge: "Google Maps ↗",
    nuevo: true
  });
  renderFeed();

  document.getElementById("modalIcon").textContent = "⭐";
  document.getElementById("modalTag").textContent = "POSICIONAMIENTO GOOGLE MAPS";
  document.getElementById("modalTitle").textContent = `¡Reseña ${estrellasSeleccionadas}★ enviada a Google!`;
  document.getElementById("modalDesc").textContent =
    "En la versión real, el cliente aterriza directo en la ventana de calificación de tu ficha de Google Maps sin pasos extra.";
  resultModal.classList.add("open");
});

// Etiquetas de motivo en formulario privado
document.getElementById("issueTags").addEventListener("click", (e) => {
  const tagBtn = e.target.closest(".issue-tag");
  if (!tagBtn) return;
  document.querySelectorAll(".issue-tag").forEach((b) => b.classList.remove("active"));
  tagBtn.classList.add("active");
  motivoSeleccionado = tagBtn.dataset.tag;
});

// Envío de queja privada (1-3 estrellas)
privateRouteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  totalContenidas += 1;

  const contacto = document.getElementById("privateContact").value.trim() || "Cliente anónimo";
  HISTORIAL_FEEDBACK.unshift({
    titulo: `${estrellasSeleccionadas} ★ • ${contacto}`,
    detalle: `Motivo: ${motivoSeleccionado} • Enviado por privado al dueño`,
    tipo: "private",
    badge: "Contenida 🛡️",
    nuevo: true
  });
  renderFeed();

  document.getElementById("modalIcon").textContent = "🛡️";
  document.getElementById("modalTag").textContent = "REPUTACIÓN PROTEGIDA";
  document.getElementById("modalTitle").textContent = "Alerta privada enviada al dueño";
  document.getElementById("modalDesc").textContent =
    "El cliente descargó su reclamo en privado y el dueño recibió el aviso al instante por WhatsApp para revertir la experiencia.";
  resultModal.classList.add("open");
});

document.getElementById("closeModalBtn").addEventListener("click", () => {
  resultModal.classList.remove("open");
});

// Inicializar historial
renderFeed();