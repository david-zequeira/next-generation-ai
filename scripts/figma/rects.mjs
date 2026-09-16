/**
 * Vuelca la caja de los elementos que se le pidan, con la página cargada a
 * 1920 px — el ancho al que el marco de Figma sale 1:1. Sirve para comparar la
 * maquetación con las medidas de `docs/figma/<marco>/spec.md` sin tener que
 * deducirlas de una captura.
 *
 *   node scripts/figma/rects.mjs <url> "<selector>" ["<selector>" …] [--locale es] [--width 1920]
 *
 * Cada selector puede llevar `#N` al final para quedarse con el elemento N
 * (0-indexado) de los que casen: `"input#2"`.
 */
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(name);
  if (i < 0) return def;
  args.splice(i, 2);
  return args[i] === undefined ? def : args.slice(i, i + 1)[0];
};
const locale = flag("--locale", "es");
const width = Number(flag("--width", 1920));
const [url, ...selectors] = args.filter((a) => !a.startsWith("--"));

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
await page.waitForTimeout(1500);

const rows = await page.evaluate((sels) => {
  const out = [];
  for (const raw of sels) {
    const m = raw.match(/^(.*?)#(\d+)$/);
    const sel = m ? m[1] : raw;
    const idx = m ? Number(m[2]) : null;
    const all = [...document.querySelectorAll(sel)];
    const picked = idx === null ? all.slice(0, 4) : [all[idx]].filter(Boolean);
    if (!picked.length) {
      out.push(`${raw}: sin coincidencias`);
      continue;
    }
    picked.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const round = (v) => Math.round(v * 10) / 10;
      out.push(
        `${raw}${idx === null && picked.length > 1 ? `[${i}]` : ""}: ` +
          `x${round(r.x)} y${round(r.y + window.scrollY)} ${round(r.width)}×${round(r.height)} ` +
          `· ${cs.fontSize}/${cs.lineHeight} w${cs.fontWeight} ls${cs.letterSpacing} ` +
          `· r${cs.borderRadius} · ${cs.color}`
      );
    });
  }
  return out;
}, selectors);

for (const r of rows) console.log(r);
await browser.close();
