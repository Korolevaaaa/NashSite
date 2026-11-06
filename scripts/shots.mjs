// Screenshot harness — dev-only, not part of the site.
// Usage: node scripts/shots.mjs [baseUrl]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:5199";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
import { fileURLToPath } from "node:url";
const OUT = fileURLToPath(new URL("../shots/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: [
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
    "--hide-scrollbars",
  ],
});

const logs = [];
async function shot(name, { width, height, url = "", scroll = null, mouse = null, reduced = false, wait = 900, mobile = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  if (reduced) {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  }
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") logs.push(`[${name}] console.${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => logs.push(`[${name}] pageerror: ${e.message}`));
  await page.goto(`${BASE}/${url}`, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1400)); // let GLB chunk + model settle
  if (scroll !== null) {
    await page.evaluate((y) => window.scrollTo(0, y), scroll);
  }
  if (mouse) {
    await page.mouse.move(mouse[0], mouse[1], { steps: 6 });
    await new Promise((r) => setTimeout(r, 700));
  }
  await new Promise((r) => setTimeout(r, wait));
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log("shot:", name);
  await page.close();
}

const DESKTOP = { width: 1440, height: 900 };

await shot("hero-start", { ...DESKTOP });
await shot("hero-cursor", { ...DESKTOP, mouse: [1100, 300] });
await shot("transition-25", { ...DESKTOP, url: "?scrub=0.25" });
await shot("transition-50", { ...DESKTOP, url: "?scrub=0.5" });
await shot("transition-75", { ...DESKTOP, url: "?scrub=0.75" });
await shot("transition-100", { ...DESKTOP, url: "?scrub=1" });
await shot("sections", { ...DESKTOP, scroll: 99999 });

await shot("mobile-hero", { width: 390, height: 844, mobile: true });
await shot("mobile-transition-50", { width: 390, height: 844, mobile: true, url: "?scrub=0.5" });
await shot("mobile-transition-100", { width: 390, height: 844, mobile: true, url: "?scrub=1" });
await shot("mobile-sections", { width: 390, height: 844, mobile: true, scroll: 99999 });

await shot("reduced-motion", { ...DESKTOP, reduced: true });
await shot("tablet-768", { width: 768, height: 1024 });
await shot("desktop-1024", { width: 1024, height: 768 });

// keyboard tab order sanity: focus first holo link when nav visible
{
  const page = await browser.newPage();
  await page.setViewport(DESKTOP);
  await page.goto(`${BASE}/?scrub=1`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));
  const info = await page.evaluate(() => {
    const nav = document.querySelector(".holo-nav");
    const links = [...nav.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    const inert = nav.inert;
    return { links, inert, visible: getComputedStyle(nav).visibility };
  });
  console.log("holo-nav state:", JSON.stringify(info));
  await page.close();
}

// horizontal overflow check
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log("mobile horizontal overflow px:", overflow);
  await page.close();
}

await browser.close();
console.log("\n--- console/page errors ---");
console.log(logs.length ? logs.join("\n") : "(none)");
