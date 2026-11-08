// Capture graffiti-zerkalo.ru at a narrow viewport — responsive layout
// makes hero content proportionally larger, so it reads on a case card
// at native resolution (no zoom, no quality loss).
import puppeteer from "puppeteer-core";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../public/cases/instabarter/", import.meta.url));
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-proxy-server", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1024, height: 760 });
await page.goto("https://graffiti-zerkalo.ru/", { waitUntil: "networkidle2", timeout: 45000 });
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: `${OUT}hero-narrow.png` });
console.log("saved hero-narrow.png");
await browser.close();
