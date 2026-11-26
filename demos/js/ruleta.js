const PREMIOS_RULETA = [
  { label: "20% OFF", detalle: "20% de descuento en el total", color: "#1464F6" },
  { label: "ENVÍO GRATIS", detalle: "Envío sin cargo en tu pedido", color: "#0F172A" },
  { label: "2x1 HOY", detalle: "2x1 en productos seleccionados", color: "#0284C7" },
  { label: "$3.000 REGALO", detalle: "Voucher de $3.000 de regalo", color: "#1E293B" },
  { label: "15% OFF", detalle: "15% de descuento en efectivo/MP", color: "#2563EB" },
  { label: "REGALO SORPRESA", detalle: "Accesorio / Bebida gratis", color: "#0E7490" }
];

const leadsCapturados = [
  { nombre: "Lucas Benítez", wa: "3794 41-0932", premio: "20% OFF", codigo: "#WIN-3814", canjeado: true, nuevo: false },
  { nombre: "Camila Ortiz", wa: "3794 78-5519", premio: "ENVÍO GRATIS", codigo: "#WIN-7105", canjeado: false, nuevo: false },
  { nombre: "Enzo Ramírez", wa: "3794 33-9021", premio: "15% OFF", codigo: "#WIN-9241", canjeado: false, nuevo: false }
];

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinForm = document.getElementById("spinForm");
const mainSpinBtn = document.getElementById("mainSpinBtn");
const hubSpinBtn = document.getElementById("hubSpinBtn");
const winModal = document.getElementById("winModal");

let anguloActual = 0;
let girando = false;

function dibujarRuleta() {
  const total = PREMIOS_RULETA.length;
  const arco = (2 * Math.PI) / total;
  const centro = canvas.width / 2;
  const radio = centro - 6;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < total; i++) {
    const inicio = anguloActual + i * arco;
    const fin = inicio + arco;

    // Gajo
    ctx.beginPath();
    ctx.moveTo(centro, centro);
    ctx.arc(centro, centro, radio, inicio, fin);
    ctx.closePath();
    ctx.fillStyle = PREMIOS_RULETA[i].color;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.stroke();

    // Texto del premio
    ctx.save();
    ctx.translate(centro, centro);
    ctx.rotate(inicio + arco / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 13px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(PREMIOS_RULETA[i].label, radio - 18, 5);
    ctx.restore();
  }
}

function obtenerIndiceGanador(angulo) {
  const total = PREMIOS_RULETA.length;
  const arco = (2 * Math.PI) / total;
  // El puntero superior está a las 12 en punto (1.5 * PI)
  const puntero = 1.5 * Math.PI;
  const relativo = (((puntero - angulo) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return Math.floor(relativo / arco) % total;
}

function renderLeads() {
  const list = document.getElementById("leadsList");
  document.getElementById("leadsCountBadge").textContent = `${leadsCapturados.length} registros`;

  list.innerHTML = leadsCapturados
    .map((item, idx) => `
      <div class="lead-row ${item.nuevo ? "is-new" : ""}">
        <div class="lead-info">
          <strong>${item.nombre} ${item.nuevo ? "🆕" : ""}</strong>
          <span>📱 ${item.wa} &bull; ${item.codigo}</span>
        </div>
        <div class="lead-right">
          <span class="lead-prize-pill">${item.premio}</span>
          <button type="button" class="redeem-toggle ${item.canjeado ? "redeemed" : ""}" data-idx="${idx}">
            ${item.canjeado ? "✓ Canjeado" : "Pendiente"}
          </button>
        </div>
      </div>
    `)
    .join("");
}

function iniciarGiro() {
  if (girando) return;

  const nombre = document.getElementById("playerName").value.trim() || "Cliente VIP";
  const wa = document.getElementById("playerWa").value.trim() || "3794 00-0000";

  girando = true;
  mainSpinBtn.disabled = true;
  hubSpinBtn.disabled = true;
  mainSpinBtn.textContent = "Girando suerte...";

  const vueltasExtra = (6 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
  const desplazamientoAleatorio = Math.random() * 2 * Math.PI;
  const anguloInicial = anguloActual;
  const anguloDestino = anguloInicial + vueltasExtra + desplazamientoAleatorio;
  const duracion = 4000;
  const tiempoInicio = performance.now();

  function animar(ahora) {
    const progreso = Math.min((ahora - tiempoInicio) / duracion, 1);
    const easeOut = 1 - Math.pow(1 - progreso, 3);
    anguloActual = anguloInicial + (anguloDestino - anguloInicial) * easeOut;
    dibujarRuleta();

    if (progreso < 1) {
      requestAnimationFrame(animar);
    } else {
      girando = false;
      mainSpinBtn.disabled = false;
      hubSpinBtn.disabled = false;
      mainSpinBtn.textContent = "🎡 Girar Ruleta Ahora";

      const idxGanador = obtenerIndiceGanador(anguloActual);
      const premio = PREMIOS_RULETA[idxGanador];
      const codigo = "#WIN-" + Math.floor(1000 + Math.random() * 9000);

      leadsCapturados.unshift({
        nombre,
        wa,
        premio: premio.label,
        codigo,
        canjeado: false,
        nuevo: true
      });
      renderLeads();

      document.getElementById("wonPrizeTitle").textContent = `${premio.label} (${premio.detalle})`;
      document.getElementById("wonPlayerText").textContent =
        `¡Felicitaciones ${nombre}! Mostrá este cupón en el local antes de abonar:`;
      document.getElementById("couponCodeText").textContent = codigo;
      document.getElementById("waCouponPreview").textContent =
        `🎁 *CUPÓN URBAN DROP STORE*\n\n` +
        `👤 *Ganador/a:* ${nombre}\n` +
        `🏆 *Premio:* ${premio.detalle}\n` +
        `🎟️ *Código:* ${codigo}\n` +
        `⏳ *Validez:* Válido por 48 hs en local o web.`;

      winModal.classList.add("open");
    }
  }

  requestAnimationFrame(animar);
}

spinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  iniciarGiro();
});

hubSpinBtn.addEventListener("click", () => {
  iniciarGiro();
});

document.getElementById("copyCodeBtn").addEventListener("click", (e) => {
  const code = document.getElementById("couponCodeText").textContent;
  navigator.clipboard?.writeText(code);
  e.target.textContent = "¡Copiado ✓!";
  setTimeout(() => {
    e.target.textContent = "Copiar código";
  }, 1600);
});

document.getElementById("spinAgainBtn").addEventListener("click", () => {
  winModal.classList.remove("open");
});

document.getElementById("leadsList").addEventListener("click", (e) => {
  const btn = e.target.closest(".redeem-toggle");
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  leadsCapturados[idx].canjeado = !leadsCapturados[idx].canjeado;
  renderLeads();
});

// Inicializar
dibujarRuleta();
renderLeads();