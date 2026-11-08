// Screenshots of the live graffiti-zerkalo.ru for the case page.
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../public/cases/instabarter/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-proxy-server", "--hide-scrollbars", "--disable-extensions"],
});

async function snap(name, opts = {}) {
  const { width = 1440, height = 900, scroll = 0, sel = null, wait = 1600 } = opts;
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  try {
    await page.goto("https://graffiti-zerkalo.ru/", {
      waitUntil: "networkidle2",
      timeout: 45000,
    });
    await new Promise((r) => setTimeout(r, wait));
    if (sel) {
      const el = await page.$(sel);
      if (el) {
        await el.scrollIntoView();
        await new Promise((r) => setTimeout(r, 800));
        await el.screenshot({ path: `${OUT}${name}.png` });
        console.log(`saved ${name} (element)`);
        await page.close();
        return;
      }
    }
    if (scroll) {
      await page.evaluate((y) => window.scrollTo(0, y), scroll);
      await new Promise((r) => setTimeout(r, 900));
    }
    await page.screenshot({ path: `${OUT}${name}.png` });
    console.log(`saved ${name}`);
  } catch (e) {
    console.log(`FAIL ${name}: ${e.message}`);
  }
  await page.close();
}

await snap("hero", {});
await snap("services", { scroll: 900 });
await snap("portfolio", { scroll: 2200 });
await snap("about", { scroll: 4200 });
await snap("reviews", { scroll: 6200 });
await snap("contact", { scroll: 9000 });
await snap("mobile-hero", { width: 390, height: 844 });
await snap("mobile-portfolio", { width: 390, height: 844, scroll: 2200 });

await browser.close();
console.log("done");
