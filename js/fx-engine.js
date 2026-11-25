(function () {
  const isMobile = window.innerWidth < 768;

  /* =========================================================
     1. CANVAS 3D ESPACIAL (PARTÍCULAS + RED + PERSPECTIVA)
     ========================================================= */
  const canvas = document.getElementById("spatialCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const pointer = { x: width * 0.5, y: height * 0.35, active: false };
    window.addEventListener("pointermove", (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    }, { passive: true });

    const particleCount = isMobile ? 36 : 72;
    const maxDist = isMobile ? 115 : 155;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        cyan: Math.random() > 0.45
      });
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      if (pointer.active) {
        const grad = ctx.createRadialGradient(pointer.x, pointer.y, 10, pointer.x, pointer.y, 260);
        grad.addColorStop(0, "rgba(22, 177, 255, 0.08)");
        grad.addColorStop(1, "rgba(5, 7, 11, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180 && dist > 1) {
            p.x += (dx / dist) * 0.22;
            p.y += (dy / dist) * 0.22;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
        ctx.fillStyle = p.cyan ? "rgba(22, 177, 255, 0.7)" : "rgba(20, 100, 246, 0.75)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(22, 177, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  /* =========================================================
     2. TARJETAS 3D TILT + REFLEJO SPECULAR (PC Y CELULAR)
     ========================================================= */
  window.initTiltCards = function () {
    const cards = document.querySelectorAll(".tilt-card");
    cards.forEach((card) => {
      if (card.dataset.tiltBound === "true") return;
      card.dataset.tiltBound = "true";

      const maxTilt = isMobile ? 6 : 9;

      function handleMove(clientX, clientY) {
        const rect = card.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      }

      function resetTilt() {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      }

      card.addEventListener("pointermove", (e) => {
        handleMove(e.clientX, e.clientY);
      });

      card.addEventListener("pointerleave", resetTilt);
      card.addEventListener("pointercancel", resetTilt);
    });
  };

  /* =========================================================
     3. BOTONES MAGNÉTICOS (DESKTOP)
     ========================================================= */
  if (!isMobile) {
    document.querySelectorAll(".magnetic-btn").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const rect = btn.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left - rect.width / 2) * 0.22;
        const offsetY = (e.clientY - rect.top - rect.height / 2) * 0.22;
        btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "translate(0px, 0px)";
      });
    });
  }

  /* =========================================================
     4. ESCENARIO HOLOGRÁFICO INTERACTIVO EN EL HERO
     ========================================================= */
  const stageData = {
    invitaciones: {
      badge: "EVENTOS VIP • RSVP + QR",
      title: "Invitación Web Interactiva",
      metric: "Cuenta regresiva + GPS + Música",
      uiPreview: `
        <div class="holo-ui-box">
          <div class="holo-ui-row"><span>Cuenta Regresiva</span><strong>14d : 08h : 32m</strong></div>
          <div class="holo-ui-row"><span>Ubicación Salón</span><strong class="cyan">Abrir Maps ↗</strong></div>
          <div class="holo-ui-row"><span>Pase Digital</span><strong class="green">Confirmado ✓</strong></div>
        </div>
      `,
      link: "https://umbral.umbralinvitaciones.workers.dev/",
      linkLabel: "Probar Invitación Real"
    },
    catalogos: {
      badge: "VENTAS DIRECTAS SIN COMISIÓN",
      title: "Catálogos, Menús & PDFs",
      metric: "Pedidos y presupuestos en segundos",
      uiPreview: `
        <div class="holo-ui-box">
          <div class="holo-ui-row"><span>Carrito / Mesa 04</span><strong>$24.500</strong></div>
          <div class="holo-ui-row"><span>División / Envío</span><strong class="cyan">3 Personas / Delivery</strong></div>
          <div class="holo-ui-row"><span>Cierre de Venta</span><strong class="green">WhatsApp Listo ↗</strong></div>
        </div>
      `,
      link: "#servicios",
      linkLabel: "Ver Soluciones de Venta"
    },
    gestion: {
      badge: "CONTROL OPERATIVO EN LA NUBE",
      title: "Fichaje QR/GPS, Turnos & Taller",
      metric: "Orden total de tu equipo y clientes",
      uiPreview: `
        <div class="holo-ui-box">
          <div class="holo-ui-row"><span>Ingreso Personal</span><strong>08:01 hs (GPS OK)</strong></div>
          <div class="holo-ui-row"><span>Orden Taller #104</span><strong class="cyan">Listo para retirar</strong></div>
          <div class="holo-ui-row"><span>Checklist Apertura</span><strong class="green">6/6 Fotos Subidas ✓</strong></div>
        </div>
      `,
      link: "#servicios",
      linkLabel: "Explorar MicroApps de Gestión"
    },
    automatizacion: {
      badge: "INTELIGENCIA ARTIFICIAL & REPUTACIÓN",
      title: "Bots IA, Cobranzas & Reseñas",
      metric: "Tu negocio trabaja en piloto automático",
      uiPreview: `
        <div class="holo-ui-box">
          <div class="holo-ui-row"><span>Reseña 5 Estrellas</span><strong class="cyan">Enviada a Google Maps ↗</strong></div>
          <div class="holo-ui-row"><span>Aviso Cuota Gimnasio</span><strong>Enviado por WhatsApp</strong></div>
          <div class="holo-ui-row"><span>Resumen 22:00 hs</span><strong class="green">Reporte Entregado ✓</strong></div>
        </div>
      `,
      link: "#servicios",
      linkLabel: "Ver Automatizaciones"
    }
  };

  const stageTabs = document.getElementById("stageTabs");
  const stageDisplay = document.getElementById("stageDisplay");

  function renderStage(key) {
    const item = stageData[key];
    if (!item || !stageDisplay) return;
    stageDisplay.classList.remove("stage-anim");
    void stageDisplay.offsetWidth;
    stageDisplay.innerHTML = `
      <span class="holo-badge">${item.badge}</span>
      <h3>${item.title}</h3>
      <p class="holo-metric">${item.metric}</p>
      ${item.uiPreview}
      <a href="${item.link}" ${item.link.startsWith("http") ? 'target="_blank" rel="noopener"' : ""} class="btn btn-primary btn-sm holo-cta">
        ${item.linkLabel}
      </a>
    `;
    stageDisplay.classList.add("stage-anim");
  }

  if (stageTabs) {
    stageTabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".stage-tab");
      if (!tab) return;
      stageTabs.querySelectorAll(".stage-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderStage(tab.dataset.stage);
    });
    renderStage("invitaciones");
  }

  /* =========================================================
     5. SIMULADOR INTERACTIVO DE SOLUCIONES POR OBJETIVO
     ========================================================= */
  const simConfig = {
    ventas: {
      titulo: "Catálogos WhatsApp, Menús de Mesa & Presupuestos PDF",
      ideal: "Ideal para comercios, bares, gastronomía, fabricantes y vendedores a domicilio.",
      beneficios: [
        "Catálogos con carrito o menú QR por mesa con división de cuenta.",
        "Generador de presupuestos en PDF con cálculos al instante frente al cliente.",
        "Cierre de pedidos directo a tu WhatsApp sin pagar comisiones."
      ],
      mensajeWa: "Hola SEME Studio! Quiero implementar una herramienta para vender y cotizar más rápido en mi negocio."
    },
    operaciones: {
      titulo: "MicroApps de Gestión: Turnos, Taller, Fichaje QR/GPS y Checklists",
      ideal: "Ideal para talleres, peluquerías, canchas, gimnasios, obras y sucursales.",
      beneficios: [
        "Control de asistencia de empleados con validación por QR y ubicación GPS.",
        "Link de seguimiento en vivo para clientes de servicio técnico o talleres.",
        "Agenda de turnos 24/7 y checklists diarios con fotos verificadas."
      ],
      mensajeWa: "Hola SEME Studio! Me interesa una MicroApp de gestión interna para ordenar mi negocio."
    },
    eventos: {
      titulo: "Invitaciones Web VIP, Ruletas de Premios QR & Tarjetas NFC",
      ideal: "Ideal para eventos sociales, ferias, locales físicos y equipos profesionales.",
      beneficios: [
        "Invitaciones interactivas con cuenta regresiva, música, mapa y RSVP.",
        "Ruleta de premios QR para captar contactos y descuentos en locales.",
        "Tarjetas NFC corporativas que guardan tu contacto en un toque."
      ],
      mensajeWa: "Hola SEME Studio! Quiero consultar por Invitaciones Digitales, Ruleta QR o Tarjetas NFC."
    },
    automatizar: {
      titulo: "Bots de WhatsApp con IA, Cobranzas & Filtro de Reseñas Google",
      ideal: "Ideal para negocios que quieren ahorrar horas de atención y mejorar su reputación.",
      beneficios: [
        "Filtro inteligente: clientes felices van a Google Maps; quejas van a tu buzón privado.",
        "Recordatorios automáticos de cuotas y reportes nocturnos de ventas.",
        "Asistente virtual en WhatsApp respondiendo consultas 24/7."
      ],
      mensajeWa: "Hola SEME Studio! Quiero automatizar mensajes, cobranzas o reseñas de Google en mi negocio."
    }
  };

  const simOptions = document.getElementById("simOptions");
  const simResult = document.getElementById("simResult");

  function renderSim(key) {
    const data = simConfig[key];
    if (!data || !simResult) return;
    const waUrl = `https://wa.me/5493794048564?text=${encodeURIComponent(data.mensajeWa)}`;
    simResult.classList.remove("stage-anim");
    void simResult.offsetWidth;
    simResult.innerHTML = `
      <span class="badge-tech">ARQUITECTURA RECOMENDADA</span>
      <h3>${data.titulo}</h3>
      <p class="sim-ideal">${data.ideal}</p>
      <ul class="sim-list">
        ${data.beneficios.map((b) => `<li><span>⚡</span> ${b}</li>`).join("")}
      </ul>
      <div class="sim-cta-row">
        <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp">
          Cotizar esta solución por WhatsApp
        </a>
        <a href="#servicios" class="btn btn-secondary">Ver detalles en el catálogo</a>
      </div>
    `;
    simResult.classList.add("stage-anim");
  }

  if (simOptions) {
    simOptions.addEventListener("click", (e) => {
      const btn = e.target.closest(".sim-pill");
      if (!btn) return;
      simOptions.querySelectorAll(".sim-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderSim(btn.dataset.sim);
    });
    renderSim("ventas");
  }

  /* =========================================================
     6. REVELADO 3D AL HACER SCROLL (INTERSECTION OBSERVER)
     ========================================================= */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal-scroll").forEach((el) => revealObserver.observe(el));

  window.initTiltCards();
})();