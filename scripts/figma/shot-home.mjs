// node scripts/figma/shot-home.mjs [url] → docs/figma/home-1532/shots/site-stitched-992.png y site2-sliceN.png
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
const out = "docs/figma/home-1532/shots"; mkdirSync(out, { recursive: true });
const url = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, locale: "es-ES" });
await ctx.addInitScript(() => { try { localStorage.setItem("ng-locale", "es"); } catch {} });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" }); await page.waitForTimeout(2500);
const H = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < H; y += 1080) {
  await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(900);
  await page.mouse.wheel(0, 1); await page.waitForTimeout(400);
  writeFileSync(`${out}/shot-${String(i++).padStart(2, "0")}.png`, await page.screenshot({ type: "png" }));
}
await browser.close(); console.log(`${i} capturas en ${out}`);
