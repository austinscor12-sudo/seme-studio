const CARTA_RESTO = [
  {
    id: "tabla-criolla",
    cat: "tapas",
    emoji: "🧀",
    nombre: "Tabla Fuego & Quesos",
    desc: "Provoleta grillada, bondiola curada, papas bravas y dips caseros.",
    precio: 14800
  },
  {
    id: "rabas-limon",
    cat: "tapas",
    emoji: "🦑",
    nombre: "Rabas Crocantes al Limón",
    desc: "Aros de calamar tiernos con alioli de ajo asado.",
    precio: 11200
  },
  {
    id: "smash-trufa",
    cat: "principales",
    emoji: "🍔",
    nombre: "Smash Burger Trufada",
    desc: "Doble carne, queso emmental, cebolla caramelizada y papas.",
    precio: 10400
  },
  {
    id: "bife-chorizo",
    cat: "principales",
    emoji: "🥩",
    nombre: "Bife de Chorizo 350g",
    desc: "A las brasas con papas rústicas y chimichurri ahumado.",
    precio: 16900
  },
  {
    id: "pinta-ipa",
    cat: "tragos",
    emoji: "🍺",
    nombre: "Pinta IPA Artesanal",
    desc: "500ml bien fría, notas cítricas y amargor equilibrado.",
    precio: 4600
  },
  {
    id: "gin-tonic",
    cat: "tragos",
    emoji: "🍸",
    nombre: "Gin Tonic Botánico",
    desc: "Gin macerado, tónica premium, pepino y bayas de enebro.",
    precio: 6200
  },
  {
    id: "volcan-choco",
    cat: "postres",
    emoji: "🍫",
    nombre: "Volcán de Chocolate",
    desc: "Centro tibio fundido con bocha de helado de americana.",
    precio: 5800
  }
];

// Consumo ya cargado en Mesa 07 para probar la división de cuenta de entrada
const cuentaMesa = [
  { uid: 1, nombre: "Tabla Fuego & Quesos", precio: 14800 },
  { uid: 2, nombre: "Smash Burger Trufada", precio: 10400 },
  { uid: 3, nombre: "Pinta IPA Artesanal", precio: 4600 },
  { uid: 4, nombre: "Pinta IPA Artesanal", precio: 4600 }
];

const rondaNueva = {};
let categoriaActiva = "todos";
let comensales = 4;
let porcentajePropina = 10;
let modoDivision = "equal";
const itemsSeleccionados = new Set([2, 3]);

function formatoPesos(n) {
  return "$" + Math.round(n).toLocaleString("es-AR");
}

