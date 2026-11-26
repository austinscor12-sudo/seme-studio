const ITEMS_AUDITORIA = [
  {
    id: "salon-limpieza",
    area: "Salón y Fachada",
    titulo: "Limpieza de pisos, mesas y vidrieras exteriores",
    criterio: "Sin residuos visibles y cartelería encendida antes de abrir.",
    estado: "ok",
    observacion: "",
    fotoAdjunta: ""
  },
  {
    id: "cadena-frio",
    area: "Bromatología y Frío",
    titulo: "Temperatura de heladeras y cámara (2°C a 4°C)",
    criterio: "Verificar termómetro digital y burletes cerrando herméticamente.",
    estado: "fail",
    observacion: "Heladera exhibidora #2 marcando 6.5°C; se llamó al técnico.",
    fotoAdjunta: "IMG_TERMOMETRO_0738.jpg • GPS Verificado"
  },
  {
    id: "caja-posnet",
    area: "Caja y Cobros",
    titulo: "Arqueo de cambio inicial y batería de terminales QR / Posnet",
    criterio: "Cambio chico completo y rollos de papel térmico de repuesto.",
    estado: "ok",
    observacion: "",
    fotoAdjunta: ""
  },
  {
    id: "stock-vitrina",
    area: "Mercadería y Stock",
    titulo: "Rotación FEFO y etiquetas de vencimiento visibles",
    criterio: "Productos del día al frente sin envases golpeados.",
    estado: "ok",
    observacion: "",
    fotoAdjunta: ""
  },
  {
    id: "personal-higiene",
    area: "Equipo de Turno",
    titulo: "Dotación completa con uniforme limpio y cofia",
    criterio: "Fichaje realizado en horario y elementos de seguridad.",
    estado: "ok",
    observacion: "",
    fotoAdjunta: ""
  },
  {
    id: "seguridad-matafuegos",
    area: "Seguridad e Higiene",
    titulo: "Salidas despejadas y carga vigente de matafuegos",
    criterio: "Manómetro en zona verde y pasillo de depósito libre.",
    estado: "ok",
    observacion: "",
    fotoAdjunta: ""
  }
];

const SUCURSALES_RANKING = [
  {
    nombre: "Sucursal Costanera",
    encargado: "Encargada: Sofía Méndez • Apertura 07:28 hs",
    puntaje: 100
  },
  {
    nombre: "Sucursal Norte",
    encargado: "Encargado: Matías Quiroz • Apertura 07:31 hs",
    puntaje: 92
  },
  {
    nombre: "Sucursal Centro",
    encargado: "Encargado: Lucas Benítez • Apertura 07:35 hs",
    puntaje: 83
  }
];

const HALLAZGOS_ABIERTOS = [
  {
    id: "h-1",
    sucursal: "Sucursal Centro",
    titulo: "Temperatura de heladeras y cámara (2°C a 4°C)",
    detalle: "Heladera exhibidora #2 marcando 6.5°C; se llamó al técnico.",
    evidencia: "📸 IMG_TERMOMETRO_0738.jpg • 07:38 hs",
    resuelto: false
  },
  {
    id: "h-2",
    sucursal: "Sucursal Norte",
    titulo: "Reposición de bolsas kraft medianas",
    detalle: "Queda stock solo para el turno mañana; pedir al depósito central.",
    evidencia: "📸 IMG_DEPOSITO_0742.jpg • 07:42 hs",
    resuelto: false
  }
];

