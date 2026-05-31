/** Protección básica del frontend (no oculta 100% el código, pero dificulta copia casual) */
(function () {
  "use strict";
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    const k = e.key ? e.key.toLowerCase() : "";
    if (e.key === "F12") e.preventDefault();
    if (e.ctrlKey && e.shiftKey && (k === "i" || k === "j" || k === "c")) e.preventDefault();
    if (e.ctrlKey && (k === "u" || k === "s")) e.preventDefault();
  });
  document.body.classList.add("secure-app");
})();
