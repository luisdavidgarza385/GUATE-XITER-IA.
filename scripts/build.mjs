import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import JavaScriptObfuscator from "javascript-obfuscator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

const parts = ["config.js", "estudios-art.js", "security.js", "app.js"];
let bundle = parts
  .map((f) => fs.readFileSync(path.join(root, f), "utf8"))
  .join("\n;\n");

const obfuscated = JavaScriptObfuscator.obfuscate(bundle, {
  compact: true,
  stringArray: true,
  stringArrayEncoding: ["base64"],
  stringArrayThreshold: 0.5,
  renameGlobals: false,
  selfDefending: false,
  target: "browser",
}).getObfuscatedCode();

if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });

fs.writeFileSync(path.join(dist, "app.bundle.js"), obfuscated);
fs.copyFileSync(path.join(root, "styles.css"), path.join(dist, "styles.css"));

let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
html = html.replace(
  /<script src="config\.js"><\/script>\s*<script src="estudios-art\.js"><\/script>\s*<script src="security\.js"><\/script>\s*<script src="app\.js"><\/script>/,
  '<script src="app.bundle.js"></script>'
);

fs.writeFileSync(path.join(dist, "index.html"), html);
console.log("Build listo en /dist — sube a Vercel");
