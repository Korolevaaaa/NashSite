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
await page.setViewport({ width: 1440, height: 900 });
await page.goto("https://graffiti-zerkalo.ru/", { waitUntil: "networkidle2", timeout: 45000 });
await new Promise((r) => setTimeout(r, 2500));

// click the orange chat bubble bottom-right (~1385, 845)
await page.mouse.click(1385, 845);
await new Promise((r) => setTimeout(r, 3000));
await page.screenshot({ path: `${OUT}bot-open.png` });
console.log("saved bot-open");

await browser.close();
