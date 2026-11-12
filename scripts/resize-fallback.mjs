/* Уменьшает robot-fallback.webp (900px) до 680px для srcset —
   Lighthouse: изображение больше контейнера (max 340px). */
import { readFileSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const SRC = "public/assets/robot/robot-fallback.webp";
const OUT = "public/assets/robot/robot-fallback-680.webp";
const WIDTH = 680;

const b64 = readFileSync(SRC).toString("base64");
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "shell",
});
const page = await browser.newPage();
const dataUri = await page.evaluate(async (b64src, w) => {
  const img = new Image();
  img.src = `data:image/webp;base64,${b64src}`;
  await img.decode();
  const h = Math.round((img.naturalHeight * w) / img.naturalWidth);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.getContext("2d").drawImage(img, 0, 0, w, h);
  return c.toDataURL("image/webp", 0.85);
}, b64, WIDTH);
await browser.close();

const buf = Buffer.from(dataUri.split(",")[1], "base64");
writeFileSync(OUT, buf);
console.log(`${OUT}: ${buf.length} bytes`);
