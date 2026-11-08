import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../public/cases/yaruska/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-proxy-server", "--hide-scrollbars", "--disable-extensions"],
});

async function snap(name, opts = {}) {
  const { width = 1440, height = 900, scroll = 0, sel = null, url = "https://yaruska.ru/", wait = 2000 } = opts;
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
    await new Promise((r) => setTimeout(r, wait));
    if (sel) {
      const el = await page.$(sel);
      if (el) {
        await el.scrollIntoView();
        await new Promise((r) => setTimeout(r, 900));
        await el.screenshot({ path: `${OUT}${name}.png` });
        console.log(`saved ${name} (element)`);
        await page.close();
        return;
      }
      console.log(`no el ${sel} for ${name}, full shot`);
    }
    if (scroll) {
      await page.evaluate((y) => window.scrollTo(0, y), scroll);
      await new Promise((r) => setTimeout(r, 1000));
    }
    await page.screenshot({ path: `${OUT}${name}.png` });
    console.log(`saved ${name}`);
  } catch (e) {
    console.log(`FAIL ${name}: ${e.message}`);
  }
  await page.close();
}

// first probe: page structure, anchors, doc height, links
const probe = await browser.newPage();
await probe.setViewport({ width: 1440, height: 900 });
await probe.goto("https://yaruska.ru/", { waitUntil: "networkidle2", timeout: 45000 });
await new Promise((r) => setTimeout(r, 2500));
const info = await probe.evaluate(() => ({
  title: document.title,
  docH: document.body.scrollHeight,
  links: [...document.querySelectorAll("a[href]")]
    .map((a) => a.getAttribute("href"))
    .filter((h) => h && !h.startsWith("#") && !h.startsWith("javascript"))
    .slice(0, 60),
  sections: [...document.querySelectorAll("section[id], footer, header")].map(
    (s) => s.id || s.tagName,
  ),
}));
console.log(JSON.stringify(info, null, 1));
await probe.close();
await browser.close();
