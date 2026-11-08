import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
await pg.goto("https://hawaii22.ru", { waitUntil: "networkidle2", timeout: 40000 });
await new Promise((r) => setTimeout(r, 2200));
await pg.evaluate(() => {
  [...document.querySelectorAll("button,a")].find((x) => /принять/i.test(x.textContent))?.click();
});
await new Promise((r) => setTimeout(r, 800));
await pg.evaluate(() => document.querySelector("#houses article")?.click());
await new Promise((r) => setTimeout(r, 2200));
// выбрать даты 10 и 12 (или первые свободные кликабельные)
await pg.evaluate(() => {
  const days = [...document.querySelectorAll("button,div,span")].filter(e => /^\s*1[0-2]\s*$/.test(e.textContent) && e.closest("[class*=calendar], [class*=Calendar], [class*=grid]"));
  days.forEach(d => d.click());
});
await new Promise((r) => setTimeout(r, 1500));
// проскроллить правую колонку модалки вниз — там форма
await pg.evaluate(() => {
  const scrollables = [...document.querySelectorAll("*")].filter(e => e.scrollHeight > e.clientHeight + 100 && e.clientHeight > 200);
  scrollables.forEach(s => { s.scrollTop = s.scrollHeight; });
});
await new Promise((r) => setTimeout(r, 1500));
await pg.screenshot({ path: "public/cases/hawaii22/booking.png" });
console.log("done");
await b.close();
