(function () {
  "use strict";

  try {
  runApp();
  } catch (err) {
    const box = document.getElementById("boot-error");
    if (box) {
      box.hidden = false;
      box.innerHTML =
        "<h2>Error al cargar Guate Xiter IA</h2>" +
        "<p>" + String(err.message) + "</p>" +
        "<p>Prueba: doble clic en <strong>INICIAR.bat</strong> o ejecuta <code>npm start</code></p>";
    }
    console.error(err);
  }

  function runApp() {
  const cfg = GUATE_XITER_CONFIG;
  let ffIndex = 0;

  // --- Tabs ---
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const panelId = tab.dataset.panel;
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p) => {
        p.classList.remove("active");
        p.hidden = true;
      });
      tab.classList.add("active");
      const panel = document.getElementById("panel-" + panelId);
      panel.classList.add("active");
      panel.hidden = false;
    });
  });

  // --- Sidebar + big cards (enlaces siempre visibles) ---
  function renderAllDownloadCards() {
    const sidebar = document.getElementById("sidebar-links");
    const ffCards = document.getElementById("ff-cards");
    const emuCards = document.getElementById("emu-cards");

    const allLinks = [
      ...cfg.descargas.freeFire.map((f) => ({ ...f, type: "ff" })),
      ...cfg.descargas.emuladores.map((e) => ({ ...e, type: "emu", icon: e.icon })),
    ];

    allLinks.forEach((item) => {
      const a = createBigLinkCard(item.label, item.url, item.icon, item.type === "emu");
      sidebar.appendChild(createSidebarLink(item.label, item.url, item.icon));
      if (item.type === "ff") ffCards.appendChild(a);
      else emuCards.appendChild(a.cloneNode(true));
    });
  }

  function createSidebarLink(label, url, icon) {
    const a = document.createElement("a");
    a.className = "sidebar-link";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = `<span class="ico">${icon}</span><span>${label}</span><span class="arrow">↗</span>`;
    return a;
  }

  function createBigLinkCard(label, url, icon, isEmu) {
    const a = document.createElement("a");
    a.className = "big-link-card" + (isEmu ? " emu" : "");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = `<span class="bl-icon">${icon}</span><span class="bl-label">${label}</span><span class="bl-go">DESCARGAR ↗</span>`;
    return a;
  }

  renderAllDownloadCards();

  // --- Empresa sidebar text ---
  document.getElementById("empresa-desc").textContent = cfg.empresa.descripcion;
  const servList = document.getElementById("empresa-servicios");
  cfg.empresa.servicios.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    servList.appendChild(li);
  });

  document.getElementById("estudios-intro").textContent = cfg.estudios.intro;
  const matList = document.getElementById("estudios-materias");
  if (matList && cfg.estudios.materias) {
    cfg.estudios.materias.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m;
      matList.appendChild(li);
    });
  }
  const tipsList = document.getElementById("estudios-tips");
  cfg.estudios.tips.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    tipsList.appendChild(li);
  });

  // --- FF rotator ---
  function updateFfDisplay() {
    const list = cfg.descargas.freeFire;
    const item = list[ffIndex];
    document.getElementById("ff-icon").textContent = item.icon;
    document.getElementById("ff-label").textContent = item.label;
    document.getElementById("ff-counter").textContent = `${ffIndex + 1} / ${list.length}`;
    const btn = document.getElementById("btn-ff-download");
    btn.href = item.url;
  }

  function nextFf() {
    ffIndex = (ffIndex + 1) % cfg.descargas.freeFire.length;
    updateFfDisplay();
    return cfg.descargas.freeFire[ffIndex];
  }

  document.getElementById("btn-ff-rotate").addEventListener("click", () => {
    const item = nextFf();
    appendMessage("chat-descargas", "bot", {
      text: `↻ Cambiado a **${item.label}**`,
      links: [{ label: item.label, url: item.url, icon: item.icon }],
    });
  });

  updateFfDisplay();

  // --- Gallery ---
  const gallery = document.getElementById("config-gallery");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");

  cfg.descargas.imagenesConfig.forEach((img) => {
    const btn = document.createElement("button");
    btn.type = "button";
    const el = document.createElement("img");
    el.src = img.url;
    el.alt = img.titulo;
    el.loading = "lazy";
    btn.appendChild(el);
    btn.addEventListener("click", () => {
      lightboxImg.src = img.url;
      lightboxCaption.textContent = img.titulo;
      lightbox.showModal();
    });
    gallery.appendChild(btn);
  });

  document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.close();
  });

  // --- Mensajes con botones de link reales ---
  function now() {
    return new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });
  }

  function formatText(text) {
    return String(text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, "<br>");
  }

  function buildLinkCards(links) {
    if (!links || !links.length) return "";
    let html = '<div class="link-cards">';
    links.forEach((l) => {
      let cls = " link-btn";
      if (l.blue) cls += " blue";
      if (l.gold) cls += " gold";
      html += `<a class="${cls.trim()}" href="${escapeAttr(l.url)}" target="_blank" rel="noopener noreferrer">`;
      html += `<span class="lb-icon">${l.icon || "⬇"}</span>`;
      html += `<span class="lb-text">${escapeHtml(l.label)}</span>`;
      html += `<span class="lb-arrow">↗</span></a>`;
      html += `<div class="url-copy">${escapeHtml(l.url)}</div>`;
    });
    html += '<p class="copy-hint">↑ Clic en el botón naranja/azul o copia el link</p></div>';
    return html;
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function appendMessage(containerId, role, content, extraClass = "") {
    const box = document.getElementById(containerId);
    const div = document.createElement("div");
    div.className = `msg ${role} ${extraClass}`.trim();

    const payload = typeof content === "string" ? { text: content, links: [] } : content;
    let html = formatText(payload.text) + buildLinkCards(payload.links);
    if (payload.image) {
      html +=
        `<div class="study-image-wrap">` +
        `<img src="${payload.image}" alt="Imagen de estudio" class="study-generated-img" />` +
        `<a href="${payload.image}" download="tutor-gx-estudio.png" class="study-dl-btn">⬇ Descargar imagen</a>` +
        `</div>`;
    }
    div.innerHTML = html + `<span class="time">${now()}</span>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function fillTemplate(str) {
    const c = cfg.empresa.contacto;
    const pay = cfg.empresa.pagos;
    return str
      .replace(/\{tienda\}/g, cfg.empresa.tiendaUrl)
      .replace(/\{paypal\}/g, pay.paypalMe)
      .replace(/\{whatsapp\}/g, c.whatsapp)
      .replace(/\{horario\}/g, c.horario)
      .replace(/\{discord\}/g, c.discordLink)
      .replace(/\{tiktok\}/g, c.tiktokLink)
      .replace(/\{youtube\}/g, c.youtubeLink);
  }

  function paypalLink() {
    return {
      label: "💳 Pagar con PayPal — xDavid",
      url: cfg.empresa.pagos.paypalMe,
      icon: "💳",
      gold: true,
    };
  }

  function storeLinks() {
    const t = cfg.empresa;
    return [
      paypalLink(),
      {
        label: "🛒 Tienda GUATE XITER PRO",
        url: t.tiendaUrl,
        icon: "🛒",
        gold: true,
      },
      {
        label: "📱 WhatsApp Developer xDavid",
        url: t.contacto.whatsappLink,
        icon: "📱",
      },
    ];
  }

  function socialLinks() {
    const c = cfg.empresa.contacto;
    return [
      {
        label: "📱 WhatsApp xDavid",
        url: c.whatsappLink,
        icon: "📱",
        gold: true,
      },
      {
        label: "🎵 TikTok",
        url: c.tiktokLink,
        icon: "🎵",
      },
      {
        label: "🟣 Discord",
        url: c.discordLink,
        icon: "🟣",
      },
      {
        label: "▶️ YouTube",
        url: c.youtubeLink,
        icon: "▶️",
      },
    ];
  }

  function vendorLinks(vendedores) {
    return vendedores.map((v) => ({
      label: `📱 ${v.nombre} — ${v.telefono}`,
      url: v.whatsappLink,
      icon: "✅",
    }));
  }

  function fmtQ(n) {
    return `Q${Number(n).toFixed(2)}`;
  }

  function textPrecios() {
    const e = cfg.empresa;
    let t = "💰 **Precios oficiales** — [Tienda Guate Xiter](https://guate-xiter-store.vercel.app/)\n\n";

    if (e.panelTiempo) {
      t += "**🎮 Panel por tiempo:**\n";
      e.panelTiempo.forEach((p) => {
        t += `• **${p.nombre}** — **${fmtQ(p.precio)}**\n`;
        if (p.desc) t += `  _${p.desc}_\n`;
      });
      t += "\n";
    }

    if (e.bypassTiempo) {
      t += "**🛡 Bypass VIP:**\n";
      e.bypassTiempo.forEach((p) => {
        t += `• **${p.nombre}** — **${fmtQ(p.precio)}**\n`;
      });
      t += "\n";
    }

    t += `\n💳 PayPal: **${e.pagos.paypalMe}**`;
    return t;
  }

  function textPagos() {
    const p = cfg.empresa.pagos;
    let t = `💳 **Método de pago principal — xDavid**\n\n`;
    t += `🔗 **${p.paypalMe}**\n`;
    t += `Usuario PayPal.Me: **${p.paypalUsuario}**\n\n`;
    t += "**También disponible:**\n";
    p.metodos.slice(1).forEach((m) => {
      t += `• ${m}\n`;
    });
    t += "\n**Pasos:**\n";
    p.comoFunciona.forEach((c, i) => {
      t += `${i + 1}. ${c}\n`;
    });
    return t;
  }

  function textVendedores(filtroNombre) {
    const lista = cfg.empresa.vendedores;
    const filtrados = filtroNombre
      ? lista.filter((v) => normalize(v.nombre).includes(normalize(filtroNombre)))
      : lista;

    if (filtroNombre && filtrados.length === 0) {
      return {
        text: `No encontré vendedor «${filtroNombre}». Oficiales: SAMU, SIKI, LALO, SEBAS.`,
        links: vendorLinks(lista),
      };
    }

    let t = "🔥 **Vendedores autorizados** (números de la tienda web):\n\n";
    filtrados.forEach((v) => {
      t += `**${v.nombre}** ✅ ${v.rol}\n`;
      t += `${v.descripcion}\n`;
      t += `⭐ ${v.ventas} ventas\n`;
      t += `📱 **${v.telefono}**\n\n`;
    });
    return {
      text: t + "👇 Clic para abrir WhatsApp de cada vendedor:",
      links: vendorLinks(filtrados),
    };
  }

  function normalize(s) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function matchFaq(text, faqList) {
    const n = normalize(text);
    for (const item of faqList) {
      if (item.keys.some((k) => n.includes(normalize(k)))) {
        return fillTemplate(item.respuesta);
      }
    }
    return null;
  }

  // --- Helpers de links ---
  function allFfLinks() {
    return cfg.descargas.freeFire.map((f) => ({
      label: f.label,
      url: f.url,
      icon: f.icon,
    }));
  }

  function allEmuLinks() {
    return cfg.descargas.emuladores.map((e) => ({
      label: e.label,
      url: e.url,
      icon: e.icon,
      blue: true,
    }));
  }

  function allLinks() {
    return [...allFfLinks(), ...allEmuLinks()];
  }

  function wantsLinks(n) {
    return (
      n.includes("link") ||
      n.includes("enlace") ||
      n.includes("descargar") ||
      n.includes("descarga") ||
      n.includes("mediafire") ||
      n.includes("url") ||
      n.includes("dame") ||
      n.includes("pasa") ||
      n.includes("manda") ||
      n.includes("todos")
    );
  }

  function wantsFf(n) {
    return (
      n.includes("free fire") ||
      n.includes("freefire") ||
      n === "ff" ||
      n.includes(" xapk") ||
      n.includes("xapk") ||
      (n.includes("ff") && !n.includes("config"))
    );
  }

  function wantsEmu(n) {
    return n.includes("emulador") || n.includes("bluestacks") || n.includes("blue") || n.includes("msi");
  }

  function replyEmpresa(text) {
    const n = normalize(text);

    if (
      n.includes("precio") ||
      n.includes("precios") ||
      n.includes("cuanto cuesta") ||
      n.includes("costo") ||
      n.includes("plan") ||
      n.includes("suscripcion") ||
      n.includes("licencia")
    ) {
      return { text: textPrecios(), links: storeLinks() };
    }

    if (
      n.includes("pago") ||
      n.includes("paypal") ||
      n.includes("saldo") ||
      n.includes("recargar") ||
      n.includes("comprar") ||
      n.includes("tarjeta")
    ) {
      return { text: textPagos(), links: [paypalLink(), ...storeLinks().slice(1)] };
    }

    if (n.includes("redes") || n.includes("social") || n.includes("tiktok") || n.includes("discord") || n.includes("youtube") || n.includes("whatsapp")) {
      return {
        text:
          "🔗 **Redes sociales y contacto directo de Guate Xiter:**\n\n" +
          "Aquí tienes los enlaces oficiales para WhatsApp, TikTok, Discord y YouTube.",
        links: socialLinks(),
      };
    }

    if (n.includes("vendedor") || n.includes("distribuidor") || n.includes("samu") || n.includes("siki") || n.includes("lalo") || n.includes("sebas")) {
      const nombre = ["samu", "siki", "lalo", "sebas"].find((x) => n.includes(x));
      return textVendedores(nombre);
    }

    if (
      n.includes("tienda") ||
      n.includes("pagina web") ||
      n.includes("sitio") ||
      n.includes("vercel") ||
      n.includes("panel pro") ||
      n.includes("producto") ||
      n.includes("catalogo")
    ) {
      return {
        text:
          "🛒 **Tienda oficial GUATE XITER PRO**\n\n" +
          "Ahí encuentras: productos, planes, PayPal, saldo, vendedores y centro de descargas.\n\n" +
          "👇 Abre la tienda:",
        links: storeLinks(),
      };
    }

    if (n.includes("bypass") || n.includes("panel") || n.includes("anticheat")) {
      return {
        text:
          textPrecios() +
          "\n\n🛡 **Bypass + Panel** en la tienda. Emuladores recomendados: BlueStacks 5, LDPlayer, Nox.",
        links: [...storeLinks(), ...allEmuLinks().slice(0, 1)],
      };
    }

    if (n.includes("siguiente") && n.includes("ff")) {
      const item = nextFf();
      return {
        text: `Aquí va el siguiente Free Fire:`,
        links: [{ label: item.label, url: item.url, icon: item.icon }],
      };
    }

    if (n.includes("busca") || n.includes("buscas") || n.includes("buscar") || n.includes("de que es") || n.includes("que es") || n.includes("de que va")) {
      return { text: respuestaInformacion(text), links: socialLinks() };
    }

    if (wantsLinks(n) || n.includes("todo")) {
      return {
        text: "📥 **Todos tus enlaces MediaFire** — clic en cada botón:",
        links: allLinks(),
      };
    }

    if (n.includes("max") && (wantsFf(n) || n.includes("fire"))) {
      const x = cfg.descargas.freeFire.find((f) => f.id === "max");
      return {
        text: "⚡ **Free Fire Max - New**",
        links: [{ label: x.label, url: x.url, icon: x.icon }],
      };
    }

    if ((n.includes("normal") || n.includes("clasico")) && wantsFf(n)) {
      const x = cfg.descargas.freeFire.find((f) => f.id === "normal");
      return {
        text: "🔥 **Free Fire Normal - New**",
        links: [{ label: x.label, url: x.url, icon: x.icon }],
      };
    }

    if (n.includes("x86") || n.includes("tela")) {
      const x = cfg.descargas.freeFire.find((f) => f.id === "x86");
      return {
        text: "📱 **Free Fire X86 Tela**",
        links: [{ label: x.label, url: x.url, icon: x.icon }],
      };
    }

    if (wantsFf(n)) {
      return {
        text: "🔥 **Free Fire** — elige versión (clic para descargar):",
        links: allFfLinks(),
      };
    }

    if (n.includes("bluestacks") || n.includes("blue stack")) {
      const e = cfg.descargas.emuladores[0];
      return {
        text: "🟦 **BlueStacks 5**",
        links: [{ label: e.label, url: e.url, icon: e.icon, blue: true }],
      };
    }

    if (n.includes("msi")) {
      const e = cfg.descargas.emuladores[1];
      return {
        text: "🟥 **MSI App Player**",
        links: [{ label: e.label, url: e.url, icon: e.icon, blue: true }],
      };
    }

    if (wantsEmu(n)) {
      return {
        text: "🖥️ **Emuladores** — enlaces directos:",
        links: allEmuLinks(),
      };
    }

    if (n.includes("config") || n.includes("imagen")) {
      return {
        text: `⚙️ Ve a la pestaña **Descargas** — hay **${cfg.descargas.imagenesConfig.length}** imágenes de configuración. También están a la derecha en la galería.`,
        links: [],
      };
    }

    const faq = matchFaq(text, cfg.empresa.faq);

    if (faq) {
      let links = [];
      if (n.includes("free fire") || (n.includes("ff") && !n.includes("pro")) || n.includes("emulador") || n.includes("descargar")) {
        links = wantsFf(n) ? allFfLinks() : wantsEmu(n) ? allEmuLinks() : allLinks();
      } else if (n.includes("pago") || n.includes("paypal")) {
        links = [paypalLink()];
      } else if (n.includes("vendedor")) {
        links = vendorLinks(cfg.empresa.vendedores);
      } else if (n.includes("contacto") || n.includes("whatsapp") || n.includes("licencia") || n.includes("pro")) {
        links = storeLinks();
      }
      return {
        text: fillTemplate(faq) + (links.length ? "\n\n👇 **Enlaces:**" : ""),
        links,
      };
    }

    if (n.includes("servicio") || n.includes("que ofrecen")) {
      return {
        text:
          "**Servicios de Guate Xiter:**\n" +
          cfg.empresa.servicios.map((s) => "• " + s).join("\n") +
          "\n\n¿Quieres links? Escribe: **dame los links**",
        links: [],
      };
    }

    return {
      text:
        `Pregúntame:\n` +
        `• **precios** · **paypal** · **vendedores**\n` +
        `• **tienda** · **contacto** · **dame los links**\n` +
        `• **free fire** · **bluestacks** · **bypass**`,
      links: storeLinks(),
    };
  }

  function esSolicitudInformacion(text) {
    const n = normalize(text);
    return /\b(info|inf|información|informacion|qué es|que es|quién|quien|cómo|como|por qué|porque|dame|explícame|explica|definición|definicion|significa|significa|busca|buscas|buscar|cualquier cosa|de que es|de que va)\b/.test(n);
  }

  function respuestaInformacion(tema) {
    tema = tema.trim() || "este tema";
    return (
      `**Información clara sobre ${tema}:**\n\n` +
      `• **Qué es:** ${tema} es un concepto que se puede entender con ejemplos claros.\n` +
      `• **Para qué sirve:** sirve para comprender mejor el tema y aplicarlo en situaciones prácticas.\n` +
      `• **Ejemplo:** imagina un caso sencillo usando ${tema}.\n` +
      `• **Consejo:** repasa con una pregunta clave o crea una ficha rápida para recordar.`
    );
  }

  function replyEstudios(text) {
    const n = normalize(text);

    if (typeof quiereImagen === "function" && quiereImagen(text)) {
      const tema = extraerTemaImagen(text);
      const tipo = detectarTipoImagen(text);
      const img = generarImagenEstudio(tema, tipo);
      return {
        text: `🎨 **Imagen de estudio** generada sobre: **${tema}**\nTipo: ${tipo}. Puedes descargarla abajo.`,
        links: [],
        image: img,
      };
    }

    if (n.includes("hola") || n.includes("ayuda")) {
      return {
        text:
          `¡Hola! Soy **${cfg.estudios.nombreAsistente}** 📚\n` +
          `Te ayudo con tareas, repaso y **imágenes** de estudio.\n\n` +
          `Prueba: «genera imagen del sistema solar» o «mapa mental de verbos»`,
        links: [],
      };
    }

    if (esSolicitudInformacion(text)) {
      const tema = text.replace(/.*(?:sobre|de|del|la|el)\s*/i, "").trim() || text;
      return { text: respuestaInformacion(tema), links: [] };
    }

    if (n.startsWith("explicame") || n.startsWith("explica")) {
      const tema = text.replace(/^explic[aá]me\s*/i, "").trim() || "ese tema";
      const img = generarImagenEstudio(tema, "esquema");
      return {
        text: explicacionEstudio(tema) + "\n\n🎨 También te generé una ficha visual:",
        links: [],
        image: img,
      };
    }

    if (n.includes("repaso") || n.includes("preguntas")) {
      const tema = text.replace(/.*(sobre|de)\s*/i, "").trim() || "el tema";
      return { text: preguntasRepaso(tema), links: [] };
    }

    if (n.includes("esquema") || n.includes("resumen") || n.includes("tarea")) {
      const tema = text.replace(/.*(sobre|de|tarea)\s*/i, "").trim() || text;
      const img = generarImagenEstudio(tema, "esquema");
      return {
        text:
          `**Esquema — ${tema}:**\n` +
          `1. Título\n2. Introducción\n3. Desarrollo (3 ideas)\n4. Ejemplo\n5. Conclusión\n\n` +
          `🎨 Imagen lista para imprimir o guardar:`,
        links: [],
        image: img,
      };
    }

    if (n.includes("matematica") || n.includes("fraccion") || n.includes("algebra")) {
      const img = generarImagenEstudio(text, "formula");
      return {
        text:
          `**Matemáticas — tips:**\n` +
          `• Fracciones: mismo denominador → sumas numeradores\n` +
          `• Ecuaciones: lo que sumas a un lado, restas al otro\n` +
          `• Practica con 3 ejercicios hoy\n\n` +
          `🎨 Ficha visual:`,
        links: [],
        image: img,
      };
    }

    return { text: respuestaInformacion(text), links: [] };
  }

  function explicacionEstudio(tema) {
    return (
      `**${tema}** — explicación simple:\n\n` +
      `1. **Qué es:** idea central.\n` +
      `2. **Para qué sirve:** en clase y vida real.\n` +
      `3. **Ejemplo:** algo de Guatemala.\n` +
      `4. **Tip:** 3 palabras clave y repasa mañana.`
    );
  }

  function preguntasRepaso(tema) {
    return (
      `**5 preguntas — ${tema}:**\n` +
      `1. ¿Definición en una frase?\n` +
      `2. ¿Idea más importante?\n` +
      `3. ¿Un ejemplo tuyo?\n` +
      `4. ¿Error común?\n` +
      `5. ¿Cómo se lo explicarías a un amigo?`
    );
  }

  function replyDescargas(text) {
    const n = normalize(text);
    const ff = cfg.descargas.freeFire;

    if (wantsLinks(n) || n.includes("todo")) {
      return {
        text: "📥 **Pack completo Guate Xiter:**",
        links: allLinks(),
      };
    }

    if (n.includes("siguiente") || (n.includes("rotar") && n.includes("ff")) || n === "ff") {
      const item = nextFf();
      return {
        text: `↻ **${item.label}**`,
        links: [{ label: "⬇ " + item.label, url: item.url, icon: item.icon }],
      };
    }

    if (n.includes("normal")) {
      const x = ff.find((f) => f.id === "normal");
      return { text: "🔥 Normal:", links: [{ label: x.label, url: x.url, icon: x.icon }] };
    }
    if (n.includes("max")) {
      const x = ff.find((f) => f.id === "max");
      return { text: "⚡ Max:", links: [{ label: x.label, url: x.url, icon: x.icon }] };
    }
    if (n.includes("x86") || n.includes("tela")) {
      const x = ff.find((f) => f.id === "x86");
      return { text: "📱 X86 Tela:", links: [{ label: x.label, url: x.url, icon: x.icon }] };
    }
    if (wantsFf(n)) {
      return { text: "🔥 **Free Fire** (3 versiones):", links: allFfLinks() };
    }
    if (n.includes("bluestacks") || n.includes("blue")) {
      const e = cfg.descargas.emuladores[0];
      return { text: "🟦 BlueStacks:", links: [{ label: e.label, url: e.url, icon: e.icon, blue: true }] };
    }
    if (n.includes("msi")) {
      const e = cfg.descargas.emuladores[1];
      return { text: "🟥 MSI:", links: [{ label: e.label, url: e.url, icon: e.icon, blue: true }] };
    }
    if (wantsEmu(n)) {
      return { text: "🖥️ Emuladores:", links: allEmuLinks() };
    }
    if (n.includes("config") || n.includes("imagen")) {
      return {
        text: `⚙️ **${cfg.descargas.imagenesConfig.length} imágenes** arriba en la galería — tócalas para ampliar.`,
        links: [],
      };
    }

    return {
      text: "Escribe: **links** · **ff** · **ff max** · **bluestacks** · **msi** · **config**",
      links: allLinks(),
    };
  }

  function setupChat(formId, inputId, chatId, replier, extraClass = "") {
    const form = document.getElementById(formId);
    const input = document.getElementById(inputId);

    function sendMessage(text) {
      if (!text.trim()) return;
      appendMessage(chatId, "user", text);
      input.value = "";
      setTimeout(() => {
        appendMessage(chatId, "bot", replier(text), extraClass);
      }, 320);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      sendMessage(input.value.trim());
    });

    return sendMessage;
  }

  const sendEmpresa = setupChat("form-empresa", "input-empresa", "chat-empresa", replyEmpresa);
  const sendEstudios = setupChat("form-estudios", "input-estudios", "chat-estudios", replyEstudios, "estudios-bot");
  const sendDescargas = setupChat("form-descargas", "input-descargas", "chat-descargas", replyDescargas);

  function bindQuick(containerId, phrases, sendFn) {
    const container = document.getElementById(containerId);
    phrases.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = p;
      b.addEventListener("click", () => sendFn(p));
      container.appendChild(b);
    });
  }

  bindQuick("quick-empresa", [
    "Precios",
    "PayPal xDavid",
    "Vendedores",
    "Tienda oficial",
    "Redes sociales",
    "Dame todos los links",
    "Contacto",
  ], sendEmpresa);

  bindQuick("quick-estudios", [
    "Explícame las fracciones",
    "Genera imagen del ciclo del agua",
    "Mapa mental de verbos",
    "Repaso sobre historia de Guatemala",
  ], sendEstudios);

  bindQuick("quick-descargas", [
    "Dame todos los links",
    "Free Fire Max",
    "BlueStacks",
    "MSI",
    "Siguiente ff",
  ], sendDescargas);

  const tiendaBtn = document.getElementById("btn-tienda-sidebar");
  if (tiendaBtn) tiendaBtn.href = cfg.empresa.tiendaUrl;
  const paypalBtn = document.getElementById("btn-paypal-sidebar");
  if (paypalBtn && cfg.empresa.pagos) paypalBtn.href = cfg.empresa.pagos.paypalMe;

  if (cfg.branding) {
    const gif = cfg.branding.logoGif;
    const logoImg = document.getElementById("brand-logo-gif");
    if (logoImg && gif) logoImg.src = gif;
    let fav = document.querySelector('link[rel="icon"]');
    if (!fav) {
      fav = document.createElement("link");
      fav.rel = "icon";
      document.head.appendChild(fav);
    }
    if (gif) {
      fav.href = cfg.branding.favicon || gif;
      fav.type = "image/gif";
    }
  }

  appendMessage("chat-empresa", "bot", {
    text:
      `¡Bienvenido a **${cfg.empresa.nombre} IA**! 🇬🇹\n${cfg.empresa.slogan}\n\n` +
      `Pregunta **precios**, **PayPal**, **vendedores** o pide **links** de descarga.\n` +
      `Tienda: ${cfg.empresa.tiendaUrl}`,
    links: [...storeLinks(), ...allFfLinks().slice(0, 1)],
  });

  appendMessage("chat-estudios", "bot", {
    text:
      `Hola, soy **${cfg.estudios.nombreAsistente}** 📚\n` +
      `Solo temas de **escuela**: explicaciones, repaso e **imágenes**.\n` +
      `Prueba: «genera imagen de [tema]»`,
    links: [],
  }, "estudios-bot");

  appendMessage("chat-descargas", "bot", {
    text: "Centro de descargas listo. **Clic abajo** o escribe «links»:",
    links: allFfLinks(),
  });
  }
})();
