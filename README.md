# Guate Xiter IA

Bot web **Guate Xiter IA** — Developer **xDavid**.

## Modos

- **Empresa** — Precios en **Q**, PayPal, vendedores, links FF/emuladores
- **Estudios** — Solo escuela + **genera imágenes** de repaso (canvas)
- **Descargas** — MediaFire, rotación FF, config emulador

## Precios (Q — quetzales)

Panel: Q1 · Q8 · Q18 · Q45 | Bypass VIP: Q1 · Q6 · Q15 · Q25  
Premium Q20 · SaaS Pro Q15 · Anti-Cheat Q4

## 🌐 Subir a Vercel (siempre en línea)

Tu PC apagada = la web sigue viva en Vercel.

1. Instala [Node.js](https://nodejs.org)
2. En esta carpeta:

```bash
npm install
npm run build
```

3. Sube a GitHub o arrastra la carpeta `dist` en [vercel.com](https://vercel.com)
4. O con CLI:

```bash
npx vercel --prod
```

Vercel usa `vercel.json` → compila y publica `/dist` con código **ofuscado** (más difícil de copiar).

## Desarrollo local (si no carga)

**No abras `index.html` con doble clic** — usa el servidor:

1. Doble clic en **`INICIAR.bat`** en la carpeta del proyecto  
   **o** en terminal:
   ```bash
   npm start
   ```
2. Espera el mensaje: `Abre: http://localhost:3000`
3. Abre en Chrome/Edge: **http://127.0.0.1:3000**

Si el puerto 3000 está ocupado, cierra otras ventanas de terminal y vuelve a intentar.

## Seguridad

- Build ofusca `config.js` + `app.js` en un solo `app.bundle.js`
- Bloqueo básico: clic derecho, F12, ver código fuente
- **Nota:** ninguna web es 100% a prueba de copia; esto protege lo casual

## Editar contenido

`config.js` — precios, vendedores, links, PayPal  
Luego `npm run build` antes de subir a Vercel.

---

**Guate Xiter IA** · xDavid · Guatemala 🇬🇹
