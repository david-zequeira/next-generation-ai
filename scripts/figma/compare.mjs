/**
 * Pega dos capturas una al lado de la otra, rotuladas, para mirar el marco de
 * Figma y la web al mismo tiempo.
 *
 *   node scripts/figma/compare.mjs <izquierda.png> <derecha.png> --out f.png
 *        [--labels "Figma,Web"] [--crop y0,y1]
 *
 * `--crop` recorta las dos por la misma banda vertical, que es lo habitual:
 * interesa una sección, no la página entera.
 */
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(name);
  return i < 0 ? def : args[i + 1];
};
const out = flag("--out", "comparativa.png");
const labels = flag("--labels", "Figma,Web").split(",");
const crop = flag("--crop", null)?.split(",").map(Number) ?? null;
const [a, b] = args.filter((x) => x.endsWith(".png") && x !== out);

const enc = (p) => readFileSync(resolve(p)).toString("base64");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const dataUrl = await page.evaluate(
  async ({ a, b, labels, crop }) => {
    const load = async (b64) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      return img;
    };
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const y0 = crop ? crop[0] : 0;
    const y1 = crop ? crop[1] : Math.max(ia.naturalHeight, ib.naturalHeight);
    const h = y1 - y0;
    const pad = 12;
    const bar = 34;
    const c = document.createElement("canvas");
    c.width = ia.naturalWidth + ib.naturalWidth + pad * 3;
    c.height = h + bar + pad * 2;
    const g = c.getContext("2d");
    g.fillStyle = "#15171c";
    g.fillRect(0, 0, c.width, c.height);
    g.drawImage(ia, 0, y0, ia.naturalWidth, h, pad, bar + pad, ia.naturalWidth, h);
    g.drawImage(ib, 0, y0, ib.naturalWidth, h, pad * 2 + ia.naturalWidth, bar + pad, ib.naturalWidth, h);
    g.fillStyle = "#e7e9ee";
    g.font = "600 20px system-ui, sans-serif";
    g.fillText(labels[0] ?? "A", pad, bar);
    g.fillText(labels[1] ?? "B", pad * 2 + ia.naturalWidth, bar);
    return c.toDataURL("image/png");
  },
  { a: enc(a), b: enc(b), labels, crop }
);

writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
console.log(`→ ${out}`);
await browser.close();
