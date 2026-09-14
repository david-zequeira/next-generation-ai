/**
 * Renderiza un prototipo de Figma a 1920 px (donde sale 1:1) y lo recorta en
 * lonchas de 1080. Es la vía de escape cuando la API REST y el MCP de Figma
 * están sin cuota: el prototipo público se ve sin token.
 *
 *   node scripts/figma/proto-shot.mjs <url-del-proto> [--out DIR] [--slices N]
 *
 * Las capturas se toman por CDP (`Page.captureScreenshot`) y no por
 * `page.screenshot()`: el lienzo de Figma nunca queda quieto y Playwright se
 * queda esperando estabilidad hasta agotar el tiempo.
 */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const url = args.find((a) => a.startsWith("http"));
const flag = (name, def) => {
  const i = args.indexOf(name);
  return i < 0 ? def : args[i + 1];
};
if (!url) throw new Error("Falta la URL del prototipo de Figma");

const out = flag("--out", "docs/figma/precios-1520/proto");
const slices = Number(flag("--slices", 12));
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
const shot = async (name) => {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${out}/${name}.png`, Buffer.from(data, "base64"));
};

await page.goto(url.includes("hide-ui") ? url : `${url}&hide-ui=1`, { waitUntil: "load", timeout: 120_000 });
await page.waitForTimeout(18_000); // el lienzo tarda en pintar las fuentes

// El aviso de cookies de figma.com tapa la banda inferior: se rechaza.
for (const sel of ['button:has-text("Opt out")', '[aria-label="Close"]']) {
  const el = page.locator(sel).first();
  if ((await el.count().catch(() => 0)) && (await el.isVisible().catch(() => false))) {
    await el.click().catch(() => {});
    await page.waitForTimeout(1200);
  }
}

const info = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  return c ? { w: c.clientWidth, h: c.clientHeight } : null;
});
console.log("lienzo", info);

await shot("p-00");
for (let i = 1; i <= slices; i++) {
  await page.mouse.move(960, 500);
  // la rueda en tramos cortos: de un tirón el lienzo se salta contenido
  for (let k = 0; k < 9; k++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(1400);
  await shot(`p-${String(i).padStart(2, "0")}`);
}
await browser.close();
console.log(`${slices + 1} lonchas en ${out}`);