function mostrarToast(texto) {
  const toast = document.getElementById("toastMsg");
  toast.textContent = texto;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderCarta() {
  const grid = document.getElementById("dishesGrid");
  const filtrados = CARTA_RESTO.filter(
    (d) => categoriaActiva === "todos" || d.cat === categoriaActiva
  );

  grid.innerHTML = filtrados
    .map((plato) => {
      const cant = rondaNueva[plato.id] || 0;
      const accionHtml =
        cant === 0
          ? `<button type="button" class="btn-add-dish" data-act="add" data-id="${plato.id}">+ Pedir</button>`
          : `<div class="qty-control">
               <button type="button" data-act="dec" data-id="${plato.id}">−</button>
               <span>${cant}</span>
               <button type="button" data-act="inc" data-id="${plato.id}">+</button>
             </div>`;

      return `
        <article class="dish-card">
          <div class="dish-top">
            <div class="dish-emoji">${plato.emoji}</div>
            <div class="dish-info">
              <h3>${plato.nombre}</h3>
              <p>${plato.desc}</p>
            </div>
          </div>
          <div class="dish-bottom">
            <span class="dish-price">${formatoPesos(plato.precio)}</span>
            ${accionHtml}
          </div>
        </article>
      `;
    })
    .join("");
}

function actualizarTotalesYCuenta() {
  const subtotalMesa = cuentaMesa.reduce((acc, item) => acc + item.precio, 0);
  document.getElementById("headerTableTotal").textContent = formatoPesos(subtotalMesa);

  // Revisar si hay platos nuevos en la ronda pendiente
  const pendientes = Object.entries(rondaNueva).filter(([, cant]) => cant > 0);
  const cantPendiente = pendientes.reduce((acc, [, cant]) => acc + cant, 0);

  if (cantPendiente > 0) {
    document.getElementById("dockSubLabel").textContent = `${cantPendiente} ítem(s) listos para pedir`;
    document.getElementById("dockMainLabel").textContent = "Confirmar ronda a cocina";
    document.getElementById("dockActionBtn").textContent = "Ver Ronda y Cuenta →";
  } else {
    document.getElementById("dockSubLabel").textContent = `Cuenta activa Mesa 07 • ${comensales} personas`;
    document.getElementById("dockMainLabel").textContent = `${formatoPesos(subtotalMesa)} acumulado`;
    document.getElementById("dockActionBtn").textContent = "Dividir Cuenta →";
  }

  // Render ronda pendiente en drawer
  const pendingBox = document.getElementById("pendingRoundBox");
  if (cantPendiente > 0) {
    pendingBox.classList.remove("hidden");
    document.getElementById("pendingItemsList").innerHTML = pendientes
      .map(([id, cant]) => {
        const plato = CARTA_RESTO.find((p) => p.id === id);
        return `<div class="pending-line"><span>${cant}x ${plato.nombre}</span><strong>${formatoPesos(plato.precio * cant)}</strong></div>`;
      })
      .join("");
  } else {
    pendingBox.classList.add("hidden");
  }

  // Render consumo cargado en mesa
  document.getElementById("consumedList").innerHTML = cuentaMesa
    .map(
      (item) => `
      <div class="consumed-row">
        <span>1x ${item.nombre}</span>
        <strong>${formatoPesos(item.precio)}</strong>
      </div>
    `
    )
    .join("");

  // Cálculo modo partes iguales
  const propinaMonto = subtotalMesa * (porcentajePropina / 100);
  const totalConPropina = subtotalMesa + propinaMonto;
  const porPersona = totalConPropina / comensales;

  document.getElementById("dinersCountText").textContent = comensales;
  document.getElementById("tipSummaryLabel").textContent =
    porcentajePropina > 0 ? `+${porcentajePropina}% propina` : "sin propina";
  document.getElementById("billGrandTotal").textContent = formatoPesos(totalConPropina);
  document.getElementById("perPersonAmount").textContent = formatoPesos(porPersona);

  // Render modo por ítem individual
  const selectableList = document.getElementById("selectableItemsList");
  selectableList.innerHTML = cuentaMesa
    .map((item) => {
      const checked = itemsSeleccionados.has(item.uid);
      return `
        <div class="sel-item-row ${checked ? "checked" : ""}" data-uid="${item.uid}">
          <span>${checked ? "☑️" : "⬜"} ${item.nombre}</span>
          <strong>${formatoPesos(item.precio)}</strong>
        </div>
      `;
    })
    .join("");

  let sumaIndividual = 0;
  cuentaMesa.forEach((item) => {
    if (itemsSeleccionados.has(item.uid)) sumaIndividual += item.precio;
  });
  const totalIndividual = sumaIndividual * 1.1;
  document.getElementById("selectedItemsCount").textContent = `${itemsSeleccionados.size} ítems`;
  document.getElementById("myCustomAmount").textContent = formatoPesos(totalIndividual);
}

// Clics en platos (+ / -)
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const id = btn.dataset.id;
  const act = btn.dataset.act;

  if (act === "add" || act === "inc") {
    rondaNueva[id] = (rondaNueva[id] || 0) + 1;
  } else if (act === "dec") {
    rondaNueva[id] = Math.max(0, (rondaNueva[id] || 0) - 1);
  }

  renderCarta();
  actualizarTotalesYCuenta();
});

