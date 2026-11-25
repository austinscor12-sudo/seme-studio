const PRODUCTOS_DEMO = [
  {
    id: "doble-brasa",
    categoria: "burgers",
    tag: "Más pedida",
    emoji: "🍔",
    bg: "linear-gradient(135deg, #2B1408 0%, #4A1D09 100%)",
    nombre: "Doble Brasa Cheddar",
    desc: "Doble medallón smash 120g, doble cheddar fundido, panceta crocante y salsa secreta.",
    precio: 9800
  },
  {
    id: "criolla-grill",
    categoria: "burgers",
    tag: "Especial",
    emoji: "🥩",
    bg: "linear-gradient(135deg, #291015 0%, #4A1520 100%)",
    nombre: "Criolla Ahumada",
    desc: "Carne a la parrilla, provoleta fundida, morrones asados y chimichurri casero.",
    precio: 10500
  },
  {
    id: "combo-amigos",
    categoria: "combos",
    tag: "Ahorro 15%",
    emoji: "🔥",
    bg: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
    nombre: "Combo Dúo Brasa",
    desc: "2 Burgers Doble Brasa + 1 Porción grande de papas cheddar + 2 Gaseosas 500ml.",
    precio: 21500
  },
  {
    id: "combo-familiar",
    categoria: "combos",
    tag: "Para 4",
    emoji: "📦",
    bg: "linear-gradient(135deg, #0F2922 0%, #134E4A 100%)",
    nombre: "Box Cuádruple",
    desc: "4 Burgers clásicas con queso + 2 Bandejas de papas rústicas + Dip de alioli.",
    precio: 36000
  },
  {
    id: "papas-cheddar",
    categoria: "acompanamientos",
    tag: "Clásico",
    emoji: "🍟",
    bg: "linear-gradient(135deg, #2D2106 0%, #523B09 100%)",
    nombre: "Papas Cheddar & Bacon",
    desc: "Porción abundante de papas bastón crocantes con crema de cheddar y verdeo.",
    precio: 5900
  },
  {
    id: "aros-cebolla",
    categoria: "acompanamientos",
    tag: "Crocante",
    emoji: "🧅",
    bg: "linear-gradient(135deg, #26170D 0%, #472814 100%)",
    nombre: "Aros de Cebolla (10 u.)",
    desc: "Rebozados súper crocantes acompañados con salsa barbacoa ahumada.",
    precio: 4800
  },
  {
    id: "coca-500",
    categoria: "bebidas",
    tag: "Bien fría",
    emoji: "🥤",
    bg: "linear-gradient(135deg, #2A0D10 0%, #4C1219 100%)",
    nombre: "Gaseosa Línea Coca 500ml",
    desc: "Original, Sin Azúcar o Sprite bien helada.",
    precio: 2400
  },
  {
    id: "pinta-artesanal",
    categoria: "bebidas",
    tag: "Artesanal",
    emoji: "🍺",
    bg: "linear-gradient(135deg, #291D05 0%, #4D3608 100%)",
    nombre: "Lata Cerveza Rubia 473ml",
    desc: "Cerveza artesanal suave, refrescante y lista para tomar.",
    precio: 3200
  }
];

const carrito = {};
let categoriaActual = "todos";
let textoBusqueda = "";
let modoEntrega = "Envío a domicilio";
const COSTO_ENVIO = 1500;

const productsGrid = document.getElementById("productsGrid");
const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");
const cartTotalBar = document.getElementById("cartTotalBar");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsList = document.getElementById("cartItemsList");
const successModal = document.getElementById("successModal");

function formatoPesos(valor) {
  return "$" + valor.toLocaleString("es-AR");
}

