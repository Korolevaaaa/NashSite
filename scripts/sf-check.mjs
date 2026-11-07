import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new", args: ["--enable-unsafe-swiftshader"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:5310/#templates", { waitUntil: "networkidle0" });
await new Promise(r => setTimeout(r, 2500));
const type = async (text) => page.evaluate((t) => {
  const inp = document.querySelector(".sf-search");
  const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  s.call(inp, t);
  inp.dispatchEvent(new Event("input", { bubbles: true }));
}, text);
const cards = () => page.$$eval(".sf-card__title", els => els.map(e => e.textContent));
const total = (await cards()).length;
await type("суши");
await new Promise(r => setTimeout(r, 400));
const sushi = await cards();
await type("zzzz");
await new Promise(r => setTimeout(r, 400));
const empty = await page.$eval(".sf-empty", e => e.textContent.slice(0, 50)).catch(() => null);
await type("");
await page.evaluate(() => [...document.querySelectorAll(".sf-chip")].find(b => b.textContent === "Сайты")?.click());
await new Promise(r => setTimeout(r, 400));
const siteCards = await cards();
const subChips = await page.$$eval(".sf-chips--sub .sf-chip", els => els.map(e => e.textContent));
console.log(JSON.stringify({ total, sushi, empty, siteCards, subChips }, null, 1));
await browser.close();
