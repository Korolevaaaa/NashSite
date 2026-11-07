import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = fileURLToPath(new URL("../shots/", import.meta.url));
mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--hide-scrollbars"],
});
const shots = [
  ["hero0", "0", 1440, 900],
  ["hero03", "0.3", 1440, 900],
  ["scrub075", "0.75", 1440, 900],
  ["scrub09", "0.9", 1440, 900],
  ["hero0-m", "0", 390, 844],
];
for (const [name, scrub, w, h] of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:5310/?scrub=${scrub}`, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 4500));
  await page.screenshot({ path: `${OUT}wm-${name}.jpg`, type: "jpeg", quality: 72 });
  console.log("shot", name);
  await page.close();
}
await browser.close();