function mostrarToast(texto) {
  const toast = document.getElementById("toastMsg");
  toast.textContent = texto;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function calcularMetricasRonda() {
  let ok = 0;
  let fail = 0;
  let na = 0;

  ITEMS_AUDITORIA.forEach((it) => {
    if (it.estado === "ok") ok++;
    else if (it.estado === "fail") fail++;
    else na++;
  });

  const evaluables = ok + fail;
  const pct = evaluables > 0 ? Math.round((ok / evaluables) * 100) : 100;

  document.getElementById("liveScorePct").textContent = `${pct}%`;
  document.getElementById("liveScoreDetail").textContent = `${ok} OK • ${fail} Desvío(s) • ${na} N/A`;
  document.getElementById("liveScoreBar").style.width = `${pct}%`;

  const statusTag = document.getElementById("scoreStatusTag");
  if (fail === 0) {
    statusTag.textContent = "✓ Local 100% aprobado para operar";
    statusTag.style.color = "#4ADE80";
  } else {
    statusTag.textContent = `⚠️ ${fail} desvío(s) con foto evidencia`;
    statusTag.style.color = "#FBBF24";
  }

  return { ok, fail, na, pct };
}

function renderChecklist() {
  const sucursal = document.getElementById("branchSelect").value;
  document.getElementById("activeBranchLabel").textContent = `${sucursal.toUpperCase()} • EN CURSO`;

  const cont = document.getElementById("checklistItemsList");
  cont.innerHTML = ITEMS_AUDITORIA.map((item, idx) => {
    const cardClass = item.estado === "ok" ? "is-ok" : item.estado === "fail" ? "is-fail" : "";
    const evidenciaHtml =
      item.estado === "fail"
        ? `
        <div class="fail-evidence-box">
          <input
            type="text"
            class="obs-input"
            data-idx="${idx}"
            value="${item.observacion}"
            placeholder="Escribí qué pasó o qué acción se tomó..."
          />
          <div class="photo-row">
            <button type="button" class="btn-attach-photo" data-photo="${idx}">
              📸 ${item.fotoAdjunta ? "Cambiar Foto Evidencia" : "Adjuntar Foto Evidencia"}
            </button>
            ${
              item.fotoAdjunta
                ? `<span class="photo-badge-ok">✓ ${item.fotoAdjunta}</span>`
                : `<span class="chk-info"><small>Sin foto aún</small></span>`
            }
          </div>
        </div>
      `
        : "";

    return `
      <article class="chk-item ${cardClass}">
        <div class="chk-top">
          <div class="chk-info">
            <span class="chk-area">${item.area}</span>
            <strong>${item.titulo}</strong>
            <small>${item.criterio}</small>
          </div>
          <div class="chk-actions">
            <button type="button" class="st-btn ${item.estado === "ok" ? "active-ok" : ""}" data-idx="${idx}" data-status="ok">✓ Cumple</button>
            <button type="button" class="st-btn ${item.estado === "fail" ? "active-fail" : ""}" data-idx="${idx}" data-status="fail">✕ Falla</button>
            <button type="button" class="st-btn ${item.estado === "na" ? "active-na" : ""}" data-idx="${idx}" data-status="na">— N/A</button>
          </div>
        </div>
        ${evidenciaHtml}
      </article>
    `;
  }).join("");

  calcularMetricasRonda();
}

function renderTableroSupervisor() {
  // Ranking de sucursales
  const rankList = document.getElementById("branchesRankingList");
  rankList.innerHTML = SUCURSALES_RANKING.map((suc) => `
    <div class="branch-row">
      <div class="branch-row-top">
        <strong>${suc.nombre}</strong>
        <span>${suc.puntaje}%</span>
      </div>
      <div class="branch-track">
        <div class="branch-fill ${suc.puntaje < 85 ? "warn" : ""}" style="width: ${suc.puntaje}%;"></div>
      </div>
      <div class="branch-sub">${suc.encargado}</div>
    </div>
  `).join("");

  // Promedio red
  const prom = Math.round(
    SUCURSALES_RANKING.reduce((acc, s) => acc + s.puntaje, 0) / SUCURSALES_RANKING.length
  );
  document.getElementById("kpiGlobalPct").textContent = `${prom}%`;

  // Hallazgos abiertos
  const abiertos = HALLAZGOS_ABIERTOS.filter((h) => !h.resuelto).length;
  document.getElementById("kpiOpenIssues").textContent = abiertos;

  const issuesCont = document.getElementById("issuesFeedList");
  issuesCont.innerHTML = HALLAZGOS_ABIERTOS.map((h) => `
    <div class="issue-card ${h.resuelto ? "resolved" : ""}">
      <div class="issue-body">
        <strong>${h.sucursal} &bull; ${h.titulo}</strong>
        <p>${h.detalle}</p>
        <span class="evidence-chip">${h.evidencia}</span>
      </div>
      ${
        h.resuelto
          ? `<span class="resolved-tag">✓ Resuelto</span>`
          : `<button type="button" class="btn-resolve-issue" data-resolve="${h.id}">Marcar Resuelto ✓</button>`
      }
    </div>
  `).join("");
}

function cambiarVista(vista) {
  document.querySelectorAll(".role-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === vista);
  });
  document.getElementById("managerView").classList.toggle("hidden", vista !== "encargado");
  document.getElementById("supervisorView").classList.toggle("hidden", vista !== "supervisor");
}

