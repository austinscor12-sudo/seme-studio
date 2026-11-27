window.VidrieraApp = (function () {
  let products = [];
  let config = {};
  let currentCat = "todos";
  let activeProduct = null;
  let activeItemEl = null;
  let selectedVariant = null;
  let qty = 1;
  let cart = [];
  let isZoomed = false;
  let wallBaseX = 0;
  let wallBaseY = 0;

  const stage = document.getElementById("stage");
  const wall = document.getElementById("wall");
  const toastEl = document.getElementById("toast");

  function formatARS(val) {
    return "$ " + Math.round(val).toLocaleString("es-AR");
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(window._vidrieraToast);
    window._vidrieraToast = setTimeout(() => toastEl.classList.remove("show"), 2300);
  }

  function attach3DHover(card) {
    card.addEventListener("mousemove", (e) => {
      if (isZoomed) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      const rx = ((y / rect.height) - 0.5) * -14;
      const ry = ((x / rect.width) - 0.5) * 16;

      card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      card.style.setProperty("--mx", `${px.toFixed(1)}%`);
      card.style.setProperty("--my", `${py.toFixed(1)}%`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  }

  function renderWall() {
    const filtered = currentCat === "todos"
      ? products
      : products.filter(p => p.cat === currentCat);

    wall.innerHTML = filtered.map(p => `
      <article class="shelf-item" data-id="${p.id}">
        <span class="item-tag-top">${p.code || ""}</span>
        <div class="item-visual">${p.visual}</div>
        <div class="wooden-shelf"></div>
        <div class="shelf-caption">
          <h3>${p.name}</h3>
          <span>${formatARS(p.price)}</span>
        </div>
      </article>
    `).join("");

    wall.querySelectorAll(".shelf-item").forEach(el => {
      attach3DHover(el);
      el.addEventListener("click", () => {
        const prod = products.find(p => p.id === el.dataset.id);
        if (prod) zoomTo(el, prod);
      });
    });
  }

  function setCameraMode(mode) {
    if (!activeItemEl) return;
    activeItemEl.classList.remove("is-flipped", "is-macro");
    document.querySelectorAll(".cam-pill").forEach(b => b.classList.remove("active"));

    if (mode === "flip") {
      activeItemEl.classList.add("is-flipped");
      document.getElementById("camFlipBtn")?.classList.add("active");
    } else if (mode === "macro") {
      activeItemEl.classList.add("is-macro");
      document.getElementById("camMacroBtn")?.classList.add("active");
    } else {
      document.getElementById("camNormalBtn")?.classList.add("active");
    }
  }

  function zoomTo(itemEl, prod) {
    activeProduct = prod;
    activeItemEl = itemEl;
    qty = 1;

    const available = prod.variants.filter(v => !(prod.outOfStock || []).includes(v));
    selectedVariant = available[0] || prod.variants[0];

    document.getElementById("hudTag").textContent = prod.tag;
    document.getElementById("hudHeading").textContent = prod.name;
    document.getElementById("hudPrice").textContent = formatARS(prod.price);
    document.getElementById("hudInstallments").textContent = `3 cuotas sin interés de ${formatARS(prod.price / 3)}`;
    document.getElementById("hudDesc").textContent = prod.desc;
    document.getElementById("hudQty").textContent = qty;
    document.getElementById("hudVariantLabel").textContent = `${config.variantLabel || "Opción"}: ${selectedVariant}`;

    const specsEl = document.getElementById("hudSpecs");
    if (specsEl) {
      specsEl.innerHTML = (prod.specs || []).map(s => `<span class="spec-chip">${s}</span>`).join("");
    }

    const variantsGrid = document.getElementById("variantsGrid");
    variantsGrid.innerHTML = prod.variants.map(v => {
      const disabled = (prod.outOfStock || []).includes(v);
      const active = v === selectedVariant ? "active" : "";
      return `<button type="button" class="variant-btn ${active}" data-val="${v}" ${disabled ? "disabled" : ""}>${v}</button>`;
    }).join("");

    variantsGrid.querySelectorAll(".variant-btn:not(:disabled)").forEach(btn => {
      btn.addEventListener("click", () => {
        selectedVariant = btn.dataset.val;
        document.getElementById("hudVariantLabel").textContent = `${config.variantLabel || "Opción"}: ${selectedVariant}`;
        variantsGrid.querySelectorAll(".variant-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    wall.querySelectorAll(".shelf-item").forEach(el => el.classList.remove("is-active", "is-flipped", "is-macro"));
    itemEl.classList.add("is-active");
    setCameraMode("normal");

    // 1. Activar clase primero para fijar el stage a 100vh antes de medir coordenadas
    document.body.classList.add("is-zoomed");

    if (!isZoomed) {
      const rect = wall.getBoundingClientRect();
      wallBaseX = rect.left;
      wallBaseY = rect.top;
    }
    isZoomed = true;

    const isMobile = window.innerWidth <= 920;
    const targetScale = isMobile ? 1.85 : 2.55;

    // 2. Centrar sobre el bloque visual (zapatilla + repisa), no sobre el texto oculto de abajo
    const visualEl = itemEl.querySelector(".item-visual");
    const itemCenterX = itemEl.offsetLeft + itemEl.offsetWidth / 2;
    const itemCenterY = itemEl.offsetTop + (visualEl ? visualEl.offsetTop + visualEl.offsetHeight * 0.58 : itemEl.offsetHeight * 0.45);

    const targetScreenX = isMobile ? window.innerWidth * 0.5 : window.innerWidth * 0.35;
    const targetScreenY = isMobile ? window.innerHeight * 0.36 : window.innerHeight * 0.57;

    const tx = targetScreenX - wallBaseX - itemCenterX * targetScale;
    const ty = targetScreenY - wallBaseY - itemCenterY * targetScale;

    wall.style.transform = `translate(${tx}px, ${ty}px) scale(${targetScale})`;
  }

  function resetZoom() {
    if (!isZoomed) return;
    isZoomed = false;
    activeProduct = null;
    activeItemEl = null;
    document.body.classList.remove("is-zoomed");
    wall.querySelectorAll(".shelf-item").forEach(el => el.classList.remove("is-active", "is-flipped", "is-macro"));
    wall.style.transform = "translate(0px, 0px) scale(1)";
  }

  function buildWhatsAppMessage() {
    if (cart.length === 0) return "Agregá productos al pedido para ver la vista previa del mensaje.";
    const clientName = document.getElementById("clientName").value.trim() || "Cliente Web";
    const delivery = document.getElementById("deliverySelect").value;
    const address = document.getElementById("addressField").value.trim();
    const payment = document.getElementById("paymentSelect").value;
    const notes = document.getElementById("orderNotes").value.trim();

    const lines = cart.map(i =>
      `• ${i.qty}x ${i.product.name} (${config.variantLabel || "Opción"} ${i.variant}) — ${formatARS(i.product.price * i.qty)}`
    ).join("\n");

    const entregaLine = delivery === "envio"
      ? `Envío a domicilio${address ? ` (${address})` : ""}`
      : "Retiro en local (Gratis)";

    const pagoMap = {
      transferencia: "Transferencia Bancaria (15% OFF)",
      efectivo: "Efectivo en mano (10% OFF)",
      tarjeta: "Tarjeta / Mercado Pago (3 cuotas s/ interés)"
    };

    const totalStr = document.getElementById("cartTotal").textContent;

    return (
      `Hola! Quiero confirmar este pedido desde *${config.storeName || "Catálogo 3D"}*:\n\n` +
      `*Cliente:* ${clientName}\n` +
      `*Entrega:* ${entregaLine}\n` +
      `*Pago:* ${pagoMap[payment]}\n` +
      (notes ? `*Nota:* ${notes}\n` : "") +
      `\n*Detalle del pedido:*\n${lines}\n\n` +
      `*Total Final:* ${totalStr}`
    );
  }

  function updateCartUI() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById("cartBadge").textContent = count;

    const list = document.getElementById("cartList");
    if (cart.length === 0) {
      list.innerHTML = `<p style="color:var(--muted);text-align:center;padding:24px 10px;font-size:0.86rem;">Tu carrito está vacío. Tocá cualquier zapatilla en la vitrina para elegir talle y sumarla.</p>`;
    } else {
      list.innerHTML = cart.map((item, i) => `
        <div class="cart-row">
          <div class="cart-thumb">${item.product.visual}</div>
          <div class="cart-row-info">
            <h4>${item.product.name}</h4>
            <p>${config.variantLabel || "Talle"} ${item.variant} &bull; ${formatARS(item.product.price)} c/u</p>
            <strong style="font-size:0.82rem;color:#ff9d6e;">${formatARS(item.product.price * item.qty)}</strong>
          </div>
          <div class="cart-row-controls">
            <button type="button" class="mini-qty" data-idx="${i}" data-delta="-1">−</button>
            <span style="font-weight:700;font-size:0.85rem;min-width:18px;text-align:center;">${item.qty}</span>
            <button type="button" class="mini-qty" data-idx="${i}" data-delta="1">+</button>
          </div>
        </div>
      `).join("");

      list.querySelectorAll(".mini-qty").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.idx);
          const delta = Number(btn.dataset.delta);
          cart[idx].qty += delta;
          if (cart[idx].qty <= 0) cart.splice(idx, 1);
          updateCartUI();
        });
      });
    }

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);
    const payment = document.getElementById("paymentSelect").value;
    const delivery = document.getElementById("deliverySelect").value;

    let discountRate = 0;
    let discountTitle = "Descuento";
    if (payment === "transferencia") {
      discountRate = 0.15;
      discountTitle = "Descuento Transferencia (15%)";
    } else if (payment === "efectivo") {
      discountRate = 0.10;
      discountTitle = "Descuento Efectivo (10%)";
    }

    const discount = Math.round(subtotal * discountRate);
    const shipping = (delivery === "envio" && subtotal > 0) ? 4500 : 0;
    const finalTotal = subtotal - discount + shipping;

    document.getElementById("subTotalVal").textContent = formatARS(subtotal);
    const discountRow = document.getElementById("discountRow");
    if (discount > 0) {
      discountRow.style.display = "flex";
      document.getElementById("discountLabel").textContent = discountTitle;
      document.getElementById("discountVal").textContent = "-" + formatARS(discount);
    } else {
      discountRow.style.display = "none";
    }

    document.getElementById("shippingVal").textContent = shipping > 0 ? formatARS(shipping) : "Gratis";
    document.getElementById("cartTotal").textContent = formatARS(finalTotal);

    const instEl = document.getElementById("installmentNote");
    if (payment === "tarjeta" && finalTotal > 0) {
      instEl.textContent = `O en 3 cuotas sin interés de ${formatARS(finalTotal / 3)}`;
    } else {
      instEl.textContent = "";
    }

    document.getElementById("waPreviewBox").textContent = buildWhatsAppMessage();
  }

  function addCurrentItem(openAfter) {
    if (!activeProduct) return;
    const key = `${activeProduct.id}-${selectedVariant}`;
    const found = cart.find(i => i.key === key);
    if (found) found.qty += qty;
    else cart.push({ key, product: activeProduct, variant: selectedVariant, qty });
    updateCartUI();
    showToast(`✓ ${activeProduct.name} (${config.variantLabel || "Talle"} ${selectedVariant}) agregado`);
    if (openAfter) {
      document.getElementById("drawer").classList.add("open");
      document.getElementById("drawerMask").classList.add("open");
    }
  }

  function init(userConfig) {
    config = userConfig;
    products = userConfig.products || [];

    const filterBar = document.getElementById("filterBar");
    if (filterBar) {
      filterBar.addEventListener("click", e => {
        const btn = e.target.closest(".cat-btn");
        if (!btn) return;
        currentCat = btn.dataset.cat;
        filterBar.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderWall();
      });
    }

    document.getElementById("btnBackWall").addEventListener("click", resetZoom);
    stage.addEventListener("click", e => {
      if (isZoomed && e.target === stage) resetZoom();
    });
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        document.getElementById("drawer").classList.remove("open");
        document.getElementById("drawerMask").classList.remove("open");
        resetZoom();
      }
    });

    document.getElementById("camNormalBtn")?.addEventListener("click", () => setCameraMode("normal"));
    document.getElementById("camFlipBtn")?.addEventListener("click", () => setCameraMode("flip"));
    document.getElementById("camMacroBtn")?.addEventListener("click", () => setCameraMode("macro"));

    document.getElementById("qtyMinus").addEventListener("click", () => {
      if (qty > 1) {
        qty--;
        document.getElementById("hudQty").textContent = qty;
      }
    });
    document.getElementById("qtyPlus").addEventListener("click", () => {
      if (qty < 10) {
        qty++;
        document.getElementById("hudQty").textContent = qty;
      }
    });

    document.getElementById("btnAddCart").addEventListener("click", () => addCurrentItem(false));
    document.getElementById("btnBuyNow")?.addEventListener("click", () => addCurrentItem(true));

    const drawer = document.getElementById("drawer");
    const mask = document.getElementById("drawerMask");
    document.getElementById("openCartBtn").addEventListener("click", () => {
      updateCartUI();
      drawer.classList.add("open");
      mask.classList.add("open");
    });
    document.getElementById("closeCartBtn").addEventListener("click", () => {
      drawer.classList.remove("open");
      mask.classList.remove("open");
    });
    mask.addEventListener("click", () => {
      drawer.classList.remove("open");
      mask.classList.remove("open");
    });

    document.getElementById("clearCartBtn")?.addEventListener("click", () => {
      cart = [];
      updateCartUI();
      showToast("Pedido vaciado");
    });

    document.getElementById("deliverySelect").addEventListener("change", (e) => {
      document.getElementById("addressField").style.display = e.target.value === "envio" ? "block" : "none";
      updateCartUI();
    });

    ["clientName", "addressField", "paymentSelect", "orderNotes"].forEach(id => {
      document.getElementById(id)?.addEventListener("input", updateCartUI);
      document.getElementById(id)?.addEventListener("change", updateCartUI);
    });

    document.getElementById("copyPreviewBtn")?.addEventListener("click", () => {
      if (cart.length === 0) return;
      navigator.clipboard?.writeText(buildWhatsAppMessage());
      showToast("✓ Resumen copiado al portapapeles");
    });

    document.getElementById("sendWaBtn").addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Agregá al menos una zapatilla primero");
        return;
      }
      const msg = buildWhatsAppMessage();
      window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    });

    renderWall();
    updateCartUI();
  }

  return { init };
})();