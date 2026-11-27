import { registrarInteraccionDemo } from "./firebase-config.js";

const WHATSAPP_NUMERO = "5493794924075";
const servicesGrid = document.getElementById("servicesGrid");
const filterBar = document.getElementById("filterBar");
const serviceModal = document.getElementById("serviceModal");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

document.getElementById("currentYear").textContent = new Date().getFullYear();

const ICONO_WHATSAPP_SVG = `
  <svg class="wa-icon" viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.758.459 3.475 1.331 4.988L2 22l5.184-1.359a9.927 9.927 0 0 0 4.847 1.258h.004c5.515 0 9.968-4.453 9.968-9.969 0-2.663-1.037-5.167-2.92-7.05A9.903 9.903 0 0 0 12.031 2zm5.822 14.274c-.246.693-1.432 1.326-1.983 1.41-.506.076-1.147.108-1.851-.116-.427-.136-.976-.318-1.678-.621-2.952-1.275-4.88-4.247-5.027-4.443-.147-.196-1.2-1.596-1.2-3.044 0-1.448.76-2.16 1.03-2.454.27-.295.589-.368.785-.368.196 0 .393.002.564.01.181.009.424-.069.663.506.246.589.835 2.037.908 2.184.074.147.123.319.025.515-.098.196-.147.319-.295.491-.147.172-.31.384-.442.515-.147.147-.301.307-.129.601.172.295.763 1.259 1.639 2.04 1.126 1.004 2.075 1.315 2.37 1.462.295.147.466.123.638-.074.172-.196.736-.859.933-1.154.196-.295.393-.245.663-.147.27.098 1.718.81 2.013.957.295.147.491.221.564.344.074.123.074.712-.172 1.405z"/>
  </svg>
`;

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
    <article class="service-card tilt-card">
      <div class="card-glare"></div>
      <div class="service-cover">
        <span class="service-badge">${servicio.etiqueta}</span>
        <span class="service-live-dot">● DEMO</span>
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

  if (typeof window.initTiltCards === "function") {
    window.initTiltCards();
  }
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
      <video controls poster="${servicio.imagen}" preload="metadata">
        <source src="${servicio.video}" type="video/mp4" />
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
      <a href="${crearLinkWhatsApp(servicio.titulo)}" target="_blank" rel="noopener" class="btn btn-whatsapp">
        ${ICONO_WHATSAPP_SVG}
        <span>Consultar por WhatsApp</span>
      </a>
    </div>
  `;

  serviceModal.classList.add("open");
  serviceModal.setAttribute("aria-hidden", "false");
}

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

if (filterBar) {
  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderizarServicios(btn.dataset.filter);
  });
}

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

renderizarServicios("todos");