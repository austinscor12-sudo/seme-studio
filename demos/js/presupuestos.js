const itemsPresupuesto = [
  {
    id: 1,
    cant: 2,
    desc: "Ventana Balcón Línea Módena 2.00 x 2.05m DVH Blanco",
    precio: 345000
  },
  {
    id: 2,
    cant: 1,
    desc: "Puerta Reja de Seguridad Hierro Macizo + Cerradura Doble Paleta",
    precio: 280000
  },
  {
    id: 3,
    cant: 1,
    desc: "Colocación en obra, sellado estructural y flete local",
    precio: 85000
  }
];

function formatoPesos(valor) {
  return "$" + Math.round(valor).toLocaleString("es-AR");
}

function mostrarToast(texto) {
  const toast = document.getElementById("toastMsg");
  toast.textContent = texto;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderEditorItems() {
  const cont = document.getElementById("itemsEditorList");
  cont.innerHTML = itemsPresupuesto
    .map(
      (item, idx) => `
      <div class="item-edit-row" data-idx="${idx}">
        <input type="number" class="inp-qty" min="1" value="${item.cant}" aria-label="Cantidad" />
        <input type="text" class="inp-desc" value="${item.desc}" aria-label="Descripción" />
        <input type="number" class="inp-price" min="0" step="1000" value="${item.precio}" aria-label="Precio unitario" />
        <button type="button" class="btn-del-item" data-del="${idx}" title="Quitar ítem">✕</button>
      </div>
    `
    )
    .join("");
}

function actualizarDocumentoA4() {
  const cliente = document.getElementById("clientNameInput").value.trim() || "Cliente Particular";
  const ref = document.getElementById("clientPhoneInput").value.trim() || "Sin referencia";
  const validez = document.getElementById("validitySelect").value;
  const pctSena = Number(document.getElementById("depositSelect").value);
  const pctDesc = Math.max(0, Math.min(80, Number(document.getElementById("discountInput").value) || 0));

  document.getElementById("docClientName").textContent = cliente;
  document.getElementById("docClientRef").textContent = ref;
  document.getElementById("docValidity").textContent = `Validez: ${validez}`;

  // Tabla A4
  const tbody = document.getElementById("docTableBody");
  let subtotal = 0;

  tbody.innerHTML = itemsPresupuesto
    .map((item) => {
      const subItem = item.cant * item.precio;
      subtotal += subItem;
      return `
        <tr>
          <td class="col-cant">${item.cant}</td>
          <td>${item.desc || "Ítem sin descripción"}</td>
          <td class="col-num">${formatoPesos(item.precio)}</td>
          <td class="col-num">${formatoPesos(subItem)}</td>
        </tr>
      `;
    })
    .join("");

  const montoDescuento = subtotal * (pctDesc / 100);
  const totalFinal = subtotal - montoDescuento;
  const montoSena = totalFinal * (pctSena / 100);

  document.getElementById("docSubtotal").textContent = formatoPesos(subtotal);

  const descRow = document.getElementById("docDiscountRow");
  if (pctDesc > 0) {
    descRow.style.display = "flex";
    document.getElementById("docDiscountLabel").textContent = `Bonificación (${pctDesc}%)`;
    document.getElementById("docDiscountVal").textContent = `-${formatoPesos(montoDescuento)}`;
  } else {
    descRow.style.display = "none";
  }

  document.getElementById("docGrandTotal").textContent = formatoPesos(totalFinal);

  const depositBox = document.getElementById("docDepositBox");
  const depositLine = document.getElementById("docDepositLine");
  if (pctSena > 0) {
    depositBox.style.display = "flex";
    document.getElementById("docDepositPctLabel").textContent = `Seña para iniciar (${pctSena}%)`;
    document.getElementById("docDepositVal").textContent = formatoPesos(montoSena);
    depositLine.textContent = `Seña del ${pctSena}% (${formatoPesos(montoSena)}) para congelar precios y acopio.`;
  } else {
    depositBox.style.display = "none";
    depositLine.textContent = "Condición: 100% contra entrega y conformidad de obra.";
  }
}

// Eventos en inputs generales
["clientNameInput", "clientPhoneInput", "validitySelect", "depositSelect", "discountInput"].forEach(
  (id) => {
    document.getElementById(id).addEventListener("input", actualizarDocumentoA4);
    document.getElementById(id).addEventListener("change", actualizarDocumentoA4);
  }
);

// Edición en vivo de ítems
document.getElementById("itemsEditorList").addEventListener("input", (e) => {
  const row = e.target.closest(".item-edit-row");
  if (!row) return;
  const idx = Number(row.dataset.idx);

  if (e.target.classList.contains("inp-qty")) {
    itemsPresupuesto[idx].cant = Math.max(1, Number(e.target.value) || 1);
  } else if (e.target.classList.contains("inp-desc")) {
    itemsPresupuesto[idx].desc = e.target.value;
  } else if (e.target.classList.contains("inp-price")) {
    itemsPresupuesto[idx].precio = Math.max(0, Number(e.target.value) || 0);
  }
  actualizarDocumentoA4();
});

// Eliminar ítem
document.getElementById("itemsEditorList").addEventListener("click", (e) => {
  const delBtn = e.target.closest("[data-del]");
  if (!delBtn) return;
  if (itemsPresupuesto.length <= 1) {
    mostrarToast("Debe quedar al menos 1 ítem en el presupuesto");
    return;
  }
  itemsPresupuesto.splice(Number(delBtn.dataset.del), 1);
  renderEditorItems();
  actualizarDocumentoA4();
});

// Agregar nuevo ítem
document.getElementById("addItemBtn").addEventListener("click", () => {
  itemsPresupuesto.push({
    id: Date.now(),
    cant: 1,
    desc: "Mosquitero corredizo aluminio anodizado",
    precio: 68000
  });
  renderEditorItems();
  actualizarDocumentoA4();
});

// Exportar / Imprimir PDF A4 real
document.getElementById("exportPdfBtn").addEventListener("click", () => {
  window.print();
});

// Copiar resumen formateado para WhatsApp
document.getElementById("shareWaBtn").addEventListener("click", () => {
  const cliente = document.getElementById("docClientName").textContent;
  const total = document.getElementById("docGrandTotal").textContent;
  const validez = document.getElementById("validitySelect").value;
  const lineas = itemsPresupuesto
    .map((it) => `• ${it.cant}x ${it.desc}: ${formatoPesos(it.cant * it.precio)}`)
    .join("\n");

  const textoWa =
    `📄 *PRESUPUESTO N° 00084-2026*\n` +
    `*Cliente:* ${cliente}\n\n` +
    `${lineas}\n\n` +
    `💰 *TOTAL FINAL:* ${total}\n` +
    `⏳ *Validez:* ${validez}`;

  navigator.clipboard?.writeText(textoWa);
  mostrarToast("Resumen listo y copiado para WhatsApp ✓");
});

// Inicializar
renderEditorItems();
actualizarDocumentoA4();