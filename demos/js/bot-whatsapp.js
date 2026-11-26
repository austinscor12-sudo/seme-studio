const CONFIG_RUBROS = {
  tienda: {
    avatar: "K",
    nombre: "KROMA INDUMENTARIA",
    bienvenida:
      "¡Hola! 👋 Soy el asistente virtual de *Kroma Indumentaria*.\nEstoy disponible las 24 hs para pasarte precios, talles disponibles o armar tu envío.\n\n¿En qué te puedo ayudar hoy?",
    chips: [
      "👕 Precios y promos",
      "🚚 Envíos y horarios",
      "💳 Medios de pago",
      "🛒 Quiero hacer un pedido"
    ],
    reglas: [
      {
        keywords: ["precio", "promo", "remera", "buzo", "catalogo", "catálogo", "sale"],
        respuesta:
          "🔥 *LISTA ACTUALIZADA DE TEMPORADA:*\n\n• Remeras Oversize Algodón Peinado: *$18.500*\n• Buzos Hoodie Frisa Pesada: *$34.900*\n• Combo 2 Remeras + Envío Gratis: *$33.000*\n\n¿Qué talle buscás (S al XXL) así te confirmo stock ahora?",
        intent: "Consulta de Precios y Stock",
        accion: "Envía lista actualizada + oferta combo",
        lead: "Interés Comercial Alto 🔥"
      },
      {
        keywords: ["envio", "envío", "horario", "direccion", "dirección", "donde", "dónde", "ubicacion"],
        respuesta:
          "📍 *LOCAL Y ENVÍOS:*\n\n• Retiro en showroom: *Junín 1420* (Lun a Sáb de 9:30 a 20:30 hs).\n• Cadetería en el día en Corrientes Capital (*$2.500* o gratis en compras +$35.000).\n• Envíos a todo el país por Andreani.",
        intent: "Logística y Horarios",
        accion: "Informa ubicación y costos de envío",
        lead: "Cliente Calificado ✓"
      },
      {
        keywords: ["pago", "transferencia", "tarjeta", "cuotas", "efectivo", "mercado"],
        respuesta:
          "💳 *MEDIOS DE PAGO:*\n\n• *15% OFF* abonando por transferencia o efectivo.\n• *3 cuotas sin interés* con tarjetas bancarias y Mercado Pago.\n\n¿Querés que te separe algún artículo?",
        intent: "Condiciones de Pago",
        accion: "Informa descuento transferencia y cuotas",
        lead: "Listo para Cerrar Compra 💰"
      },
      {
        keywords: ["pedido", "comprar", "quiero", "encargar", "humano", "asesor"],
        respuesta:
          "✅ *¡PERFECTO! YA NOTIFIQUÉ A UN ASESOR*\n\nDejame tu nombre y qué prenda te interesa. En menos de 2 minutos te enviamos el link de pago o coordinamos la entrega por acá.",
        intent: "Cierre de Venta / Derivación",
        accion: "Alerta enviada al dueño con resumen",
        lead: "VENTA LISTA PARA CERRAR 🚀"
      }
    ],
    fallback: {
      respuesta:
        "¡Entendido! 👍 Tomé nota de tu consulta sobre eso. Podés pedirme *precios*, *medios de pago*, *envíos* o escribir *quiero hacer un pedido* para derivarte directo con ventas.",
      intent: "Consulta Personalizada",
      accion: "Orienta al cliente hacia conversión",
      lead: "En Conversación Activa"
    }
  },

  turnos: {
    avatar: "D",
    nombre: "DENTAL CARE CENTRO",
    bienvenida:
      "¡Hola! 😊 Soy el asistente virtual 24/7 de *Dental Care Centro*.\nPuedo informarte sobre obras sociales, valores de consulta o reservarte un turno en segundos.\n\n¿Qué necesitás consultar?",
    chips: [
      "📅 Sacar un turno",
      "🏥 Obras sociales",
      "💲 Valor consulta / limpieza",
      "📍 Ubicación y urgencias"
    ],
    reglas: [
      {
        keywords: ["turno", "reservar", "disponible", "horario", "agenda", "mañana", "hoy"],
        respuesta:
          "📅 *PRÓXIMOS TURNOS DISPONIBLES:*\n\n• Mañana *10:30 hs* (Dra. Ferreyra)\n• Mañana *17:15 hs* (Dr. Molina)\n• Jueves *09:00 hs* (Limpieza / Control)\n\nRespondeme con tu *Nombre y DNI* y te lo dejo confirmado al instante.",
        intent: "Reserva de Turno",
        accion: "Consulta agenda y ofrece horarios libres",
        lead: "Turno en Proceso de Reserva 📅"
      },
      {
        keywords: ["obra", "social", "osde", "swiss", "ioscor", "prepaga", "cobertura"],
        respuesta:
          "🏥 *OBRAS SOCIALES Y PREPAGAS:*\n\nTrabajamos con *OSDE, Swiss Medical, Galeno, Medifé, IOSCOR y Sancor Salud*.\nSi venís de forma particular tenés *20% de reintegro* con factura oficial.",
        intent: "Consulta de Cobertura Médica",
        accion: "Valida cartilla de obras sociales",
        lead: "Paciente Calificado ✓"
      },
      {
        keywords: ["valor", "precio", "consulta", "limpieza", "blanqueamiento", "cuanto"],
        respuesta:
          "🦷 *ARANCELES PARTICULARES:*\n\n• Consulta + Diagnóstico Digital: *$18.000*\n• Limpieza Ultrasónica completa: *$29.000*\n• Blanqueamiento LED: *$65.000* (hasta 3 cuotas)\n\n¿Querés que te reserve un lugar esta semana?",
        intent: "Presupuesto de Tratamiento",
        accion: "Envía aranceles y ofrece agenda",
        lead: "Interés en Tratamiento Alto 🔥"
      },
      {
        keywords: ["ubicacion", "ubicación", "urgencia", "dolor", "donde", "direccion"],
        respuesta:
          "📍 *CONSULTORIO Y GUARDIA:*\n\nEstamos en *San Lorenzo 890, Piso 2* (Corrientes Capital).\n🚨 Si tenés dolor agudo o urgencia, escribí *URGENCIA* y te priorizamos hoy mismo.",
        intent: "Ubicación / Atención Urgencia",
        accion: "Envía dirección y protocolo guardia",
        lead: "Prioridad Alta 🚨"
      }
    ],
    fallback: {
      respuesta:
        "¡Gracias por escribirnos! 😊 Puedo ayudarte con *turnos disponibles*, *obras sociales*, *valores de limpieza/consulta* o derivarte con secretaría. ¿Qué preferís?",
      intent: "Consulta General Paciente",
      accion: "Responde 24/7 sin tiempo de espera",
      lead: "Atendido Automáticamente"
    }
  }
};

