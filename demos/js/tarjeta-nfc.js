const PERFILES_DEMO = {
  ejecutivo: {
    temaCreativo: false,
    marca: "GRUPO VÉRTICE • PROPIEDADES",
    serial: "ID • 0049-NFC",
    iniciales: "MB",
    nombre: "Dr. Mateo Benítez",
    apellido: "Benítez",
    nombrePila: "Mateo",
    empresa: "Grupo Vértice Propiedades",
    cargoCard: "Corredor Inmobiliario & Tasaciones",
    categoriaTag: "TARJETA INTELIGENTE + AGENDA 1-TOQUE",
    rolCompleto: "Corredor Inmobiliario Mat. 418 • Grupo Vértice",
    bio: "Asesoramiento integral en compra, venta y tasación de propiedades residenciales y comerciales en Corrientes y Resistencia.",
    telefono: "+5493794551290",
    email: "mbenitez@grupovertice.com.ar",
    web: "https://semestudio.app/card/mateo-benitez",
    slug: "semestudio.app/card/mateo-benitez",
    accesos: [
      { icono: "💬", titulo: "WhatsApp Directo", sub: "Respuesta inmediata", href: "https://wa.me/5493794048564" },
      { icono: "📞", titulo: "Llamar Ahora", sub: "(379) 455-1290", href: "tel:+5493794551290" },
      { icono: "📍", titulo: "Oficina Central", sub: "9 de Julio 1150, Ctes", href: "https://maps.google.com/?q=Corrientes+Capital" },
      { icono: "✉️", titulo: "Correo Corporativo", sub: "mbenitez@grupovertice", href: "mailto:mbenitez@grupovertice.com.ar" }
    ],
    portfolioEyebrow: "PROPIEDADES Y OPERACIONES DESTACADAS",
    portfolioTitulo: "Propiedades en Cartera",
    proyectos: [
      {
        emoji: "🏢",
        badge: "VENTA • USD 145.000",
        titulo: "Piso 3 Ambientes c/ Balcón Terraza",
        resumen: "Vista plena al río Paraná, cochera cubierta y amenities.",
        detalle: "Departamento de categoría de 118 m² totales con parrilla propia en balcón, aberturas DVH y seguridad 24 hs.",
        specs: ["118 m²", "2 Dormitorios", "Cochera", "Apto Crédito"]
      },
      {
        emoji: "🏡",
        badge: "EXCLUSIVA • USD 210.000",
        titulo: "Casa Quinta en Santa Ana",
        resumen: "Parque de 1.200 m², piscina climatizada y quincho cerrado.",
        detalle: "Residencia lista para escriturar en entorno arbolado a 15 minutos del centro de Corrientes Capital.",
        specs: ["1.200 m² Lote", "3 Dormitorios", "Piscina", "Quincho"]
      }
    ]
  },
  creativo: {
    temaCreativo: true,
    marca: "ESTUDIO VERÓN • ARQUITECTURA",
    serial: "ID • 0108-NFC",
    iniciales: "SV",
    nombre: "Arq. Sofía Verón",
    apellido: "Verón",
    nombrePila: "Sofía",
    empresa: "Estudio Verón Arquitectura",
    cargoCard: "Arquitectura Residencial & Renders 3D",
    categoriaTag: "PORTFOLIO WEB + TARJETA NFC CREATIVA",
    rolCompleto: "Arquitecta UBA • Dirección de Obra & Interiorismo",
    bio: "Diseño de viviendas contemporáneas, locales comerciales y visualización arquitectónica 3D llave en mano.",
    telefono: "+5493794689034",
    email: "hola@estudioveron.arq",
    web: "https://semestudio.app/card/sofia-veron",
    slug: "semestudio.app/card/sofia-veron",
    accesos: [
      { icono: "💬", titulo: "Consultar Proyecto", sub: "WhatsApp del Estudio", href: "https://wa.me/5493794048564" },
      { icono: "📸", titulo: "Instagram Obras", sub: "@estudioveron.arq", href: "https://instagram.com" },
      { icono: "📐", titulo: "Agendar Reunión", sub: "Videollamada o Estudio", href: "https://wa.me/5493794048564" },
      { icono: "✉️", titulo: "Enviar Planos", sub: "hola@estudioveron.arq", href: "mailto:hola@estudioveron.arq" }
    ],
    portfolioEyebrow: "OBRAS Y VISUALIZACIÓN 3D SELECCIONADAS",
    portfolioTitulo: "Portfolio de Proyectos",
    proyectos: [
      {
        emoji: "🏛️",
        badge: "OBRA FINALIZADA 2026",
        titulo: "Casa Hormigón & Lapacho",
        resumen: "Vivienda unifamiliar de 260 m² con doble altura y galería.",
        detalle: "Proyecto integral, cálculo estructural, dirección de obra y diseño de mobiliario a medida.",
        specs: ["260 m²", "Hormigón Visto", "Domótica", "2026"]
      },
      {
        emoji: "☕",
        badge: "INTERIORISMO COMERCIAL",
        titulo: "Local Gastronómico Brasa",
        resumen: "Reforma integral, iluminación escénica y barra en piedra.",
        detalle: "Identidad espacial, acústica y diseño de barra para café de especialidad y resto nocturno.",
        specs: ["140 m²", "Llave en Mano", "Iluminación", "Renders 3D"]
      }
    ]
  }
};

let perfilActualKey = "ejecutivo";

function mostrarToast(texto) {
  const toast = document.getElementById("toastMsg");
  toast.textContent = texto;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}

