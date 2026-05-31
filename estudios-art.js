/** Generador de imágenes educativas (canvas) — Modo Estudios */
function generarImagenEstudio(tema, tipo) {
  const W = 720;
  const H = 480;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const tipos = {
    mapa: { titulo: "Mapa mental", icon: "🧠", color: "#818cf8" },
    esquema: { titulo: "Esquema", icon: "📋", color: "#2ee8c6" },
    formula: { titulo: "Ficha de estudio", icon: "📐", color: "#ffc947" },
    diagrama: { titulo: "Diagrama", icon: "🔬", color: "#ff6b2c" },
  };
  const meta = tipos[tipo] || tipos.esquema;
  const titulo = (tema || "Tema de estudio").slice(0, 80);

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#0f0a1a");
  grad.addColorStop(0.5, "#1a1230");
  grad.addColorStop(1, "#0a1628");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = meta.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, W - 24, H - 24);

  ctx.fillStyle = meta.color;
  ctx.font = "bold 28px 'Segoe UI', sans-serif";
  ctx.fillText(meta.icon + " Tutor GX — " + meta.titulo, 32, 58);

  ctx.fillStyle = "#f4f0ff";
  ctx.font = "bold 36px 'Segoe UI', sans-serif";
  wrapText(ctx, titulo, 32, 110, W - 64, 42);

  const puntos = puntosEstudio(tema, tipo);
  ctx.font = "20px 'Segoe UI', sans-serif";
  ctx.fillStyle = "#c4b5fd";
  let y = 200;
  puntos.forEach((p, i) => {
    ctx.fillStyle = meta.color;
    ctx.fillText(String(i + 1) + ".", 32, y);
    ctx.fillStyle = "#e8edf7";
    wrapText(ctx, p, 52, y, W - 84, 26);
    y += 52;
  });

  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "14px sans-serif";
  ctx.fillText("Guate Xiter IA · Modo Estudios · xDavid", 32, H - 28);

  return canvas.toDataURL("image/png");
}

function puntosEstudio(tema, tipo) {
  const t = (tema || "tema").toLowerCase();
  if (tipo === "formula" || t.includes("fraccion") || t.includes("matematica")) {
    return [
      "Concepto principal: " + tema,
      "Ejemplo numérico paso a paso",
      "Regla clave para recordar",
      "Error común que debes evitar",
    ];
  }
  if (tipo === "mapa") {
    return [
      "Idea central → " + tema,
      "Ramas: definición · ejemplo · uso",
      "Conecta con algo que ya sabes",
      "Repasa en voz alta 2 minutos",
    ];
  }
  if (tipo === "diagrama") {
    return [
      "Entrada: qué es " + tema,
      "Proceso: cómo funciona",
      "Salida: resultado o aplicación",
      "Relación con el mundo real",
    ];
  }
  return [
    "Introducción breve",
    "3 ideas sobre: " + tema,
    "Ejemplo concreto (Guatemala)",
    "Conclusión en una frase",
  ];
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, cy);
      line = words[i] + " ";
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, cy);
  return cy;
}

function detectarTipoImagen(texto) {
  const n = texto.toLowerCase();
  if (n.includes("mapa mental") || n.includes("mapa")) return "mapa";
  if (n.includes("formula") || n.includes("ficha")) return "formula";
  if (n.includes("diagrama")) return "diagrama";
  return "esquema";
}

function extraerTemaImagen(texto) {
  return texto
    .replace(/^(genera|generame|haz(me)?|dibuja|crea(me)?|imagen de|imagen sobre|mapa mental de|diagrama de|esquema de)\s*/gi, "")
    .replace(/^(una|un|la|el)\s+/i, "")
    .trim() || "Mi tema de estudio";
}

function quiereImagen(texto) {
  const n = texto.toLowerCase();
  return (
    n.includes("imagen") ||
    n.includes("genera") ||
    n.includes("dibuja") ||
    n.includes("diagrama") ||
    n.includes("mapa mental") ||
    n.startsWith("hazme una") ||
    n.includes("crea imagen")
  );
}
