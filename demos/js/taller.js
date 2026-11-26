const PASOS_REPARACION = [
  {
    titulo: "Equipo Ingresado",
    desc: "Recepción registrada con fotos de estado físico y respaldo de orden.",
    badge: "Ingresado",
    clase: "working"
  },
  {
    titulo: "En Diagnóstico Técnico",
    desc: "Revisión de placa, consumo y componentes en banco de pruebas.",
    badge: "En diagnóstico",
    clase: "working"
  },
  {
    titulo: "Esperando Repuesto",
    desc: "Repuesto original solicitado; te avisamos apenas ingresa al taller.",
    badge: "Esperando repuesto",
    clase: "waiting"
  },
  {
    titulo: "Listo para Retirar ✓",
    desc: "Reparación finalizada y aprobada en control de calidad.",
    badge: "Listo para retirar",
    clase: "ready"
  }
];

const ORDENES_TALLER = [
  {
    codigo: "#ORD-4082",
    equipo: "iPhone 13 Pro 256GB",
    cliente: "Martín Pereyra",
    ingreso: "24/11 • 10:15 hs",
    falla: "Módulo astillado y batería degradada (74%)",
    nota: "Cambio de pantalla OLED original + batería nueva. Testeo de FaceID y carga rápida OK.",
    garantia: "90 días",
    precio: "$145.000",
    pasoActual: 3
  },
  {
    codigo: "#ORD-4085",
    equipo: "Notebook Lenovo IdeaPad 3",
    cliente: "Valeria Sosa",
    ingreso: "25/11 • 09:40 hs",
    falla: "No enciende tras corte de luz y levanta temperatura",
    nota: "Limpieza interna completa, cambio de pasta térmica Arctic y reparación de etapa de carga.",
    garantia: "60 días",
    precio: "$58.000",
    pasoActual: 1
  },
  {
    codigo: "#ORD-4089",
    equipo: "PlayStation 5 Slim",
    cliente: "Diego Fernández",
    ingreso: "25/11 • 16:20 hs",
    falla: "Puerto HDMI flojo sin imagen en TV",
    nota: "Aguardando llegada de puerto HDMI reforzado original desde distribuidor.",
    garantia: "90 días",
    precio: "$72.000",
    pasoActual: 2
  }
];

let ordenSeleccionadaIdx = 0;

function mostrarToast(texto) {
  const toast = document.getElementById("toastMsg");
  toast.textContent = texto;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function renderPillsOrdenes() {
  const cont = document.getElementById("orderPills");
  cont.innerHTML = ORDENES_TALLER.map((ord, idx) => `
    <button type="button" class="order-pill ${idx === ordenSeleccionadaIdx ? "active" : ""}" data-ord="${idx}">
      ${ord.codigo} &bull; ${ord.equipo}
    </button>
  `).join("");
}

function renderTodo() {
  const ord = ORDENES_TALLER[ordenSeleccionadaIdx];
  const infoPaso = PASOS_REPARACION[ord.pasoActual];

  // Vista Cliente
  document.getElementById("cOrderCode").textContent = ord.codigo;
  document.getElementById("cDeviceName").textContent = ord.equipo;
  document.getElementById("cClientOwner").textContent = `Titular: ${ord.cliente} • Ingreso: ${ord.ingreso}`;

  const badge = document.getElementById("cStatusBadge");
  badge.textContent = infoPaso.badge;
  badge.className = `status-pill ${infoPaso.clase}`;

  document.getElementById("cReportedIssue").textContent = ord.falla;
  document.getElementById("cTechReport").textContent = ord.nota;
  document.getElementById("cWarrantyDays").textContent = ord.garantia;
  document.getElementById("cTotalPrice").textContent = ord.precio;

  // Línea de tiempo
  const timeline = document.getElementById("cTimeline");
  timeline.innerHTML = PASOS_REPARACION.map((paso, idx) => {
    let estadoClase = "";
    let icono = `0${idx + 1}`;
    if (idx < ord.pasoActual) {
      estadoClase = "done";
      icono = "✓";
    } else if (idx === ord.pasoActual) {
      estadoClase = "current";
      icono = "●";
    }

    return `
      <div class="tl-step ${estadoClase}">
        <div class="tl-dot">${icono}</div>
        <div class="tl-info">
          <strong>${paso.titulo}</strong>
          <span>${paso.desc}</span>
        </div>
      </div>
    `;
  }).join("");

  // Vista Panel Técnico
  document.getElementById("tOrderCode").textContent = ord.codigo;
  document.getElementById("techNoteInput").value = ord.nota;

  document.querySelectorAll(".state-option").forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.step) === ord.pasoActual);
  });

  document.getElementById("waNotifyPreview").textContent =
    `🔧 *NEXUS LAB - ACTUALIZACIÓN DE TU EQUIPO*\n\n` +
    `Hola *${ord.cliente}*, tu orden *${ord.codigo}* (${ord.equipo}) pasó a estado:\n` +
    `📌 *${infoPaso.titulo.toUpperCase()}*\n\n` +
    `📝 *Detalle:* ${ord.nota}\n` +
    `🛡️ *Garantía:* ${ord.garantia} • *Total:* ${ord.precio}\n` +
    `🔗 Seguilo en vivo: nexuslab.app/orden/${ord.codigo.replace("#", "")}`;
}

function cambiarVista(vista) {
  document.querySelectorAll(".role-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === vista);
  });

  const clientView = document.getElementById("clientView");
  const techView = document.getElementById("techView");

  if (vista === "cliente") {
    clientView.classList.remove("hidden");
    techView.classList.add("hidden");
  } else {
    techView.classList.remove("hidden");
    clientView.classList.add("hidden");
  }
}

// Eventos
document.getElementById("roleSwitcher").addEventListener("click", (e) => {
  const btn = e.target.closest(".role-btn");
  if (!btn) return;
  cambiarVista(btn.dataset.view);
});

document.getElementById("jumpToClientBtn").addEventListener("click", () => {
  cambiarVista("cliente");
});

document.getElementById("orderPills").addEventListener("click", (e) => {
  const pill = e.target.closest(".order-pill");
  if (!pill) return;
  ordenSeleccionadaIdx = Number(pill.dataset.ord);
  renderPillsOrdenes();
  renderTodo();
});

document.getElementById("stateButtonsGrid").addEventListener("click", (e) => {
  const btn = e.target.closest(".state-option");
  if (!btn) return;
  ORDENES_TALLER[ordenSeleccionadaIdx].pasoActual = Number(btn.dataset.step);
  renderTodo();
  mostrarToast("Estado actualizado en el link del cliente ✓");
});

document.getElementById("techNoteInput").addEventListener("input", (e) => {
  ORDENES_TALLER[ordenSeleccionadaIdx].nota = e.target.value;
  renderTodo();
});

document.getElementById("copyTrackingBtn").addEventListener("click", () => {
  const ord = ORDENES_TALLER[ordenSeleccionadaIdx];
  navigator.clipboard?.writeText(`https://nexuslab.app/orden/${ord.codigo.replace("#", "")}`);
  mostrarToast(`Link de ${ord.codigo} copiado ✓`);
});

document.getElementById("simNotifyBtn").addEventListener("click", () => {
  mostrarToast("Aviso enviado por WhatsApp al cliente ✓");
});

// Inicializar
renderPillsOrdenes();
renderTodo();