// Categorías
document.getElementById("menuCats").addEventListener("click", (e) => {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;
  document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  categoriaActiva = btn.dataset.cat;
  renderCarta();
});

// Llamar al mozo
document.getElementById("callWaiterBtn").addEventListener("click", () => {
  mostrarToast("🔔 ¡Mozo notificado! Se acerca a Mesa 07");
});

// Abrir / cerrar drawer
const billDrawer = document.getElementById("billDrawer");
document.getElementById("openBillBtn").addEventListener("click", () => billDrawer.classList.add("open"));
document.getElementById("dockActionBtn").addEventListener("click", () => billDrawer.classList.add("open"));
document.getElementById("closeBillBtn").addEventListener("click", () => billDrawer.classList.remove("open"));

// Enviar nueva ronda a cocina y sumarla a la cuenta
document.getElementById("sendKitchenBtn").addEventListener("click", () => {
  Object.entries(rondaNueva).forEach(([id, cant]) => {
    const plato = CARTA_RESTO.find((p) => p.id === id);
    for (let i = 0; i < cant; i++) {
      cuentaMesa.push({
        uid: Date.now() + Math.random(),
        nombre: plato.nombre,
        precio: plato.precio
      });
    }
    delete rondaNueva[id];
  });

  renderCarta();
  actualizarTotalesYCuenta();
  mostrarToast("🔥 ¡Ronda enviada a cocina y sumada a la mesa!");
});

// Cambiar modo de división
document.getElementById("splitModeTabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".split-tab");
  if (!tab) return;
  document.querySelectorAll(".split-tab").forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  modoDivision = tab.dataset.mode;

  document.getElementById("equalSplitPanel").classList.toggle("hidden", modoDivision !== "equal");
  document.getElementById("itemSplitPanel").classList.toggle("hidden", modoDivision !== "items");
});

// Stepper comensales
document.getElementById("decDinersBtn").addEventListener("click", () => {
  comensales = Math.max(2, comensales - 1);
  actualizarTotalesYCuenta();
});

document.getElementById("incDinersBtn").addEventListener("click", () => {
  comensales = Math.min(20, comensales + 1);
  actualizarTotalesYCuenta();
});

// Propina
document.getElementById("tipPills").addEventListener("click", (e) => {
  const pill = e.target.closest(".tip-pill");
  if (!pill) return;
  document.querySelectorAll(".tip-pill").forEach((p) => p.classList.remove("active"));
  pill.classList.add("active");
  porcentajePropina = Number(pill.dataset.tip);
  actualizarTotalesYCuenta();
});

// Marcar ítems individuales
document.getElementById("selectableItemsList").addEventListener("click", (e) => {
  const row = e.target.closest(".sel-item-row");
  if (!row) return;
  const uid = Number(row.dataset.uid);
  if (itemsSeleccionados.has(uid)) {
    itemsSeleccionados.delete(uid);
  } else {
    itemsSeleccionados.add(uid);
  }
  actualizarTotalesYCuenta();
});

// Solicitar cobro en mesa
const confirmModal = document.getElementById("confirmModal");
document.getElementById("finishBillBtn").addEventListener("click", () => {
  billDrawer.classList.remove("open");
  const monto =
    modoDivision === "equal"
      ? document.getElementById("perPersonAmount").textContent + ` cada uno (${comensales} personas)`
      : document.getElementById("myCustomAmount").textContent + " por tu consumo individual";

  document.getElementById("confirmModalDesc").textContent =
    `El mozo ya recibió el aviso para acercar el posnet o QR a Mesa 07. Total calculado: ${monto}.`;
  confirmModal.classList.add("open");
});

document.getElementById("closeConfirmBtn").addEventListener("click", () => {
  confirmModal.classList.remove("open");
});

// Inicializar
renderCarta();
actualizarTotalesYCuenta();