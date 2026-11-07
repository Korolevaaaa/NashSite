// Interaction test for #/cases filters + case detail links.
import puppeteer from "puppeteer-core";
import { fileURLToPath } from "node:url";

const BASE = "http://localhost:5310";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = fileURLToPath(new URL("../shots/", import.meta.url));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--hide-scrollbars", "--no-proxy-server"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(`${BASE}/#/cases`, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 3000));

const count = async () => page.$$eval(".csp-grid > li", (els) => els.length);
console.log("all:", await count());

// search "aeron"
await page.type(".sf-search", "aeron");
await new Promise((r) => setTimeout(r, 400));
console.log('search "aeron":', await count());
await page.screenshot({ path: `${OUT}cs-search.jpg`, type: "jpeg", quality: 80 });
await page.evaluate(() => (document.querySelector(".sf-search").value = ""));
await page.reload({ waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 2800));

// click industry chip "Медицина"
await page.$$eval(".sf-chip", (chips) => chips.find((c) => c.textContent === "Медицина")?.click());
await new Promise((r) => setTimeout(r, 400));
console.log('industry "Медицина":', await count());

// click type chip "Корп. сайт"
await page.$$eval(".sf-chip", (chips) => chips.find((c) => c.textContent === "Корп. сайт")?.click());
await new Promise((r) => setTimeout(r, 400));
console.log('+ type "Корп. сайт":', await count());

// incompatible combo
await page.$$eval(".sf-chip", (chips) => chips.find((c) => c.textContent === "Интернет-магазин")?.click());
await new Promise((r) => setTimeout(r, 400));
console.log("empty combo:", await count());
const empty = await page.$(".sf-empty");
console.log("empty state visible:", !!empty);
await page.screenshot({ path: `${OUT}cs-empty.jpg`, type: "jpeg", quality: 80 });

// card link navigates to case page
await page.reload({ waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 2800));
await page.click(".csp-grid .cs-card");
await new Promise((r) => setTimeout(r, 800));
console.log("after card click, hash:", await page.evaluate(() => location.hash));

await browser.close();
