/**
 * GUATE XITER IA — Configuración del bot
 * Datos sincronizados con: https://guate-xiter-store.vercel.app/
 */
const GUATE_XITER_CONFIG = {
  branding: {
    logoGif: "https://file.vahalla.cc/edd21334.gif",
    favicon: "https://file.vahalla.cc/edd21334.gif",
  },

  empresa: {
    nombre: "Guate Xiter PRO",
    slogan: "Panel SaaS premium · Bypass · Emuladores · Guatemala 🇬🇹",
    desarrollador: "xDavid",
    tiendaUrl: "https://guate-xiter-store.vercel.app/",
    descripcion:
      "Plataforma **GUATE XITER PRO**: panel SaaS, bypass antidetect, licencias, centro de descargas, pagos PayPal y sistema de saldo. Desarrollado por **xDavid**.",
    servicios: [
      "Panel SaaS Pro y Anti-Cheat",
      "Bypass ultra estable (antidetect)",
      "Centro de descargas (FF, emuladores, panel)",
      "Pagos PayPal y saldo en cuenta",
      "Vendedores autorizados 24/7",
      "Soporte WhatsApp del developer",
    ],
    contacto: {
      whatsapp: "+502 3250 9982",
      whatsappLink: "https://wa.me/50232509982",
      horario: "Soporte 24/7 · Developer xDavid",
      discord: "Discord Server (ver en tienda)",
      youtube: "YouTube Canal (ver en tienda)",
    },
    pagos: {
      paypalMe: "https://paypal.me/david639935",
      paypalUsuario: "david639935",
      metodos: [
        "PayPal.Me de xDavid (pago directo)",
        "PayPal / tarjeta en la tienda web",
        "Saldo en cuenta (recarga en tienda)",
      ],
      comoFunciona: [
        "Paga con PayPal.Me: paypal.me/david639935",
        "O compra en guate-xiter-store.vercel.app con PayPal",
        "Tras el pago, activa tu licencia en la tienda o contacta soporte",
      ],
    },
    moneda: "Q",
    recargaSaldo: [
      { monto: 2, bonus: 0 },
      { monto: 5, bonus: 0 },
      { monto: 15, bonus: 1.5 },
      { monto: 30, bonus: 3.5 },
      { monto: 50, bonus: 7 },
      { monto: 90, bonus: 15 },
    ],
    panelTiempo: [
      {
        nombre: "Panel 24 Horas",
        precio: 1,
        desc: "Prueba el Panel completo durante 1 día.",
        incluye: ["Panel Anti-Cheat 24h", "Actualizaciones al instante", "Soporte prioritario", "Panel SaaS completo"],
      },
      {
        nombre: "Panel Semanal",
        precio: 8,
        desc: "7 días de Panel activo e inyecciones ilimitadas.",
        incluye: ["Panel Anti-Cheat 7 días", "Soporte WhatsApp", "Limpiador HWID", "Soporte 24/7 prioritario"],
      },
      {
        nombre: "Panel Mensual",
        precio: 18,
        desc: "30 días — Panel indetectado + SaaS Pro.",
        incluye: ["Panel Anti-Cheat 30 días", "Panel SaaS Pro", "Soporte 24/7 dedicado", "Licencia HWID exclusiva"],
      },
      {
        nombre: "Panel de por Vida",
        precio: 45,
        desc: "Acceso permanente + soporte VIP.",
        incluye: ["Acceso de por vida", "Actualizaciones VIP", "Soporte del programador", "HWID Reset ilimitado"],
      },
    ],
    bypassTiempo: [
      {
        nombre: "Bypass Diario VIP",
        precio: 1,
        desc: "Bypass ultra estable 1 día.",
        incluye: ["Bypass Anti-Cheat 24h", "Actualizaciones instantáneas", "Soporte dedicado", "Uso seguro 100%"],
      },
      {
        nombre: "Bypass Semanal VIP",
        precio: 6,
        desc: "Bypass activo 7 días.",
        incluye: ["Bypass 7 días", "Limpiador HWID", "Soporte prioritario", "Actualización automática"],
      },
      {
        nombre: "Bypass Mensual VIP",
        precio: 15,
        desc: "Bypass mensual anti-ban.",
        incluye: ["Bypass 30 días", "HWID vinculación única", "Soporte 24/7", "Ejecución oculta en nube"],
      },
      {
        nombre: "Bypass Permanente VIP",
        precio: 25,
        desc: "Acceso ilimitado de por vida.",
        incluye: ["Acceso de por vida", "Actualizaciones VIP gratis", "HWID Reset ilimitado", "Soporte programador"],
      },
    ],
    planes: [
      {
        id: "basico",
        nombre: "Panel Básico",
        precio: 8,
        badge: "BÁSICO",
        incluye: ["Panel Anti-Cheat", "Actualizaciones semanales", "Soporte WhatsApp", "Panel SaaS Básico"],
      },
      {
        id: "premium",
        nombre: "Panel Premium",
        precio: 20,
        badge: "⭐ RECOMENDADO",
        incluye: [
          "Panel Anti-Cheat",
          "Panel SaaS Pro completo",
          "Módulo bypass inyector",
          "Soporte 24/7 prioritario",
          "Actualizaciones automáticas",
          "HWID vinculado",
        ],
      },
    ],
    productos: [
      { nombre: "Panel SaaS Pro", precio: 15, precioAnterior: 20, badge: "POPULAR" },
      { nombre: "Panel Anti-Cheat", precio: 4, precioAnterior: 12, badge: "SEGURO" },
    ],
    vendedores: [
      {
        nombre: "SAMU",
        rol: "Vendedor Oficial",
        descripcion: "Soporte las 24 horas. Métodos de pago internacionales.",
        ventas: 127,
        verificado: true,
        telefono: "+57 311 703 2509",
        whatsappLink: "https://wa.me/573117032509",
      },
      {
        nombre: "SIKI",
        rol: "Vendedor Oficial",
        descripcion: "Entrega inmediata de llaves Bypass y Panel FF.",
        ventas: 98,
        verificado: true,
        telefono: "+57 318 258 4483",
        whatsappLink: "https://wa.me/573182584483",
      },
      {
        nombre: "LALO",
        rol: "Vendedor Oficial",
        descripcion: "Asesoramiento para configuración del inyector.",
        ventas: 74,
        verificado: true,
        telefono: "+52 1 561 552 0491",
        whatsappLink: "https://wa.me/5215615520491",
      },
      {
        nombre: "SEBAS",
        rol: "Vendedor Oficial",
        descripcion: "Distribuidor local. Ofertas por volumen.",
        ventas: 56,
        verificado: true,
        telefono: "+502 3250 9982",
        whatsappLink: "https://wa.me/50232509982",
      },
    ],
    faq: [
      {
        keys: ["hola", "buenas", "que tal", "saludos"],
        respuesta:
          "¡Hola! Soy **Guate Xiter IA**. Pregunta por **precios**, **PayPal**, **vendedores**, **links** o la **tienda oficial**. 🇬🇹",
      },
      {
        keys: ["empresa", "quienes son", "que es guate xiter", "guate xiter", "pro"],
        respuesta:
          "**GUATE XITER PRO** es panel SaaS gaming: bypass, licencias, descargas y pagos. Tienda: {tienda}\nDeveloper: **xDavid**",
      },
      {
        keys: ["configurar", "configuracion"],
        respuesta:
          "Bypass compatible con **BlueStacks 5**, LDPlayer y Nox. Recomendamos BlueStacks. Config en pestaña **Descargas**:",
      },
      {
        keys: ["descargar", "xapk", "apk"],
        respuesta: "Descargas MediaFire + Centro oficial en la tienda:",
      },
      {
        keys: ["bypass", "ban", "banear", "antidetect"],
        respuesta:
          "🛡 Bypass **antidetect** actualizado contra parches FF. Si sigues la config, riesgo mínimo. Más info en FAQ de la tienda.",
      },
      {
        keys: ["licencia", "key", "clave", "hwid"],
        respuesta:
          "🔑 Cada cuenta: **1 key Bypass** + **1 key Panel** (HWID vinculado). Genera en tu perfil tras comprar en {tienda}",
      },
      {
        keys: ["contacto", "whatsapp", "soporte", "developer"],
        respuesta:
          "📱 Developer **xDavid:** {whatsapp}\n💳 PayPal: {paypal}\n🕐 {horario}\n🌐 Tienda: {tienda}",
      },
      {
        keys: ["pago", "paypal", "pagar", "metodo de pago"],
        respuesta:
          "💳 Pago directo con PayPal de **xDavid**:\n{paypal}\n\nTambién puedes comprar en la tienda oficial.",
      },
      {
        keys: ["david", "desarrollador", "dev", "quien hizo"],
        respuesta: "Todo hecho por **xDavid** — GUATE XITER PRO Core v3.2 💻",
      },
    ],
  },

  estudios: {
    nombreAsistente: "Tutor GX",
    intro:
      "Solo ayuda escolar: matemáticas, ciencias, lengua, historia, tareas y repaso. Pide explicaciones o **genera imágenes** de estudio.",
    materias: ["Matemáticas", "Ciencias", "Lengua y literatura", "Historia", "Inglés", "Geografía"],
    tips: [
      "«explícame las fracciones»",
      "«5 preguntas de repaso sobre historia»",
      "«genera imagen de el ciclo del agua»",
      "«mapa mental de verbos»",
      "«esquema de mi tarea de biología»",
    ],
  },

  descargas: {
    freeFire: [
      {
        id: "normal",
        label: "Free Fire Normal - New",
        url: "https://www.mediafire.com/file/xa0rlzde18c0hxx/Free+Fire+Normal+-+New.xapk/file",
        icon: "🔥",
      },
      {
        id: "max",
        label: "Free Fire Max - New",
        url: "https://www.mediafire.com/file/zwozlus4bpcz375/Free+Fire+Max+-+New.xapk/file",
        icon: "⚡",
      },
      {
        id: "x86",
        label: "Free Fire X86 Tela",
        url: "https://www.mediafire.com/file/zgavs2v4t6eqmfs/Free+Fire+-+Tela.xapk/file",
        icon: "📱",
      },
    ],
    emuladores: [
      {
        label: "BlueStacks 5",
        url: "https://www.mediafire.com/file/gcul7z9nmy4b3da/BlueStack_5.22.75.1026_P64.rar/file",
        icon: "🟦",
      },
      {
        label: "MSI App Player",
        url: "https://www.mediafire.com/file/rav82d5a1bkahsv/MSI_5.22_OPTI.rar/file",
        icon: "🟥",
      },
    ],
    imagenesConfig: [
      { titulo: "Configuración 1", url: "https://i.postimg.cc/nzyK662q/image-8.png" },
      { titulo: "Configuración 2", url: "https://i.postimg.cc/9QLdW41R/image-7.png" },
      { titulo: "Configuración 3", url: "https://i.postimg.cc/V6mmD6Q7/image-6.png" },
      { titulo: "Configuración 4", url: "https://i.postimg.cc/ydgthCW3/image.png" },
    ],
  },
};