let rubroActual = "tienda";

function horaActual() {
  const d = new Date();
  return (
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0")
  );
}

function agregarBurbuja(texto, emisor) {
  const area = document.getElementById("waMessagesArea");
  const div = document.createElement("div");
  div.className = `msg-bubble ${emisor}`;
  div.innerHTML = `
    <div>${texto.replace(/\*(.*?)\*/g, "<strong>$1</strong>")}</div>
    <div class="msg-meta">
      <span>${horaActual()}</span>
      ${emisor === "user" ? `<span class="ticks">✓✓</span>` : ""}
    </div>
  `;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function iniciarRubro(key) {
  rubroActual = key;
  const cfg = CONFIG_RUBROS[key];

  document.getElementById("waAvatar").textContent = cfg.avatar;
  document.getElementById("waBizName").textContent = cfg.nombre;
  document.getElementById("waStatusText").textContent = "● En línea • Asistente IA 24/7";

  const area = document.getElementById("waMessagesArea");
  area.innerHTML = "";
  agregarBurbuja(cfg.bienvenida, "bot");

  const chipsBar = document.getElementById("quickPromptsBar");
  chipsBar.innerHTML = cfg.chips
    .map((c) => `<button type="button" class="prompt-chip">${c}</button>`)
    .join("");

  document.getElementById("detectedIntent").textContent = "Bienvenida Automática";
  document.getElementById("autoActionTaken").textContent = "Saludo inicial instantáneo";
  document.getElementById("leadStatusTag").textContent = "Canal 24/7 Activo";
}

function procesarConsultaCliente(textoCliente) {
  const limpio = textoCliente.trim();
  if (!limpio) return;

  agregarBurbuja(limpio, "user");

  const area = document.getElementById("waMessagesArea");
  const statusEl = document.getElementById("waStatusText");
  statusEl.textContent = "escribiendo...";

  const typing = document.createElement("div");
  typing.className = "typing-bubble";
  typing.textContent = "IA redactando respuesta...";
  area.appendChild(typing);
  area.scrollTop = area.scrollHeight;

  const cfg = CONFIG_RUBROS[rubroActual];
  const lower = limpio.toLowerCase();
  const match =
    cfg.reglas.find((r) => r.keywords.some((kw) => lower.includes(kw))) ||
    cfg.fallback;

  setTimeout(() => {
    typing.remove();
    statusEl.textContent = "● En línea • Asistente IA 24/7";
    agregarBurbuja(match.respuesta, "bot");

    document.getElementById("detectedIntent").textContent = match.intent;
    document.getElementById("autoActionTaken").textContent = match.accion;
    document.getElementById("leadStatusTag").textContent = match.lead;
    document.getElementById("aiLatencyBadge").textContent = "⚡ Respuesta: 0.6s";
  }, 550);
}

// Eventos
document.getElementById("nicheSwitcher").addEventListener("click", (e) => {
  const btn = e.target.closest(".niche-btn");
  if (!btn) return;
  document.querySelectorAll(".niche-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  iniciarRubro(btn.dataset.niche);
});

document.getElementById("quickPromptsBar").addEventListener("click", (e) => {
  const chip = e.target.closest(".prompt-chip");
  if (!chip) return;
  procesarConsultaCliente(chip.textContent);
});

document.getElementById("waChatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("waUserInput");
  const val = input.value;
  input.value = "";
  procesarConsultaCliente(val);
});

document.getElementById("resetChatBtn").addEventListener("click", () => {
  iniciarRubro(rubroActual);
});

// Inicializar
iniciarRubro("tienda");