function renderProductos() {
  const filtrados = PRODUCTOS_DEMO.filter((p) => {
    const matchCat = categoriaActual === "todos" || p.categoria === categoriaActual;
    const matchText =
      p.nombre.toLowerCase().includes(textoBusqueda) ||
      p.desc.toLowerCase().includes(textoBusqueda);
    return matchCat && matchText;
  });

  productsGrid.innerHTML = filtrados
    .map((prod) => {
      const cant = carrito[prod.id] || 0;
      const controlHtml =
        cant === 0
          ? `<button type="button" class="btn-add" data-action="add" data-id="${prod.id}">+ Agregar</button>`
          : `<div class="qty-stepper">
               <button type="button" class="qty-btn" data-action="dec" data-id="${prod.id}">−</button>
               <span class="qty-val">${cant}</span>
               <button type="button" class="qty-btn" data-action="inc" data-id="${prod.id}">+</button>
             </div>`;

      return `
        <article class="product-card">
          <div class="product-visual" style="background: ${prod.bg};">
            <span class="product-tag">${prod.tag}</span>
            <span>${prod.emoji}</span>
          </div>
          <div class="product-body">
            <h3>${prod.nombre}</h3>
            <p>${prod.desc}</p>
            <div class="product-footer">
              <span class="product-price">${formatoPesos(prod.precio)}</span>
              ${controlHtml}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function actualizarResumenCarrito() {
  let totalUnidades = 0;
  let subtotal = 0;

  Object.entries(carrito).forEach(([id, cant]) => {
    if (cant > 0) {
      const prod = PRODUCTOS_DEMO.find((p) => p.id === id);
      if (prod) {
        totalUnidades += cant;
        subtotal += prod.precio * cant;
      }
    }
  });

  cartCount.textContent = totalUnidades;
  const envio = modoEntrega === "Envío a domicilio" && subtotal > 0 ? COSTO_ENVIO : 0;
  const totalFinal = subtotal + envio;

  cartTotalBar.textContent = formatoPesos(totalFinal);

  if (totalUnidades > 0) {
    cartBar.classList.remove("hidden");
  } else {
    cartBar.classList.add("hidden");
    cartDrawer.classList.remove("open");
  }

  // Actualizar lista dentro del drawer
  const itemsActivos = Object.entries(carrito).filter(([, cant]) => cant > 0);
  cartItemsList.innerHTML = itemsActivos
    .map(([id, cant]) => {
      const prod = PRODUCTOS_DEMO.find((p) => p.id === id);
      return `
        <div class="cart-item-row">
          <div>
            <strong>${cant}x ${prod.nombre}</strong>
            <span>${formatoPesos(prod.precio * cant)}</span>
          </div>
          <div class="qty-stepper">
            <button type="button" class="qty-btn" data-action="dec" data-id="${prod.id}">−</button>
            <span class="qty-val">${cant}</span>
            <button type="button" class="qty-btn" data-action="inc" data-id="${prod.id}">+</button>
          </div>
        </div>
      `;
    })
    .join("");

  document.getElementById("subTotalText").textContent = formatoPesos(subtotal);
  document.getElementById("shippingText").textContent = envio > 0 ? formatoPesos(envio) : "Gratis";
  document.getElementById("grandTotalText").textContent = formatoPesos(totalFinal);

  // Generar vista previa exacta del mensaje de WhatsApp
  const nombre = document.getElementById("clientName").value.trim() || "Cliente";
  const direccion = document.getElementById("clientAddress").value.trim() || "A coordinar";
  const pago = document.getElementById("paymentMethod").value;

  const lineasItems = itemsActivos
    .map(([id, cant]) => {
      const prod = PRODUCTOS_DEMO.find((p) => p.id === id);
      return `• ${cant}x ${prod.nombre} (${formatoPesos(prod.precio * cant)})`;
    })
    .join("\n");

  const entregaTexto =
    modoEntrega === "Envío a domicilio"
      ? `🛵 *Entrega:* Delivery a ${direccion}`
      : `🏪 *Entrega:* Retiro en el local`;

  document.getElementById("waMessagePreview").textContent =
    `Hola *BRASA & CO.*! Quiero hacer este pedido:\n\n` +
    `${lineasItems}\n\n` +
    `👤 *Nombre:* ${nombre}\n` +
    `${entregaTexto}\n` +
    `💳 *Pago:* ${pago}\n` +
    `💰 *Total:* ${formatoPesos(totalFinal)}`;
}

// Eventos de productos (+ / -)
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "add" || action === "inc") {
    carrito[id] = (carrito[id] || 0) + 1;
  } else if (action === "dec") {
    carrito[id] = Math.max(0, (carrito[id] || 0) - 1);
  }

  renderProductos();
  actualizarResumenCarrito();
});

// Filtros por categoría
document.getElementById("catPills").addEventListener("click", (e) => {
  const pill = e.target.closest(".cat-pill");
  if (!pill) return;
  document.querySelectorAll(".cat-pill").forEach((p) => p.classList.remove("active"));
  pill.classList.add("active");
  categoriaActual = pill.dataset.cat;
  renderProductos();
});

// Buscador
document.getElementById("searchInput").addEventListener("input", (e) => {
  textoBusqueda = e.target.value.trim().toLowerCase();
  renderProductos();
});

// Abrir / cerrar carrito
document.getElementById("openCartBtn").addEventListener("click", () => {
  actualizarResumenCarrito();
  cartDrawer.classList.add("open");
});

document.getElementById("closeCartBtn").addEventListener("click", () => {
  cartDrawer.classList.remove("open");
});

// Toggle Delivery / Retiro
document.getElementById("deliveryToggle").addEventListener("click", (e) => {
  const btn = e.target.closest(".toggle-btn");
  if (!btn) return;
  document.querySelectorAll(".toggle-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  modoEntrega = btn.dataset.mode;

  const addressGroup = document.getElementById("addressGroup");
  addressGroup.style.display = modoEntrega === "Envío a domicilio" ? "block" : "none";
  actualizarResumenCarrito();
});

// Actualizar vista previa en tiempo real al escribir nombre/dirección/pago
["clientName", "clientAddress", "paymentMethod"].forEach((id) => {
  document.getElementById(id).addEventListener("input", actualizarResumenCarrito);
});

// Simular envío de pedido
document.getElementById("simulateOrderBtn").addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  successModal.classList.add("open");
});

document.getElementById("closeSuccessBtn").addEventListener("click", () => {
  successModal.classList.remove("open");
});

// Inicio con 1 producto pre-cargado para que se luzca apenas entra
carrito["doble-brasa"] = 1;
renderProductos();
actualizarResumenCarrito();