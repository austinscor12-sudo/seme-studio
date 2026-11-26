const CLIENTES_CUOTAS = [
  {
    id: "c-1",
    nombre: "Sofía Benítez",
    plan: "Pase Libre Musculación + Funcional",
    vencimiento: "Vence hoy (25/11)",
    monto: 32000,
    estado: "due-today",
    badge: "Vence Hoy",
    avisoEnviado: false
  },
  {
    id: "c-2",
    nombre: "Marcos Maidana",
    plan: "Abono Mensual Full + Pileta",
    vencimiento: "Vencida hace 3 días (22/11)",
    monto: 36000,
    estado: "overdue",
    badge: "Atraso 3 días",
    avisoEnviado: false
  },
  {
    id: "c-3",
    nombre: "Carla Pellegrini",
    plan: "Plan 3 veces por semana",
    vencimiento: "Vence en 3 días (28/11)",
    monto: 25000,
    estado: "upcoming",
    badge: "Preventivo -3d",
    avisoEnviado: false
  },
  {
    id: "c-4",
    nombre: "Julián Navarro",
    plan: "Pase Libre Musculación",
    vencimiento: "Abonado hoy • Mercado Pago",
    monto: 32000,
    estado: "paid",
    badge: "Pagado ✓",
    avisoEnviado: true
  }
];

const MOVIMIENTOS_HOY = [
  { cliente: "Julián Navarro", medio: "Link Mercado Pago", hora: "10:14 hs", monto: 32000, nuevo: false },
  { cliente: "Lucía Verón", medio: "Transferencia Alias", hora: "14:32 hs", monto: 38000, nuevo: false },
  { cliente: "Matías Gómez", medio: "Link Mercado Pago", hora: "17:05 hs", monto: 30000, nuevo: false },
  { cliente: "Andrea Sosa", medio: "Efectivo Caja", hora: "18:40 hs", monto: 18000, nuevo: false }
];

let recaudadoMesBase = 420000;
let cajaMp = 62000;
let cajaTransf = 38000;
let cajaEfectivo = 18000;

function formatoPesos(n) {
  return "$" + Math.round(n).toLocaleString("es-AR");
}

function mostrarToast(texto) {
  const toast = document.getElementById("toastMsg");
  toast.textContent = texto;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}

function construirMensajeRecordatorio(cli) {
  const saludo =
    cli.estado === "overdue"
      ? `Hola *${cli.nombre}* 👋 Te recordamos que tu cuota de *${cli.plan}* (${formatoPesos(cli.monto)}) registró vencimiento el 22/11.`
      : cli.estado === "upcoming"
      ? `Hola *${cli.nombre}* 😊 Te avisamos de forma preventiva que en 3 días vence tu cuota de *${cli.plan}* (${formatoPesos(cli.monto)}).`
      : `Hola *${cli.nombre}* 👋 Hoy vence tu cuota de *${cli.plan}* por *${formatoPesos(cli.monto)}*.`;

  return (
    `${saludo}\n\n` +
    `Podés abonarla en 1 toque desde acá:\n` +
    `💳 *Link Mercado Pago:* mpago.la/pulsoclub-${cli.id}\n` +
    `🏦 *Alias Transferencia:* PULSO.CLUB.CTES\n\n` +
    `✅ Apenas acreditado te enviamos tu recibo automático.`
  );
}

function actualizarVistaPreviaWa(cli) {
  document.getElementById("waPreviewRecipient").textContent = `Para: ${cli.nombre}`;
  document.getElementById("waPreviewText").textContent = construirMensajeRecordatorio(cli);
}

function renderCobranzas() {
  const pendientes = CLIENTES_CUOTAS.filter((c) => c.estado !== "paid");
  const montoPendiente = pendientes.reduce((acc, c) => acc + c.monto, 0);
  const totalCartera = recaudadoMesBase + montoPendiente;
  const efectividad = Math.round((recaudadoMesBase / totalCartera) * 100);

  document.getElementById("kpiCollected").textContent = formatoPesos(recaudadoMesBase);
  document.getElementById("kpiPending").textContent = formatoPesos(montoPendiente);
  document.getElementById("kpiPendingCount").textContent =
    pendientes.length > 0 ? `${pendientes.length} cuota(s) pendiente(s)` : "¡Todo cobrado!";
  document.getElementById("kpiRate").textContent = `${efectividad}%`;

  const list = document.getElementById("debtorsList");
  list.innerHTML = CLIENTES_CUOTAS.map((cli) => {
    const isPaid = cli.estado === "paid";
    return `
      <article class="debtor-card ${isPaid ? "paid" : ""}">
        <div class="debtor-info">
          <div class="debtor-top">
            <strong>${cli.nombre}</strong>
            <span class="st-badge ${cli.estado}">${cli.badge}</span>
          </div>
          <div class="debtor-sub">${cli.plan} &bull; ${cli.vencimiento}</div>
        </div>

        <div class="debtor-right">
          <span class="quota-amount">${formatoPesos(cli.monto)}</span>
          ${
            isPaid
              ? ""
              : `
                <button type="button" class="btn-wa-one" data-remind="${cli.id}">
                  ${cli.avisoEnviado ? "✓ Aviso Enviado" : "📤 Avisar WA"}
                </button>
                <button type="button" class="btn-mark-paid" data-pay="${cli.id}">
                  ✓ Cobrar
                </button>
              `
          }
        </div>
      </article>
    `;
  }).join("");
}

