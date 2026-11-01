// Capturas de la web con Playwright.
//   node scripts/capture.js journey 390 844 docs/capturas-v2/movil [paso=0.5]
//   node scripts/capture.js full 1440 900 docs/capturas-v2/escritorio-reducido   (reduced-motion, página entera)
//   node scripts/capture.js at 390 844 /tmp/x 3.2,4.5   (posiciones en alturas de pantalla)
const { chromium } = require('playwright');
const fs = require('fs');
const [mode, W, H, out, extra] = process.argv.slice(2);
const URL = process.env.URL || 'http://127.0.0.1:8080/lethon-web/';
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({
    viewport: { width: +W, height: +H },
    reducedMotion: mode === 'full' ? 'reduce' : 'no-preference',
    deviceScaleFactor: 1,
    hasTouch: +W < 800,
    isMobile: +W < 800,
    locale: process.env.LOCALE || 'es-ES',
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);
  if (mode === 'full') {
    await page.screenshot({ path: `${out}/pagina-entera.png`, fullPage: true });
  } else {
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const vh = +H;
    let positions;
    if (mode === 'at') positions = extra.split(',').map((x) => +x * vh);
    else {
      const step = (+extra || 0.5) * vh;
      positions = [];
      for (let y = 0; y < total - vh + 1; y += step) positions.push(y);
      positions.push(total - vh);
    }
    let i = 0;
    for (const y of positions) {
      // desplazamiento gradual para que el scrub tenga tiempo de alcanzarlo
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(450);
      await page.screenshot({ path: `${out}/${String(i++).padStart(3, '0')}-y${Math.round(y / vh * 100) / 100}.png` });
    }
    console.log('total altura', total, 'pantallas', (total / vh).toFixed(1));
  }
  console.log('errores:', errors);
  await b.close();
})();
