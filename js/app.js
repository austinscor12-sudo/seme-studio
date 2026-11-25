import { registrarInteraccionDemo } from "./firebase-config.js";

const WHATSAPP_NUMERO = "5493794860604";
const servicesGrid = document.getElementById("servicesGrid");
const filterBar = document.getElementById("filterBar");
const serviceModal = document.getElementById("serviceModal");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

document.getElementById("currentYear").textContent = new Date().getFullYear();

// Menú móvil
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

function crearLinkWhatsApp(tituloServicio) {
  const texto = `Hola SEME Studio! Vi el servicio "${tituloServicio}" en su web y quiero consultar precios y detalles.`;
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
}

function renderizarServicios(filtro = "todos") {
  const lista = window.SERVICIOS_SEME || [];
  const filtrados = filtro === "todos"
    ? lista
    : lista.filter((item) => item.categoria === filtro);

  servicesGrid.innerHTML = filtrados.map((servicio) => `
    <article class="service-card">
      <div class="service-cover">
        <span class="service-badge">${servicio.etiqueta}</span>
        <img src="${servicio.imagen}" alt="${servicio.titulo}" loading="lazy" />
      </div>
      <div class="service-content">
        <h3>${servicio.titulo}</h3>
        <p>${servicio.resumen}</p>
        <ul class="service-highlights">
          ${servicio.incluye.slice(0, 3).map((punto) => `<li>${punto}</li>`).join("")}
        </ul>
        <div class="service-actions">
          <button class="btn btn-secondary btn-sm btn-detalle" data-id="${servicio.id}" type="button">
            Ver Detalles
          </button>
          <a href="${servicio.demoUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm btn-demo" data-id="${servicio.id}">
            Probar Muestra
          </a>
        </div>
      </div>
    </article>
  `).join("");
}

function abrirModalServicio(servicioId) {
  const servicio = (window.SERVICIOS_SEME || []).find((s) => s.id === servicioId);
  if (!servicio) return;

  registrarInteraccionDemo(servicio.id, "ver_detalle");

  modalBody.innerHTML = `
    <span class="badge-tech">${servicio.etiqueta}</span>
    <h2>${servicio.titulo}</h2>
    <p style="color: var(--text-muted); margin-top: 0.5rem;">${servicio.descripcionLarga}</p>

    <div class="modal-media">
      <video controls poster="${servicio.imagen}" preload="none">
        <source src="${servicio.video}" type="video/mp4" />
        Tu navegador no soporta reproducción de video.
      </video>
    </div>

    <h4>¿Qué incluye esta solución?</h4>
    <ul class="modal-list">
      ${servicio.incluye.map((item) => `<li>✓ ${item}</li>`).join("")}
    </ul>

    <div class="modal-footer-actions">
      <a href="${servicio.demoUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-demo" data-id="${servicio.id}">
        Probar Opción de Muestra en Vivo
      </a>
      <a href="${crearLinkWhatsApp(servicio.titulo)}" target="_blank" rel="noopener" class="btn btn-secondary">
        Consultar este servicio por WhatsApp
      </a>
    </div>
  `;

  serviceModal.classList.add("open");
  serviceModal.setAttribute("aria-hidden", "false");
}

// Delegación de eventos en tarjetas y modal
document.addEventListener("click", (e) => {
  const btnDetalle = e.target.closest(".btn-detalle");
  if (btnDetalle) {
    abrirModalServicio(btnDetalle.dataset.id);
  }

  const btnDemo = e.target.closest(".btn-demo");
  if (btnDemo) {
    registrarInteraccionDemo(btnDemo.dataset.id, "abrir_demo");
  }
});

// Filtros por categoría
if (filterBar) {
  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderizarServicios(btn.dataset.filter);
  });
}

// Cerrar modal
if (modalClose && serviceModal) {
  modalClose.addEventListener("click", () => {
    serviceModal.classList.remove("open");
    serviceModal.setAttribute("aria-hidden", "true");
  });

  serviceModal.addEventListener("click", (e) => {
    if (e.target === serviceModal) {
      serviceModal.classList.remove("open");
      serviceModal.setAttribute("aria-hidden", "true");
    }
  });
}

// Carga inicial
renderizarServicios("todos");