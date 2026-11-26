const FICHAJES_HOY = [
  {
    empleado: "Valentina Gómez",
    tipo: "ENTRADA",
    hora: "07:58 hs",
    distancia: "11m GPS",
    estado: "A tiempo",
    claseEstado: "ok",
    nuevo: false
  },
  {
    empleado: "Lucas Fernández",
    tipo: "ENTRADA",
    hora: "08:01 hs",
    distancia: "19m GPS",
    estado: "A tiempo",
    claseEstado: "ok",
    nuevo: false
  },
  {
    empleado: "Enzo Paredes",
    tipo: "ENTRADA",
    hora: "08:14 hs",
    distancia: "15m GPS",
    estado: "Tarde (+14m)",
    claseEstado: "late",
    nuevo: false
  }
];

const RESUMEN_SUELDOS = [
  { empleado: "Valentina Gómez", dias: "22 / 22", horas: "176 hs", tardes: "0" },
  { empleado: "Lucas Fernández", dias: "21 / 22", horas: "168 hs", tardes: "1" },
  { empleado: "Camila Romero", dias: "20 / 22", horas: "160 hs", tardes: "0" },
  { empleado: "Enzo Paredes", dias: "22 / 22", horas: "174 hs", tardes: "2" }
];

let tipoMarca = "ENTRADA";
let dentroDeRango = true;
let distanciaMetros = 14;

function mostrarToast(msg, esError = false) {
  const toast = document.getElementById("toastMsg");
  toast.textContent = msg;
  toast.style.background = esError ? "#EF4444" : "#10B981";
  toast.style.color = esError ? "#FFFFFF" : "#042F2E";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}

// Reloj digital en tiempo real
function actualizarReloj() {
  const ahora = new Date();
  const hh = String(ahora.getHours()).padStart(2, "0");
  const mm = String(ahora.getMinutes()).padStart(2, "0");
  const ss = String(ahora.getSeconds()).padStart(2, "0");
  document.getElementById("liveClock").textContent = `${hh}:${mm}:${ss}`;
}
setInterval(actualizarReloj, 1000);
actualizarReloj();

function actualizarEstadoGpsUI() {
  const box = document.getElementById("gpsStatusBox");
  const dot = document.getElementById("radarDot");
  const head = document.getElementById("gpsHeadline");
  const coords = document.getElementById("gpsCoordsText");
  const btn = document.getElementById("punchSubmitBtn");

  if (dentroDeRango) {
    box.classList.remove("out-of-range");
    dot.className = "radar-dot ok";
    head.textContent = "Ubicación verificada dentro del local";
    coords.textContent = `Distancia al QR: ${distanciaMetros} metros • Precisión GPS: ±6m`;
    btn.classList.remove("blocked");
    btn.textContent = `📲 Validar GPS y Registrar ${tipoMarca}`;
  } else {
    box.classList.add("out-of-range");
    dot.className = "radar-dot bad";
    head.textContent = "Fuera del radio permitido (50m máx.)";
    coords.textContent = `Distancia detectada: ${distanciaMetros} metros • Fichaje bloqueado`;
    btn.classList.add("blocked");
    btn.textContent = "🚫 Acercate al local para fichar";
  }
}

function renderLogsYTabla() {
  const logsList = document.getElementById("attendanceLogsList");
  logsList.innerHTML = FICHAJES_HOY.map((item) => `
    <div class="log-row ${item.nuevo ? "is-fresh" : ""}">
      <div class="log-left">
        <strong>${item.empleado} ${item.nuevo ? "🆕" : ""}</strong>
        <span>${item.tipo} &bull; ✓ ${item.distancia}</span>
      </div>
      <div class="log-right">
        <span class="log-time">${item.hora}</span>
        <span class="log-status ${item.claseEstado}">${item.estado}</span>
      </div>
    </div>
  `).join("");

  const payrollBody = document.getElementById("payrollBody");
  payrollBody.innerHTML = RESUMEN_SUELDOS.map((row) => `
    <tr>
      <td><strong>${row.empleado}</strong></td>
      <td>${row.dias}</td>
      <td>${row.horas}</td>
      <td>${row.tardes}</td>
    </tr>
  `).join("");
}

