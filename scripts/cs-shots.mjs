// Dev-only screenshots for cases/blog pages.
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] ?? "http://localhost:5310";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = fileURLToPath(new URL("../shots/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--hide-scrollbars", "--no-proxy-server"],
});

async function shot(name, url, { width = 1440, height = 900, scroll = 0, wait = 3000, mobile = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile });
  page.on("console", (m) => {
    if (m.type() === "error") console.log(`[${name}] console.error: ${m.text()}`);
  });
  await page.goto(`${BASE}/${url}`, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, wait));
  if (scroll) {
    await page.evaluate((y) => window.scrollTo(0, y), scroll);
    await new Promise((r) => setTimeout(r, 700));
  }
  await page.screenshot({ path: `${OUT}${name}.jpg`, type: "jpeg", quality: 80 });
  console.log(`saved ${name}`);
  await page.close();
}

await shot("cs-home-cases", "#cases", { scroll: 0 }); // anchor lands on section
await shot("cs-cases-page", "#/cases");
await shot("cs-case-detail", "#/case/neobank");
await shot("cs-blog", "#/blog");
await shot("cs-cases-mobile", "#/cases", { width: 390, height: 844, mobile: true });
await shot("cs-home-cases-mobile", "#cases", { width: 390, height: 844, mobile: true });

await browser.close();
