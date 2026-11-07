// Per-section screenshot harness for design audit.
// Usage: node scripts/audit-shots.mjs [baseUrl] [prefix]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] ?? "http://localhost:5310";
const PREFIX = process.argv[3] ?? "audit";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = fileURLToPath(new URL("../shots/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--hide-scrollbars"],
});

const IDS = ["services", "directions", "portfolio", "templates", "about", "team", "competencies", "process", "faq", "contacts"];

async function capture(width, height, suffix, mobile = false) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 30000 });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: `${OUT}${PREFIX}-hero${suffix}.png` });
  console.log(`shot: ${PREFIX}-hero${suffix}`);

  for (const id of IDS) {
    await page.evaluate((sel) => {
      document.getElementById(sel)?.scrollIntoView({ block: "start" });
      window.scrollBy(0, -70);
    }, id);
    await new Promise((r) => setTimeout(r, 950)); // reveal animation
    await page.evaluate((sel) => {
      const el = document.getElementById(sel);
      const r = el.getBoundingClientRect();
      if (r.top < 0) window.scrollBy(0, r.top);
    }, id);
    await new Promise((r) => setTimeout(r, 350));
    await page.screenshot({ path: `${OUT}${PREFIX}-${id}${suffix}.png` });
    console.log(`shot: ${PREFIX}-${id}${suffix}`);
  }

  // footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${OUT}${PREFIX}-footer${suffix}.png` });
  console.log(`shot: ${PREFIX}-footer${suffix}`);
  await page.close();
}

await capture(1440, 900, "");
await capture(390, 844, "-m", true);
await browser.close();
console.log("done");
