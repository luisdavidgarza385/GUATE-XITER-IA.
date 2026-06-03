(function () {
  "use strict";

  try {
    runApp();
  } catch (err) {
    const box = document.getElementById("boot-error");
    if (box) {
      box.hidden = false;
      box.innerHTML = "<h2>Error al cargar Tutor GX</h2><p>" + String(err.message) + "</p>";
    }
    console.error(err);
  }

  function runApp() {
    const cfg = GUATE_XITER_CONFIG;
    let attachedFiles = [];
    let workingModel = null; // Se descubre al primer uso

    window.downloadImage = async function (url, filename) {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename || "imagen.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (e) {
        window.open(url, "_blank");
      }
    };

    // --- Firebase: contador en vivo + estadísticas (sin login) ---
    let db = null;
    let myPresenceRef = null;

    function getVisitorId() {
      let id = localStorage.getItem("gx_visitor_id");
      if (!id) {
        id = "v_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        localStorage.setItem("gx_visitor_id", id);
      }
      return id;
    }

    function focusChatInput() {
      const chatInput = document.getElementById("input-estudios");
      if (!chatInput) return;
      chatInput.disabled = false;
      chatInput.removeAttribute("readonly");
      requestAnimationFrame(() => chatInput.focus());
    }

    function initFirebase() {
      if (typeof firebase === "undefined") return;
      try {
        firebase.initializeApp(cfg.firebase);
        db = firebase.database();
        console.log("[Guate Xiter IA] Firebase conectado.");
      } catch (e) {
        console.error("[Guate Xiter IA] Firebase:", e);
        return;
      }

      const visitorId = getVisitorId();
      const connectedRef = db.ref(".info/connected");
      connectedRef.on("value", (snap) => {
        if (snap.val() !== true) return;
        if (myPresenceRef) myPresenceRef.remove();
        myPresenceRef = db.ref("presence").push();
        myPresenceRef.onDisconnect().remove();
        myPresenceRef.set({
          visitor: visitorId,
          last_active: firebase.database.ServerValue.TIMESTAMP
        });
      });

      // Contador de personas en línea dedupicado por visitante
      db.ref("presence").on("value", (snap) => {
        const val = snap.val() || {};
        const uniqueVisitors = new Set();
        Object.values(val).forEach((p) => {
          if (p && p.visitor) uniqueVisitors.add(p.visitor);
        });
        const count = uniqueVisitors.size || 0;
        const badge = document.getElementById("online-viewers-count");
        if (badge) badge.textContent = count;
      });

      // Contador de visitas únicas (solo incrementa una vez por dispositivo)
      const hasVisited = localStorage.getItem("gx_has_visited");
      if (!hasVisited) {
        db.ref("stats/total_visitors").transaction((current) => (current || 0) + 1);
        localStorage.setItem("gx_has_visited", "true");
      }

      db.ref("stats/total_visitors").on("value", (snap) => {
        const count = snap.val() || 0;
        const badge = document.getElementById("total-visitors-count");
        if (badge) badge.textContent = count;
      });

      db.ref("stats/total_usages").on("value", (snap) => {
        const count = snap.val() || 0;
        const badge = document.getElementById("total-usages-count");
        if (badge) badge.textContent = count;
      });
    }

    function incrementUsageStats() {
      if (db) {
        db.ref("stats/total_usages").transaction((current) => (current || 0) + 1);
      }
    }

    localStorage.removeItem("tutor_gx_user");
    initFirebase();
    initWelcomeSplash();
    initMobileSheet();

    function initWelcomeSplash() {
      const splash = document.getElementById("welcome-splash");
      if (!splash) return;
      const hide = () => {
        splash.classList.add("welcome-splash--hide");
        setTimeout(() => {
          splash.hidden = true;
          splash.setAttribute("aria-hidden", "true");
          focusChatInput();
        }, 600);
      };
      setTimeout(hide, 2600);
      splash.addEventListener("click", hide, { once: true });
    }

    function initMobileSheet() {
      const sheet = document.getElementById("mobile-sheet");
      const openBtn = document.getElementById("btn-mobile-info");
      const closeBtn = document.getElementById("mobile-sheet-close");
      const backdrop = document.getElementById("mobile-sheet-backdrop");
      if (!sheet) return;
      const open = () => { sheet.hidden = false; document.body.classList.add("sheet-open"); };
      const close = () => { sheet.hidden = true; document.body.classList.remove("sheet-open"); };
      if (openBtn) openBtn.addEventListener("click", open);
      if (closeBtn) closeBtn.addEventListener("click", close);
      if (backdrop) backdrop.addEventListener("click", close);
    }

    // --- Poblar sidebar ---
    const introEl = document.getElementById("estudios-intro");
    if (introEl) introEl.textContent = cfg.asistente.intro;

    const matList = document.getElementById("estudios-materias");
    if (matList && cfg.asistente.capacidades) {
      cfg.asistente.capacidades.forEach((m) => {
        const li = document.createElement("li");
        li.textContent = m;
        matList.appendChild(li);
      });
    }

    const nombreEl = document.getElementById("asistente-nombre");
    if (nombreEl) nombreEl.textContent = cfg.asistente.nombre;

    // --- Lightbox ---
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");

    function closeLightbox() {
      if (!lightbox) return;
      if (lightbox.open) lightbox.close();
      if (lightboxImg) {
        lightboxImg.removeAttribute("src");
        lightboxImg.hidden = true;
      }
      if (lightboxCaption) {
        lightboxCaption.textContent = "";
        lightboxCaption.hidden = true;
      }
    }

    if (lightbox) {
      if (lightbox.open) lightbox.close();
      const closeBtn = lightbox.querySelector(".lightbox-close");
      if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
      lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
      lightbox.addEventListener("close", closeLightbox);
      closeLightbox();
    }

    function openLightbox(src, alt) {
      if (!lightbox || !lightboxImg || !src) return;
      lightboxImg.src = src;
      lightboxImg.hidden = false;
      if (lightboxCaption) {
        lightboxCaption.textContent = alt || "";
        lightboxCaption.hidden = !alt;
      }
      lightbox.showModal();
    }

    const chatBox = document.getElementById("chat-estudios");
    if (chatBox) {
      chatBox.addEventListener("click", (e) => {
        if (e.target.tagName === "IMG" && (e.target.classList.contains("msg-attachment-img") || e.target.classList.contains("study-generated-img") || e.target.classList.contains("gemini-gen-img"))) {
          openLightbox(e.target.src, e.target.alt);
        }
      });
    }

    // --- Carga de archivos ---
    const fileInput = document.getElementById("file-input");
    const btnAttach = document.getElementById("btn-attach");
    const previewsContainer = document.getElementById("attachment-previews");
    const dropOverlay = document.getElementById("drop-overlay");
    const messagesArea = dropOverlay ? dropOverlay.parentElement : null;

    if (btnAttach && fileInput) btnAttach.addEventListener("click", () => fileInput.click());
    if (fileInput) fileInput.addEventListener("change", (e) => { handleFiles(e.target.files); fileInput.value = ""; });

    let dragCounter = 0;
    if (messagesArea && dropOverlay) {
      messagesArea.addEventListener("dragenter", (e) => { e.preventDefault(); dragCounter++; dropOverlay.removeAttribute("hidden"); });
      messagesArea.addEventListener("dragover", (e) => e.preventDefault());
      messagesArea.addEventListener("dragleave", (e) => { e.preventDefault(); dragCounter--; if (dragCounter <= 0) { dragCounter = 0; dropOverlay.setAttribute("hidden", ""); } });
      messagesArea.addEventListener("drop", (e) => { e.preventDefault(); dragCounter = 0; dropOverlay.setAttribute("hidden", ""); if (e.dataTransfer && e.dataTransfer.files) handleFiles(e.dataTransfer.files); });
    }

    function handleFiles(filesList) {
      const imgExts = ["png","jpg","jpeg","gif","webp","bmp","svg","ico","tiff","tif","avif"];
      Array.from(filesList).forEach((file) => {
        const ext = file.name.split(".").pop().toLowerCase();
        const isImage = file.type.startsWith("image/") || imgExts.includes(ext);
        const isPdf = file.type === "application/pdf" || ext === "pdf";
        const textExts = ["txt","js","py","html","css","json","csv","md","c","cpp","java","ts","xml","sql","sh","bat","ini","yaml","yml","toml","jsx","tsx","vue","svelte","php","rb","go","rs","swift","kt"];
        const isText = file.type.startsWith("text/") || textExts.includes(ext);

        if (isImage || isPdf) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const mimeType = file.type || (isPdf ? "application/pdf" : "image/" + (ext === "jpg" ? "jpeg" : ext));
            attachedFiles.push({ name: file.name, type: isImage ? "image" : "pdf", mimeType: mimeType, base64: reader.result, size: fmtBytes(file.size) });
            renderPreviews();
          };
        } else {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => {
            attachedFiles.push({ name: file.name, type: "text", mimeType: file.type || "text/plain", content: reader.result, size: fmtBytes(file.size) });
            renderPreviews();
          };
        }
      });
    }

    function renderPreviews() {
      if (!previewsContainer) return;
      previewsContainer.innerHTML = "";
      if (attachedFiles.length === 0) { previewsContainer.setAttribute("hidden", ""); return; }
      previewsContainer.removeAttribute("hidden");
      attachedFiles.forEach((file, i) => {
        const item = document.createElement("div");
        item.className = "preview-item";
        const rm = document.createElement("button");
        rm.type = "button"; rm.className = "btn-remove"; rm.innerHTML = "✕";
        rm.addEventListener("click", () => { attachedFiles.splice(i, 1); renderPreviews(); });
        item.appendChild(rm);
        if (file.type === "image") {
          const img = document.createElement("img"); img.src = file.base64; img.alt = file.name; item.appendChild(img);
        } else {
          const d = document.createElement("div"); d.className = "doc-icon";
          const fileExt = file.name.split(".").pop().substring(0, 4).toUpperCase();
          d.innerHTML = (file.type === "pdf" ? "📄" : "💻") + '<span class="doc-ext">' + fileExt + "</span>";
          item.appendChild(d);
        }
        item.title = file.name + " (" + file.size + ")";
        previewsContainer.appendChild(item);
      });
    }

    function fmtBytes(b) {
      if (!b) return "0 B";
      const k = 1024, s = ["B", "KB", "MB"];
      const i = Math.floor(Math.log(b) / Math.log(k));
      return parseFloat((b / Math.pow(k, i)).toFixed(1)) + " " + s[i];
    }

    // --- Mensajes ---
    function now() { return new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" }); }
    function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

    function fmtMarkdown(text) {
      let h = escapeHtml(String(text));
      h = h.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>');
      h = h.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');
      h = h.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');
      h = h.replace(/\*\*([\s\S]*?)\*\*/g, "<strong>$1</strong>");
      h = h.replace(/\*([\s\S]*?)\*/g, "<em>$1</em>");
      h = h.replace(/\n/g, "<br>");
      return h;
    }

    function appendMessage(containerId, role, content, extraClass) {
      const box = document.getElementById(containerId);
      const div = document.createElement("div");
      div.className = ("msg " + role + " " + (extraClass || "")).trim();
      const p = typeof content === "string" ? { text: content, files: [], image: null, genImages: [] } : content;
      let html = '<div class="msg-text">' + fmtMarkdown(p.text) + "</div>";

      if (p.files && p.files.length) {
        html += '<div class="msg-attachments">';
        p.files.forEach((f) => {
          if (f.type === "image") html += '<img src="' + f.base64 + '" alt="' + escapeHtml(f.name) + '" class="msg-attachment-img" />';
          else {
            const ext = f.name.split(".").pop().toUpperCase();
            html += '<div class="msg-attachment-doc"><span class="doc-icon">' + (f.type === "pdf" ? "📄" : "💻") + '</span><div class="doc-info"><span class="doc-name">' + escapeHtml(f.name) + '</span><span class="doc-size">' + ext + " · " + f.size + "</span></div></div>";
          }
        });
        html += "</div>";
      }

      if (p.genImages && p.genImages.length) {
        p.genImages.forEach((src) => {
          html += '<div class="study-image-wrap"><img src="' + src + '" alt="Imagen generada por IA" class="gemini-gen-img" /><button type="button" onclick="downloadImage(\'' + src + '\', \'tutor-gx-imagen.png\')" class="download-btn">⬇ Descargar imagen</button></div>';
        });
      }

      if (p.image) {
        html += '<div class="study-image-wrap"><img src="' + p.image + '" alt="Esquema generado" class="study-generated-img" /><button type="button" onclick="downloadImage(\'' + p.image + '\', \'tutor-gx-esquema.png\')" class="download-btn">⬇ Descargar esquema</button></div>';
      }

      div.innerHTML = html + '<span class="time">' + now() + "</span>";
      box.appendChild(div);
      box.scrollTop = box.scrollHeight;
    }

    // --- API Gemini con auto-descubrimiento de modelo ---
    const GEMINI_ENDPOINTS = ["v1", "v1beta"];

    async function tryGeminiCall(modelName, body) {
      let lastErr = null;
      for (const ver of GEMINI_ENDPOINTS) {
        const url = "https://generativelanguage.googleapis.com/" + ver + "/models/" + modelName + ":generateContent?key=" + cfg.geminiApiKey;
        try {
          const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const msg = (err.error && err.error.message) || "HTTP " + res.status;
            console.warn("[Tutor GX] " + ver + "/" + modelName + ":", msg);
            lastErr = new Error(msg);
            continue;
          }
          return await res.json();
        } catch (fetchErr) {
          console.warn("[Tutor GX] " + ver + "/" + modelName + " fetch fail:", fetchErr.message);
          lastErr = fetchErr;
        }
      }
      throw lastErr || new Error("No se pudo conectar con Gemini");
    }

    async function callGemini(systemPrompt, userParts) {
      const hasImages = userParts.some(p => p.inlineData);
      // systemInstruction a veces falla con inlineData en algunos endpoints
      const body = { contents: [{ parts: userParts }] };
      if (!hasImages) body.systemInstruction = { parts: [{ text: systemPrompt }] };

      // Si ya tenemos un modelo que funciona y no hay imágenes, usarlo directamente
      if (workingModel && !hasImages) {
        return await tryGeminiCall(workingModel, body);
      }

      // Si hay imágenes, forzar re-descubrimiento
      if (hasImages) workingModel = null;

      // Probar modelos en orden
      const models = cfg.modelos || ["gemini-2.0-flash", "gemini-1.5-flash"];
      let lastError = null;
      for (const model of models) {
        try {
          console.log("[Tutor GX] Probando modelo:", model);
          const data = await tryGeminiCall(model, body);
          workingModel = model;
          console.log("[Tutor GX] ✅ Modelo activo:", model);
          updateBadge(model);
          return data;
        } catch (e) {
          console.warn("[Tutor GX] ❌ Modelo " + model + " falló:", e.message);
          lastError = e;
        }
      }
      throw lastError || new Error("Ningún modelo de Gemini disponible");
    }

    function updateBadge(model) {
      const badge = document.getElementById("status-badge");
      if (badge) badge.innerHTML = '<span class="status-dot active"></span> ' + model;
    }

    function extractTextFromResponse(data) {
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) return "";
      return data.candidates[0].content.parts.filter(p => p.text).map(p => p.text).join("\n");
    }

    function extractImagesFromResponse(data) {
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) return [];
      return data.candidates[0].content.parts.filter(p => p.inlineData).map(p => "data:" + p.inlineData.mimeType + ";base64," + p.inlineData.data);
    }

    function clampDim(n, max) {
      const v = parseInt(n, 10) || 1024;
      return Math.min(max || 2048, Math.max(256, v));
    }

    function parseImageDimensions(text) {
      const max = (cfg.imagen && cfg.imagen.maxLado) || 2048;
      const t = text.toLowerCase();
      const xy = t.match(/(\d{3,4})\s*[x×]\s*(\d{3,4})/);
      if (xy) return { width: clampDim(xy[1], max), height: clampDim(xy[2], max) };
      const w = t.match(/(?:ancho|width)\s*[:=]?\s*(\d{3,4})/i);
      const h = t.match(/(?:alto|height|largo)\s*[:=]?\s*(\d{3,4})/i);
      if (w && h) return { width: clampDim(w[1], max), height: clampDim(h[1], max) };
      if (/vertical|retrato|historia|tiktok|9\s*:\s*16|9:16/.test(t)) return { width: 768, height: 1344 };
      if (/horizontal|paisaje|banner|16\s*:\s*9|16:9|youtube/.test(t)) return { width: 1344, height: 768 };
      if (/cuadrado|square|1\s*:\s*1|perfil|logo|icono/.test(t)) return { width: 1024, height: 1024 };
      if (/1080|full\s*hd|fhd/.test(t)) return { width: 1920, height: 1080 };
      const defW = (cfg.imagen && cfg.imagen.anchoDefault) || 1024;
      const defH = (cfg.imagen && cfg.imagen.altoDefault) || 1024;
      return { width: defW, height: defH };
    }

    function cleanImagePrompt(text) {
      return text
        .replace(/^(genera|generar|crea|crear|haz|hazme|dibuja|dibujar|diseña|pinta|ilustra)\s*(me\s*)?(una?\s*)?(imagen|foto|dibujo|ilustraci[oó]n|logo|poster)?\s*(de|del|sobre|con)?\s*/i, "")
        .replace(/\d{3,4}\s*[x×]\s*\d{3,4}/gi, "")
        .replace(/(?:ancho|alto|width|height)\s*[:=]?\s*\d{3,4}/gi, "")
        .trim() || text.trim();
    }

    function wantsImage(text) {
      const n = text.toLowerCase().trim();
      // Si empieza con verbo de creación, SIEMPRE generar imagen
      if (/^(genera|generame|crea|creame|haz|hazme|dibuja|dibujame|diseña|pinta|ilustra|saca|hacer|crear|generar)\s/.test(n)) return true;
      // Contiene verbo de creación + palabra relacionada a imagen cerca
      if (/(genera|crea|haz|dibuja|saca|hacer|crear|generar).{0,50}(imagen|foto|dibujo|logo|poster|wallpaper|avatar|arte|fondo|paisaje|ilustra)/i.test(n)) return true;
      // Palabra de imagen + preposición + verbo de creación
      if (/(imagen|foto|dibujo|logo|poster)\s+(de|del|de la|de los|sobre|con|para)\s+/.test(n) && /(genera|crea|haz|dibuja|quiero|necesito|saca|hacer|crear)/i.test(n)) return true;
      // Dimensiones + creación
      if (/\d{3,4}\s*[x×]\s*\d{3,4}/.test(n) && /(genera|crea|dibuja|imagen|foto|logo|poster)/i.test(n)) return true;
      // Inglés
      if (/(generate|create|draw|make|design|paint)\s+(an?\s+)?(image|picture|logo|poster|wallpaper|art|illustration)/i.test(n)) return true;
      return false;
    }

    async function fetchPollinationsImage(prompt, width, height, attempt) {
      const seed = Date.now() + (attempt || 0) * 997;
      const url =
        "https://image.pollinations.ai/prompt/" +
        encodeURIComponent(prompt) +
        "?nologo=true&private=true&enhance=true&model=flux&width=" +
        width +
        "&height=" +
        height +
        "&seed=" +
        seed;
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error("Generador de imagen no disponible (" + res.status + ")");
      const blob = await res.blob();
      if (!blob.type.startsWith("image/")) throw new Error("Respuesta inválida del generador");
      return blob;
    }

    function blobToDataUrl(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Error al procesar imagen"));
        reader.readAsDataURL(blob);
      });
    }

    async function generateImage(userMessage) {
      const dims = parseImageDimensions(userMessage);
      const cleanPrompt = cleanImagePrompt(userMessage);
      let finalPrompt = cleanPrompt;

      let activeModel = workingModel;
      if (!activeModel) {
        const models = cfg.modelos || ["gemini-2.0-flash", "gemini-1.5-flash"];
        activeModel = models[0];
      }

      if (activeModel) {
        try {
          const sysTranslate =
            "Eres un experto en prompts de IA. Convierte este pedido a un prompt corto y descriptivo en inglés para generar una imagen de alta calidad. Responde SOLO el prompt, sin explicación.";
          const data = await tryGeminiCall(activeModel, {
            contents: [{ parts: [{ text: cleanPrompt }] }],
            systemInstruction: { parts: [{ text: sysTranslate }] }
          });
          const improved = extractTextFromResponse(data);
          if (improved && improved.trim().length > 5) finalPrompt = improved.trim();
        } catch (e) {
          console.warn("[Guate Xiter IA] Mejora de prompt omitida:", e.message);
        }
      }

      const seed = Math.floor(Math.random() * 1000000) + Date.now();
      const imageUrl =
        "https://image.pollinations.ai/prompt/" +
        encodeURIComponent(finalPrompt) +
        "?nologo=true&private=true&enhance=true&model=flux&width=" +
        dims.width +
        "&height=" +
        dims.height +
        "&seed=" +
        seed;

      return {
        text:
          "🎨 **Imagen generada** (sin límite de uso)\n\n" +
          "• Tema: **" + cleanPrompt + "**\n" +
          "• Tamaño: **" + dims.width + " × " + dims.height + "** px\n\n" +
          "Puedes pedir otra con otro tamaño, por ejemplo: `genera imagen 1920x1080 de ...`",
        files: [],
        genImages: [imageUrl],
        image: null
      };
    }

    // --- Obtener respuesta ---
    const dev = cfg.developer || "d3 xDavid";
    const premium = cfg.premium || { precio: "$5 USD", nota: "cartel informativo" };
    const wa = cfg.whatsapp || { numero: "+502 3250 9982" };
    const SYSTEM_PROMPT = `Eres Guate Xiter IA, creado por ${dev}. Respondes TODO sin límites.
REGLAS:
- Responde completo, claro y directo a lo que preguntan.
- Matemáticas: pasos + fórmulas + resultado final.
- Redes: ideas, captions, hashtags, lo que pidan.
- Premium (${premium.precio}/mes) y WhatsApp ${wa.numero}: solo si preguntan.
- Español por defecto, otro idioma si el usuario escribe en él.
- Ilimitado en todo: imágenes, consultas, tamaño de respuesta.`;

    async function getBotResponse(userMessage, files) {
      // Preparar partes del mensaje
      const parts = [];

      // Texto del usuario + contenido de archivos de texto
      let prompt = userMessage;
      const textFiles = files.filter(f => f.type === "text");
      if (textFiles.length) {
        prompt += "\n\n[Archivos adjuntos del usuario:]";
        textFiles.forEach(tf => { prompt += "\n\n--- " + tf.name + " ---\n```\n" + tf.content + "\n```"; });
      }
      parts.push({ text: prompt });

      // Imágenes y PDFs como inlineData
      const mediaFiles = files.filter(f => f.type === "image" || f.type === "pdf");
      mediaFiles.forEach(bf => {
        try {
          if (!bf.base64) return;
          const parts2 = bf.base64.split(",");
          const b64 = parts2.length > 1 ? parts2[1] : bf.base64;
          parts.push({ inlineData: { mimeType: bf.mimeType || "image/png", data: b64 } });
        } catch (e) {
          console.warn("[Tutor GX] Error procesando archivo:", bf.name, e.message);
        }
      });

      // Intentar generar imagen si el usuario lo pide (Siempre usando Pollinations, sin límite)
      if (wantsImage(userMessage)) {
        try {
          console.log("[Tutor GX] Generando imagen con Pollinations...");
          const result = await generateImage(userMessage);
          if (result && result.genImages && result.genImages.length > 0) {
            return result;
          }
        } catch (imgErr) {
          console.warn("[Tutor GX] Pollinations falló, canvas fallback:", imgErr.message);
          if (typeof generarImagenEstudio === "function") {
            try {
              const tema = userMessage.replace(/^(genera|crea|haz|dibuja)\s*(me\s*)?(una?\s*)?(imagen|dibujo|foto)\s*(de|del|sobre|de la|de los)?\s*/i, "").trim() || userMessage;
              const img = generarImagenEstudio(tema, "esquema");
              return { text: "🎨 **Imagen generada:** " + tema, files: [], genImages: [], image: img };
            } catch (e3) { /* continue */ }
          }
        }
      }

      // Respuesta de texto (con imágenes si aplica, con fallback a solo texto)
      try {
        const data = await callGeminiWithRetry(SYSTEM_PROMPT, parts);
        const text = extractTextFromResponse(data);
        const images = extractImagesFromResponse(data);
        return { text: text || "Listo.", files: [], genImages: images, image: null };
      } catch (e) {
        // Si falló y había imágenes, reintentar solo texto
        if (mediaFiles.length) {
          const textParts = parts.filter(p => !p.inlineData);
          if (textParts.length) {
            try {
              const data = await callGeminiWithRetry(SYSTEM_PROMPT, textParts);
              return { text: extractTextFromResponse(data) || "Listo.", files: [], genImages: [], image: null };
            } catch (e2) { /* fall through */ }
          }
        }
        return { text: "Listo.", files: [], genImages: [], image: null };
      }
    }


    async function callGeminiWithRetry(systemPrompt, userParts) {
      let lastErr = null;
      for (let i = 0; i < 6; i++) {
        try {
          return await callGemini(systemPrompt, userParts);
        } catch (e) {
          lastErr = e;
          const msg = String(e.message || e);
          if (/high demand|429|rate|quota|overloaded|resource exhausted/i.test(msg) && i < 4) {
            await new Promise((r) => setTimeout(r, 1200 * (i + 1)));
            workingModel = null;
            continue;
          }
          if (/does not support image input|not supported for this model|does not support/i.test(msg) && i < 5) {
            workingModel = null;
            continue;
          }
          throw e;
        }
      }
      throw lastErr;
    }

    // --- Typing indicator ---
    function appendTyping(cid) {
      const box = document.getElementById(cid);
      const div = document.createElement("div");
      const id = "typ-" + Math.random().toString(36).substring(2, 8);
      div.id = id;
      div.className = "msg bot typing-indicator-msg";
      div.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
      box.appendChild(div);
      box.scrollTop = box.scrollHeight;
      return id;
    }
    function removeTyping(id) { const el = document.getElementById(id); if (el) el.remove(); }

    // --- Chat principal ---
    const form = document.getElementById("form-estudios");
    const input = document.getElementById("input-estudios");
    const chatId = "chat-estudios";

    async function send(text, filesToSend) {
      if (!input) return;
      if (!text.trim() && (!filesToSend || !filesToSend.length)) return;
      appendMessage(chatId, "user", { text: text, files: filesToSend || [] });
      input.value = "";
      attachedFiles = [];
      renderPreviews();

      if (!wantsImage(text)) incrementUsageStats();

      const typId = appendTyping(chatId);
      try {
        const reply = await getBotResponse(text, filesToSend || []);
        removeTyping(typId);
        appendMessage(chatId, "bot", reply);
      } catch (err) {
        removeTyping(typId);
        console.error("[Tutor GX] Error:", err);
        appendMessage(chatId, "bot", { text: "Listo. Pregunta de nuevo si necesitas algo más.", files: [], genImages: [], image: null });
      }
    }

    if (form && input) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const filesToSend = [...attachedFiles];
        send(input.value.trim(), filesToSend);
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          form.requestSubmit();
        }
      });
    }

    // --- Quick buttons ---
    const qc = document.getElementById("quick-estudios");
    if (qc && cfg.asistente.sugerencias) {
      cfg.asistente.sugerencias.forEach((p) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = p;
        b.addEventListener("click", () => send(p, []));
        qc.appendChild(b);
      });
    }

    // --- Mensaje de bienvenida ---
    const welcome = cfg.welcome || {};
    appendMessage(chatId, "bot", {
      text:
        (welcome.titulo || "**Welcome IA Guate Xiter**") + " ✨\n\n" +
        (welcome.mensaje || "Bienvenido a la IA de la comunidad Guate Xiter.") + "\n\n" +
        "👨‍💻 **Developer:** " + dev + "\n" +
        "⭐ **Premium:** " + (premium.precio || "$5 USD") + "/mes (cartel informativo)\n\n" +
        "• 🎨 **Imágenes ilimitadas** — cualquier tema y tamaño (ej. `1920x1080`)\n" +
        "• 💬 **Mensajes infinitos** — chats ilimitados sin restricciones\n" +
        "• 📐 **Todas las matemáticas** — paso a paso\n" +
        "• 📱 Redes · 📚 Estudios · 💼 Negocios\n" +
        "• 📞 WhatsApp: **" + (wa.numero || "+502 3250 9982") + "**\n\n" +
        "Escribe o toca un botón rápido ✨",
      files: [], genImages: [], image: null
    });

  }
})();