function cambiarVista(vista) {
  document.querySelectorAll(".role-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === vista);
  });
  document.getElementById("employeeView").classList.toggle("hidden", vista !== "empleado");
  document.getElementById("ownerView").classList.toggle("hidden", vista !== "dueno");
}

// Eventos de navegación
document.getElementById("roleSwitcher").addEventListener("click", (e) => {
  const btn = e.target.closest(".role-btn");
  if (!btn) return;
  cambiarVista(btn.dataset.view);
});

document.getElementById("jumpOwnerBtn").addEventListener("click", () => {
  cambiarVista("dueno");
});

// Tipo de fichaje (Entrada / Salida)
document.getElementById("punchTypeToggle").addEventListener("click", (e) => {
  const btn = e.target.closest(".type-btn");
  if (!btn) return;
  document.querySelectorAll(".type-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  tipoMarca = btn.dataset.type;
  actualizarEstadoGpsUI();
});

// Simulador de distancia GPS
document.getElementById("geoSimPills").addEventListener("click", (e) => {
  const pill = e.target.closest(".geo-pill");
  if (!pill) return;
  document.querySelectorAll(".geo-pill").forEach((p) => p.classList.remove("active"));
  pill.classList.add("active");

  if (pill.dataset.geo === "inside") {
    dentroDeRango = true;
    distanciaMetros = 14;
  } else {
    dentroDeRango = false;
    distanciaMetros = 380;
  }
  actualizarEstadoGpsUI();
});

// Probar GPS real del celular
document.getElementById("realGpsBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    mostrarToast("Tu navegador no soporta GPS", true);
    return;
  }
  mostrarToast("Obteniendo coordenadas GPS reales...");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const acc = Math.round(pos.coords.accuracy);
      dentroDeRango = true;
      distanciaMetros = 8;
      document.getElementById("gpsHeadline").textContent = "Coordenadas GPS reales capturadas ✓";
      document.getElementById("gpsCoordsText").textContent =
        `Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)} (±${acc}m)`;
      mostrarToast("GPS real verificado ✓");
    },
    () => {
      mostrarToast("Permiso GPS denegado, usando modo simulado", true);
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
});

// Registrar fichaje
document.getElementById("punchSubmitBtn").addEventListener("click", () => {
  if (!dentroDeRango) {
    mostrarToast("🚫 Fichaje rechazado: estás a 380m del local", true);
    return;
  }

  const empleado = document.getElementById("employeeSelect").value;
  const ahora = new Date();
  const horaStr =
    String(ahora.getHours()).padStart(2, "0") +
    ":" +
    String(ahora.getMinutes()).padStart(2, "0") +
    " hs";

  FICHAJES_HOY.unshift({
    empleado,
    tipo: tipoMarca,
    hora: horaStr,
    distancia: `${distanciaMetros}m GPS`,
    estado: "Verificado",
    claseEstado: "ok",
    nuevo: true
  });

  document.getElementById("kpiPresent").textContent = "4 / 4";
  document.getElementById("receiptTimeBadge").textContent = horaStr;
  document.getElementById("receiptSummaryText").textContent =
    `${empleado} registró ${tipoMarca} verificada a ${distanciaMetros}m del local.`;
  document.getElementById("punchReceipt").classList.remove("hidden");

  renderLogsYTabla();
  mostrarToast(`✓ ${tipoMarca} registrada para ${empleado}`);
});

// Exportar reporte CSV simulado
document.getElementById("exportReportBtn").addEventListener("click", () => {
  mostrarToast("📥 Reporte mensual CSV generado para liquidación ✓");
});

// Inicializar
actualizarEstadoGpsUI();
renderLogsYTabla();