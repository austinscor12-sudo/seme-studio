const SERVICIOS_TURNOS = [
  {
    id: "corte-barba",
    nombre: "Corte + Barba Ritual",
    duracion: "45 min • Toalla caliente",
    precio: 9000
  },
  {
    id: "corte-clasico",
    nombre: "Corte Degradé / Clásico",
    duracion: "30 min • Lavado incluido",
    precio: 6500
  },
  {
    id: "perfilado",
    nombre: "Barba & Perfilado",
    duracion: "25 min • Aceites esenciales",
    precio: 4500
  },
  {
    id: "color-platinado",
    nombre: "Color / Iluminación",
    duracion: "90 min • Incluye nutrición",
    precio: 18000
  }
];

const PROFESIONALES = [
  { id: "mateo", emoji: "💈", nombre: "Mateo R.", rol: "Master Barber" },
  { id: "franco", emoji: "✂️", nombre: "Franco S.", rol: "Estilista" },
  { id: "cualquiera", emoji: "⚡", nombre: "Primer libre", rol: "Más rápido" }
];

const DIAS_AGENDA = [
  { id: "hoy", dia: "Hoy", num: "26", ocupados: ["10:00", "11:30", "16:00", "18:30"] },
  { id: "manana", dia: "Mañana", num: "27", ocupados: ["09:30", "15:00", "19:00"] },
  { id: "vie", dia: "Vie", num: "28", ocupados: ["11:00", "17:00", "18:00", "19:30"] },
  { id: "sab", dia: "Sáb", num: "29", ocupados: ["10:00", "10:30", "11:00", "12:00", "16:30"] },
  { id: "lun", dia: "Lun", num: "01", ocupados: ["15:30"] }
];

const HORARIOS_BASE = [
  "09:30", "10:00", "10:30", "11:00", "11:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
  "18:00", "18:30", "19:00", "19:30"
];

let estado = {
  servicio: SERVICIOS_TURNOS[0],
  staff: PROFESIONALES[0],
  dia: DIAS_AGENDA[0],
  hora: "17:00",
  porcentajeSena: 50
};

function formatoPesos(n) {
  return "$" + n.toLocaleString("es-AR");
}

function renderServicios() {
  const cont = document.getElementById("serviceOptions");
  cont.innerHTML = SERVICIOS_TURNOS.map((srv) => `
    <button type="button" class="srv-item ${srv.id === estado.servicio.id ? "active" : ""}" data-srv="${srv.id}">
      <div class="srv-top">
        <strong>${srv.nombre}</strong>
        <span class="srv-price">${formatoPesos(srv.precio)}</span>
      </div>
      <small>${srv.duracion}</small>
    </button>
  `).join("");
}

function renderStaff() {
  const cont = document.getElementById("staffOptions");
  cont.innerHTML = PROFESIONALES.map((st) => `
    <button type="button" class="staff-card ${st.id === estado.staff.id ? "active" : ""}" data-staff="${st.id}">
      <span class="staff-emoji">${st.emoji}</span>
      <strong>${st.nombre}</strong>
      <span>${st.rol}</span>
    </button>
  `).join("");
}

function renderDias() {
  const cont = document.getElementById("dateOptions");
  cont.innerHTML = DIAS_AGENDA.map((d) => `
    <button type="button" class="date-pill ${d.id === estado.dia.id ? "active" : ""}" data-dia="${d.id}">
      <span>${d.dia}</span>
      <strong>${d.num}</strong>
    </button>
  `).join("");
}

function renderHorarios() {
  const cont = document.getElementById("timeSlotsGrid");
  if (estado.dia.ocupados.includes(estado.hora)) {
    const primerLibre = HORARIOS_BASE.find((h) => !estado.dia.ocupados.includes(h));
    if (primerLibre) estado.hora = primerLibre;
  }

  cont.innerHTML = HORARIOS_BASE.map((hora) => {
    const ocupado = estado.dia.ocupados.includes(hora);
    const activo = !ocupado && hora === estado.hora;
    return `
      <button type="button" class="slot-btn ${activo ? "active" : ""}" data-hora="${hora}" ${ocupado ? "disabled" : ""}>
        ${hora}
      </button>
    `;
  }).join("");
}