function renderReporteDiario() {
  const totalDia = cajaMp + cajaTransf + cajaEfectivo;
  document.getElementById("repTotalDay").textContent = formatoPesos(totalDia);
  document.getElementById("repMpAmount").textContent = formatoPesos(cajaMp);
  document.getElementById("repTransfAmount").textContent = formatoPesos(cajaTransf);
  document.getElementById("repCashAmount").textContent = formatoPesos(cajaEfectivo);

  document.getElementById("dailyMovementsList").innerHTML = MOVIMIENTOS_HOY.map(
    (m) => `
      <div class="mov-row ${m.nuevo ? "is-new" : ""}">
        <span><strong>${m.cliente}</strong> <small>&bull; ${m.medio} (${m.hora})</small></span>
        <strong>+${formatoPesos(m.monto)}</strong>
      </div>
    `
  ).join("");

  const pendientesRestantes = CLIENTES_CUOTAS.filter((c) => c.estado !== "paid").length;

  document.getElementById("ownerReportPre").textContent =
    `📊 *CIERRE DIARIO PULSO CLUB (25/11/2026)*\n\n` +
    `💰 *Total recaudado hoy:* ${formatoPesos(totalDia)}\n` +
    `• Link Mercado Pago: ${formatoPesos(cajaMp)}\n` +
    `• Transferencias Alias: ${formatoPesos(cajaTransf)}\n` +
    `• Efectivo en caja: ${formatoPesos(cajaEfectivo)}\n\n` +
    `📩 *Recordatorios WA enviados:* 14 automáticos\n` +
    `⏳ *Cuotas pendientes de cobro:* ${pendientesRestantes}\n` +
    `✅ Caja conciliada sin diferencias.`;
}

function cambiarVista(vista) {
  document.querySelectorAll(".role-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === vista);
  });
  document.getElementById("collectionsView").classList.toggle("hidden", vista !== "cobranzas");
  document.getElementById("reportView").classList.toggle("hidden", vista !== "reporte");
}

// Eventos
document.getElementById("roleSwitcher").addEventListener("click", (e) => {
  const btn = e.target.closest(".role-btn");
  if (!btn) return;
  cambiarVista(btn.dataset.view);
});

// Acciones individuales en cada cliente
document.getElementById("debtorsList").addEventListener("click", (e) => {
  const remindBtn = e.target.closest("[data-remind]");
  if (remindBtn) {
    const cli = CLIENTES_CUOTAS.find((c) => c.id === remindBtn.dataset.remind);
    if (!cli) return;
    cli.avisoEnviado = true;
    actualizarVistaPreviaWa(cli);
    renderCobranzas();
    mostrarToast(`📤 Aviso con Link de Pago enviado a ${cli.nombre} ✓`);
    return;
  }

  const payBtn = e.target.closest("[data-pay]");
  if (payBtn) {
    const cli = CLIENTES_CUOTAS.find((c) => c.id === payBtn.dataset.pay);
    if (!cli || cli.estado === "paid") return;

    cli.estado = "paid";
    cli.badge = "Pagado ✓";
    cli.vencimiento = "Acreditado recién • Link MP";

    recaudadoMesBase += cli.monto;
    cajaMp += cli.monto;

    const ahora = new Date();
    const horaStr =
      String(ahora.getHours()).padStart(2, "0") +
      ":" +
      String(ahora.getMinutes()).padStart(2, "0") +
      " hs";

    MOVIMIENTOS_HOY.unshift({
      cliente: cli.nombre,
      medio: "Link Mercado Pago",
      hora: horaStr,
      monto: cli.monto,
      nuevo: true
    });

    renderCobranzas();
    renderReporteDiario();
    mostrarToast(`💸 Pago de ${cli.nombre} acreditado y sumado al cierre diario ✓`);
  }
});

// Disparo masivo de recordatorios
document.getElementById("sendBatchBtn").addEventListener("click", () => {
  const pendientes = CLIENTES_CUOTAS.filter((c) => c.estado !== "paid");
  if (pendientes.length === 0) {
    mostrarToast("✓ No quedan cuotas pendientes por notificar");
    return;
  }

  pendientes.forEach((c) => {
    c.avisoEnviado = true;
  });
  actualizarVistaPreviaWa(pendientes[0]);
  renderCobranzas();
  mostrarToast(`⚡ ${pendientes.length} recordatorios enviados automáticamente por WhatsApp ✓`);
});

// Enviar cierre diario al dueño
document.getElementById("sendOwnerReportBtn").addEventListener("click", () => {
  mostrarToast("📊 Reporte de cierre enviado al WhatsApp del dueño ✓");
});

// Inicializar
actualizarVistaPreviaWa(CLIENTES_CUOTAS[0]);
renderCobranzas();
renderReporteDiario();