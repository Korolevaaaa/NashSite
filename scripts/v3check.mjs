// Hero v3 verification — screenshots, idle-drift frames, screencast
// videos, functional scroll/tab checks. Dev-only harness.
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BASE = "http://localhost:5201";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = fileURLToPath(new URL("../shots/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--hide-scrollbars"],
});

const errors = [];
const newPage = async (w, h, opts = {}) => {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, isMobile: !!opts.mobile, hasTouch: !!opts.mobile });
  if (opts.reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  await page.goto(BASE, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1600));
  return page;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- 1) responsive screenshots + hscroll ----------
const sizes = [
  [1860, 936, "wide"], [1440, 900, "d1440"], [1024, 768, "t1024"],
  [768, 1024, "t768"], [390, 844, "m390"], [375, 667, "m375"],
];
for (const [w, h, tag] of sizes) {
  const page = await newPage(w, h, { mobile: w < 768 });
  const hs = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  await page.screenshot({ path: `${OUT}v3-${tag}-hero.png` });
  console.log(`${tag} ${w}x${h} hscroll:${hs}`);
  await page.close();
}

// ---------- 2) idle drift — frames at t=0 / 9s / 18s (period 18s) ----------
{
  const page = await newPage(1440, 900);
  await page.screenshot({ path: `${OUT}v3-drift-t0.png` });
  await sleep(9000);
  await page.screenshot({ path: `${OUT}v3-drift-t9.png` });
  await sleep(9000);
  await page.screenshot({ path: `${OUT}v3-drift-t18.png` });
  console.log("drift frames saved");
  await page.close();
}

// ---------- 3) screencast: idle flight + scroll transition + back ----------
{
  const page = await newPage(1440, 900);
  const rec = await page.screencast({ path: `${OUT}v3-flight.webm` });
  await sleep(19000); // one drift cycle
  // wheel → auto transition (return + 360 turn + holo nav)
  await page.mouse.move(720, 450);
  for (let i = 0; i < 14; i++) { await page.mouse.wheel({ deltaY: 260 }); await sleep(240); }
  await sleep(2500);
  await page.screenshot({ path: `${OUT}v3-nav.png` });
  // reverse
  for (let i = 0; i < 14; i++) { await page.mouse.wheel({ deltaY: -260 }); await sleep(240); }
  await sleep(2200);
  const y = await page.evaluate(() => Math.round(window.scrollY));
  await page.screenshot({ path: `${OUT}v3-back.png` });
  await rec.stop();
  console.log("screencast saved; scrollY after reverse:", y);
  await page.close();
}

// ---------- 4) functional: scroll sample, anchors, tab/inert ----------
{
  const page = await newPage(1440, 900);
  const ys = [];
  await page.mouse.move(720, 450);
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel({ deltaY: 280 });
    await sleep(200);
    ys.push(Math.round(await page.evaluate(() => window.scrollY)));
  }
  await sleep(1500);
  ys.push(Math.round(await page.evaluate(() => window.scrollY)));
  const nav = await page.evaluate(() => ({
    isNav: document.querySelector(".hero-stage")?.classList.contains("is-nav"),
    navInert: document.querySelector(".holo-nav")?.inert,
  }));
  console.log("transition:", JSON.stringify(ys), "nav:", JSON.stringify(nav));

  // tab through holo links
  const tabs = [];
  await page.evaluate(() => document.querySelector(".holo-nav a")?.focus());
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    tabs.push(await page.evaluate(() => document.activeElement?.textContent?.trim()?.slice(0, 20)));
  }
  console.log("tab@p1:", JSON.stringify(tabs));

  // anchor jump from holo nav
  await page.evaluate(() => {
    const a = [...document.querySelectorAll(".holo-nav a")].find((x) => x.getAttribute("href") === "#contacts");
    a?.click();
  });
  await sleep(2200);
  const ct = await page.evaluate(() => Math.round(document.querySelector("#contacts").getBoundingClientRect().top));
  console.log("contacts top after holo click:", ct);

  // back to hero
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1200);
  // fast wheel bursts both directions (jitter check)
  await page.mouse.move(720, 450);
  for (let i = 0; i < 8; i++) { await page.mouse.wheel({ deltaY: 400 }); await sleep(60); }
  for (let i = 0; i < 8; i++) { await page.mouse.wheel({ deltaY: -400 }); await sleep(60); }
  await sleep(1500);
  const yEnd = await page.evaluate(() => Math.round(window.scrollY));
  console.log("after fast fwd/back:", yEnd);
  await page.close();
}

// ---------- 5) reduced motion ----------
{
  const page = await newPage(1440, 900, { reduced: true });
  await page.mouse.move(720, 450);
  for (let i = 0; i < 10; i++) { await page.mouse.wheel({ deltaY: 300 }); await sleep(80); }
  await sleep(800);
  const y = await page.evaluate(() => Math.round(window.scrollY));
  const sparksStatic = await page.evaluate(() => window.scrollY > 0);
  console.log("reduced-motion scrollY:", y);
  await page.screenshot({ path: `${OUT}v3-reduced.png` });
  await page.close();
}

// ---------- 6) mid-scene reload (no teleport) ----------
{
  const page = await newPage(1440, 900);
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.reload({ waitUntil: "networkidle0" });
  await sleep(1800);
  const y = await page.evaluate(() => Math.round(window.scrollY));
  await page.screenshot({ path: `${OUT}v3-reload-mid.png` });
  console.log("reload mid scrollY:", y);
  await page.close();
}

console.log("errors:", errors.length ? errors : "none");
await browser.close();