// Eventos de navegación
document.getElementById("roleSwitcher").addEventListener("click", (e) => {
  const btn = e.target.closest(".role-btn");
  if (!btn) return;
  cambiarVista(btn.dataset.view);
});

document.getElementById("jumpSupervisorBtn").addEventListener("click", () => {
  cambiarVista("supervisor");
});

document.getElementById("branchSelect").addEventListener("change", renderChecklist);

// Cambios de estado y captura de foto en checklist
document.getElementById("checklistItemsList").addEventListener("click", (e) => {
  const statusBtn = e.target.closest("[data-status]");
  if (statusBtn) {
    const idx = Number(statusBtn.dataset.idx);
    ITEMS_AUDITORIA[idx].estado = statusBtn.dataset.status;
    renderChecklist();
    return;
  }

  const photoBtn = e.target.closest("[data-photo]");
  if (photoBtn) {
    const idx = Number(photoBtn.dataset.photo);
    const ahora = new Date();
    const hhmm =
      String(ahora.getHours()).padStart(2, "0") +
      String(ahora.getMinutes()).padStart(2, "0");
    ITEMS_AUDITORIA[idx].fotoAdjunta = `IMG_EVIDENCIA_${hhmm}.jpg • GPS OK`;
    renderChecklist();
    mostrarToast("📸 Foto capturada con sello horario y GPS ✓");
  }
});

document.getElementById("checklistItemsList").addEventListener("input", (e) => {
  const inp = e.target.closest(".obs-input");
  if (!inp) return;
  ITEMS_AUDITORIA[Number(inp.dataset.idx)].observacion = inp.value;
});

// Firmar y enviar auditoría al tablero del dueño
document.getElementById("submitAuditBtn").addEventListener("click", () => {
  const sucursal = document.getElementById("branchSelect").value;
  const turno = document.getElementById("shiftSelect").value;
  const { pct, fail } = calcularMetricasRonda();

  const ahora = new Date();
  const horaStr =
    String(ahora.getHours()).padStart(2, "0") +
    ":" +
    String(ahora.getMinutes()).padStart(2, "0") +
    " hs";

  // Actualizar puntaje de esa sucursal en el ranking
  const sucObj = SUCURSALES_RANKING.find((s) => s.nombre === sucursal);
  if (sucObj) {
    sucObj.puntaje = pct;
    sucObj.encargado = `Actualizado recién (${horaStr}) • ${turno}`;
  }

  // Registrar nuevos desvíos si los hay
  ITEMS_AUDITORIA.forEach((it) => {
    if (it.estado === "fail") {
      HALLAZGOS_ABIERTOS.unshift({
        id: "h-" + Date.now() + Math.random(),
        sucursal,
        titulo: it.titulo,
        detalle: it.observacion.trim() || "Desvío reportado en ronda operativa.",
        evidencia: `📸 ${it.fotoAdjunta || "Evidencia adjunta"} • ${horaStr}`,
        resuelto: false
      });
    }
  });

  document.getElementById("receiptStamp").textContent = horaStr;
  document.getElementById("receiptText").textContent =
    `${sucursal} firmó "${turno}" con ${pct}% de cumplimiento y ${fail} desvío(s) reportado(s).`;
  document.getElementById("auditReceipt").classList.remove("hidden");

  renderTableroSupervisor();
  mostrarToast(`✍️ Auditoría de ${sucursal} enviada al dueño ✓`);
});

// Resolver hallazgo en tablero del supervisor
document.getElementById("issuesFeedList").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-resolve]");
  if (!btn) return;
  const item = HALLAZGOS_ABIERTOS.find((h) => h.id === btn.dataset.resolve);
  if (item) {
    item.resuelto = true;
    renderTableroSupervisor();
    mostrarToast("✓ Hallazgo marcado como resuelto");
  }
});

// Inicializar
renderChecklist();
renderTableroSupervisor();