function actualizarResumen() {
  const total = estado.servicio.precio;
  const sena = estado.porcentajeSena > 0 ? Math.round(total * 0.5) : 0;
  const fechaTexto = `${estado.dia.dia} ${estado.dia.num} • ${estado.hora} hs`;

  document.getElementById("depositAmountLabel").textContent = formatoPesos(Math.round(total * 0.5));
  document.getElementById("sumService").textContent = estado.servicio.nombre;
  document.getElementById("sumStaff").textContent = estado.staff.nombre;
  document.getElementById("sumDateTime").textContent = fechaTexto;
  document.getElementById("sumTotal").textContent = formatoPesos(total);

  const depositRow = document.getElementById("sumDepositRow");
  if (sena > 0) {
    depositRow.style.display = "flex";
    document.getElementById("sumDeposit").textContent = formatoPesos(sena);
    document.getElementById("stickyPriceLabel").textContent = `Seña: ${formatoPesos(sena)}`;
  } else {
    depositRow.style.display = "none";
    document.getElementById("stickyPriceLabel").textContent = `Total en local: ${formatoPesos(total)}`;
  }

  document.getElementById("stickyDateLabel").textContent = fechaTexto;

  const cliente = document.getElementById("clientName").value.trim() || "Cliente";
  const pagoDetalle = sena > 0 ? `Seña 50% (${formatoPesos(sena)})` : "Abona en el local";

  document.getElementById("waTicketPreview").textContent =
    `✅ *TURNO CONFIRMADO - KRONOS STUDIO*\n\n` +
    `👤 *Cliente:* ${cliente}\n` +
    `✂️ *Servicio:* ${estado.servicio.nombre}\n` +
    `💈 *Profesional:* ${estado.staff.nombre}\n` +
    `📅 *Día y Hora:* ${fechaTexto}\n` +
    `💳 *Estado:* ${pagoDetalle}`;
}

// Delegación de clics
document.getElementById("serviceOptions").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-srv]");
  if (!btn) return;
  estado.servicio = SERVICIOS_TURNOS.find((s) => s.id === btn.dataset.srv);
  renderServicios();
  actualizarResumen();
});

document.getElementById("staffOptions").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-staff]");
  if (!btn) return;
  estado.staff = PROFESIONALES.find((s) => s.id === btn.dataset.staff);
  renderStaff();
  actualizarResumen();
});

document.getElementById("dateOptions").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-dia]");
  if (!btn) return;
  estado.dia = DIAS_AGENDA.find((d) => d.id === btn.dataset.dia);
  renderDias();
  renderHorarios();
  actualizarResumen();
});

document.getElementById("timeSlotsGrid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-hora]");
  if (!btn || btn.disabled) return;
  estado.hora = btn.dataset.hora;
  renderHorarios();
  actualizarResumen();
});

document.getElementById("depositToggle").addEventListener("click", (e) => {
  const btn = e.target.closest(".pay-btn");
  if (!btn) return;
  document.querySelectorAll(".pay-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  estado.porcentajeSena = Number(btn.dataset.deposit);
  actualizarResumen();
});

document.getElementById("clientName").addEventListener("input", actualizarResumen);

// Confirmación final
const passModal = document.getElementById("passModal");
document.getElementById("confirmBookingBtn").addEventListener("click", () => {
  const codigo = "#TRN-" + Math.floor(1000 + Math.random() * 9000);
  document.getElementById("ticketCodeText").textContent = codigo;
  document.getElementById("passDetailsText").textContent =
    `${estado.servicio.nombre} • ${estado.dia.dia} ${estado.dia.num} (${estado.hora} hs)`;
  passModal.classList.add("open");
});

document.getElementById("closePassBtn").addEventListener("click", () => {
  // Marca el turno recién reservado como ocupado en la demo para que se vea en vivo
  if (!estado.dia.ocupados.includes(estado.hora)) {
    estado.dia.ocupados.push(estado.hora);
  }
  passModal.classList.remove("open");
  renderHorarios();
  actualizarResumen();
});

// Inicializar
renderServicios();
renderStaff();
renderDias();
renderHorarios();
actualizarResumen();