function renderPerfil(key) {
  perfilActualKey = key;
  const data = PERFILES_DEMO[key];

  const card3d = document.getElementById("nfcCard3d");
  card3d.classList.toggle("creative-theme", data.temaCreativo);

  document.getElementById("cardBrandTag").textContent = data.marca;
  document.getElementById("cardSerial").textContent = data.serial;
  document.getElementById("cardHolderName").textContent = data.nombre;
  document.getElementById("cardHolderRole").textContent = data.cargoCard;

  document.getElementById("avatarInitials").textContent = data.iniciales;
  document.getElementById("profileCategoryTag").textContent = data.categoriaTag;
  document.getElementById("profileName").textContent = data.nombre;
  document.getElementById("profileRole").textContent = data.rolCompleto;
  document.getElementById("profileBio").textContent = data.bio;
  document.getElementById("qrUrlText").textContent = data.slug;

  document.getElementById("quickLinksGrid").innerHTML = data.accesos
    .map(
      (acc) => `
      <a href="${acc.href}" target="_blank" rel="noopener" class="q-link-tile">
        <span class="q-icon">${acc.icono}</span>
        <div>
          <strong>${acc.titulo}</strong>
          <small>${acc.sub}</small>
        </div>
      </a>
    `
    )
    .join("");

  document.getElementById("portfolioEyebrow").textContent = data.portfolioEyebrow;
  document.getElementById("portfolioTitle").textContent = data.portfolioTitulo;

  document.getElementById("projectsGrid").innerHTML = data.proyectos
    .map(
      (proj, idx) => `
      <article class="proj-card" data-proj="${idx}">
        <div class="proj-top">
          <span class="proj-emoji">${proj.emoji}</span>
          <span class="proj-badge">${proj.badge}</span>
        </div>
        <h4>${proj.titulo}</h4>
        <p>${proj.resumen}</p>
      </article>
    `
    )
    .join("");
}

// Switcher de perfiles
document.getElementById("profileSwitcher").addEventListener("click", (e) => {
  const btn = e.target.closest(".prof-btn");
  if (!btn) return;
  document.querySelectorAll(".prof-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderPerfil(btn.dataset.profile);
});

// Efecto 3D interactivo sobre la tarjeta física NFC
const nfcCard3d = document.getElementById("nfcCard3d");
const cardGlare = document.getElementById("cardGlare");

function aplicarInclinacion3D(clientX, clientY) {
  const rect = nfcCard3d.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const rotateY = ((x / rect.width) - 0.5) * 18;
  const rotateX = ((y / rect.height) - 0.5) * -18;

  nfcCard3d.style.transform = `rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg)`;
  cardGlare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,255,255,0.24), transparent 60%)`;
}

nfcCard3d.addEventListener("mousemove", (e) => aplicarInclinacion3D(e.clientX, e.clientY));
nfcCard3d.addEventListener("touchmove", (e) => {
  if (e.touches[0]) aplicarInclinacion3D(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

nfcCard3d.addEventListener("mouseleave", () => {
  nfcCard3d.style.transform = "rotateX(0deg) rotateY(0deg)";
});
nfcCard3d.addEventListener("touchend", () => {
  nfcCard3d.style.transform = "rotateX(0deg) rotateY(0deg)";
});

// Simular toque NFC
document.getElementById("simTapBtn").addEventListener("click", () => {
  nfcCard3d.classList.remove("tap-pulse");
  void nfcCard3d.offsetWidth;
  nfcCard3d.classList.add("tap-pulse");
  mostrarToast("📡 Chip NFC leído en 0.2s — Perfil cargado ✓");
});

// Descargar archivo vCard (.vcf) real para agendar en el celular
document.getElementById("saveVcardBtn").addEventListener("click", () => {
  const d = PERFILES_DEMO[perfilActualKey];
  const vcardContenido = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${d.apellido};${d.nombrePila};;;`,
    `FN:${d.nombre}`,
    `ORG:${d.empresa}`,
    `TITLE:${d.cargoCard}`,
    `TEL;TYPE=CELL,VOICE:${d.telefono}`,
    `EMAIL;TYPE=PREF,INTERNET:${d.email}`,
    `URL:${d.web}`,
    "END:VCARD"
  ].join("\r\n");

  const blob = new Blob([vcardContenido], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${d.nombre.replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  mostrarToast(`📥 Contacto de ${d.nombre} listo para guardar en tu agenda ✓`);
});

// Abrir modal de proyecto del portfolio
const projectModal = document.getElementById("projectModal");
document.getElementById("projectsGrid").addEventListener("click", (e) => {
  const card = e.target.closest(".proj-card");
  if (!card) return;
  const proj = PERFILES_DEMO[perfilActualKey].proyectos[Number(card.dataset.proj)];

  document.getElementById("mProjTag").textContent = proj.badge;
  document.getElementById("mProjEmoji").textContent = proj.emoji;
  document.getElementById("mProjTitle").textContent = proj.titulo;
  document.getElementById("mProjDesc").textContent = proj.detalle;
  document.getElementById("mProjSpecs").innerHTML = proj.specs
    .map((s) => `<span class="spec-chip">${s}</span>`)
    .join("");

  projectModal.classList.add("open");
});

document.getElementById("closeProjectModal").addEventListener("click", () => {
  projectModal.classList.remove("open");
});

// Modal QR
const qrModal = document.getElementById("qrModal");
document.getElementById("openQrBtn").addEventListener("click", () => qrModal.classList.add("open"));
document.getElementById("closeQrModal").addEventListener("click", () => qrModal.classList.remove("open"));

// Inicializar
renderPerfil("ejecutivo");