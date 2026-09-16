/**
 * Captura una página del sitio a 1920 px —el ancho al que los marcos de Figma
 * salen 1:1— en lonchas de 1080, para compararla con las del prototipo.
 *
 *   node scripts/figma/shot-home.mjs [url] [--out DIR] [--locale es|en] [--width N]
 *
 * Deja resueltos el aviso de cookies y el idioma antes de cargar, para que no
 * tapen ni cambien nada. Las lonchas salen como `shot-NN.png`.
 */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(name);
  return i < 0 ? def : args[i + 1];
};
const url = args.find((a) => a.startsWith("http")) ?? "http://localhost:3000";
const out = flag("--out", "docs/figma/home-1532/shots");
const locale = flag("--locale", "es");
const width = Number(flag("--width", 1920));

mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({
  viewport: { width, height: 1080 },
  deviceScaleFactor: 1,
  locale: locale === "es" ? "es-ES" : "en-GB",
});
await ctx.addInitScript(
  ([loc]) => {
    try {
      localStorage.setItem("ng-locale", loc);
      // Consentimiento ya decidido: el aviso tapa la banda inferior y falsea la comparación.
      localStorage.setItem(
        "ng-consent",
        JSON.stringify({ v: 1, analytics: false, at: new Date().toISOString() })
      );
    } catch {}
  },
  [locale]
);

const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

const H = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < H; y += 1080) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(900);
  await page.mouse.wheel(0, 1);
  await page.waitForTimeout(400);
  writeFileSync(`${out}/shot-${String(i++).padStart(2, "0")}.png`, await page.screenshot({ type: "png" }));
}
await browser.close();
console.log(`${i} capturas de ${H} px en ${out}`);
